/**
 * Yishuv website <-> Google Sheet bridge.
 * Paste into the sheet: Extensions → Apps Script, then Deploy → New deployment → Web app
 * (Execute as: Me, Who has access: Anyone). Give the /exec URL to the website setup.
 *
 * GET  → totals only (no names or contact details), for the counters on the site.
 * POST → appends a website sign-up to the "Website sign-ups" tab (needs the secret).
 */
const SECRET = "PASTE_SECRET_HERE";         // must match SHEET_WEBHOOK_SECRET on Netlify
const FAMILIES_TAB = "רישום משפחות";
const SIGNUPS_TAB = "Website sign-ups";
const COUNTRY_COL = 8;                       // H: מדינת מגורים
const CHILDREN_COL = 12;                     // L: מספר ילדים
const ISRAEL = ["ישראל", "israel", "ארץ ישראל"];

function doGet() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get("counts");
  if (cached) return json_(JSON.parse(cached));

  const sheet = SpreadsheetApp.getActive().getSheetByName(FAMILIES_TAB);
  const rows = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 0), CHILDREN_COL).getDisplayValues();
  let families = 0, israel = 0, abroad = 0, children = 0;

  rows.forEach(function (r) {
    if (!r.some(function (v) { return String(v).trim() !== ""; })) return;   // empty row
    families++;
    const country = String(r[COUNTRY_COL - 1]).trim().toLowerCase();
    if (ISRAEL.indexOf(country) !== -1) israel++;
    else if (country) abroad++;
    const kids = parseInt(String(r[CHILDREN_COL - 1]).trim(), 10);
    if (!isNaN(kids)) children += kids;
  });

  const counts = { families: families, israel: israel, abroad: abroad, children: children,
                   updated: new Date().toISOString() };
  cache.put("counts", JSON.stringify(counts), 300);   // 5 minutes
  return json_(counts);
}

// body.fields is a list of [column heading, value]. Missing headings are added at the end,
// so new form questions get their own column without changing this script.
function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  if (body.secret !== SECRET) return json_({ ok: false, error: "forbidden" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(SIGNUPS_TAB);
    const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0].map(String);
    const column = function (heading) {
      let i = headers.indexOf(heading);
      if (i === -1) {
        i = headers.filter(String).length;
        headers[i] = heading;
        sheet.getRange(1, i + 1).setValue(heading);
      }
      return i;
    };

    const id = String(body.id || "");
    const idCol = column("Netlify ID");
    if (id && sheet.getLastRow() > 1) {
      const ids = sheet.getRange(2, idCol + 1, sheet.getLastRow() - 1, 1).getValues().flat().map(String);
      if (ids.indexOf(id) !== -1) return json_({ ok: true, duplicate: true });
    }

    const row = [];
    row[column("Received")] = new Date();
    row[idCol] = id;
    (body.fields || []).forEach(function (pair) { row[column(pair[0])] = pair[1] == null ? "" : pair[1]; });
    for (let i = 0; i < headers.length; i++) if (row[i] === undefined) row[i] = "";
    sheet.appendRow(row);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
