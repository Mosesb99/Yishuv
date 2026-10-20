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

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  if (body.secret !== SECRET) return json_({ ok: false, error: "forbidden" });

  const d = body.data || {};
  const sheet = SpreadsheetApp.getActive().getSheetByName(SIGNUPS_TAB);
  const id = String(body.id || "");
  if (id && sheet.getLastRow() > 1) {
    const ids = sheet.getRange(2, 9, sheet.getLastRow() - 1, 1).getValues().flat().map(String);
    if (ids.indexOf(id) !== -1) return json_({ ok: true, duplicate: true });
  }
  sheet.appendRow([
    new Date(), d.name || "", d.email || "", d.phone || "", d.children || "",
    d.situation || "", d.stage || "", d.message || "", id
  ]);
  return json_({ ok: true });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
