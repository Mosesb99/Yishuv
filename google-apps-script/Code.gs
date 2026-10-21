/**
 * Yishuv website <-> Google Sheet bridge.
 * Paste into the sheet: Extensions → Apps Script, then Deploy → New deployment → Web app
 * (Execute as: Me, Who has access: Anyone). Give the /exec URL to the website setup.
 *
 * GET  → totals only (no names or contact details), for the counters on the site.
 *        Counts the main list plus website sign-ups, skipping sign-ups whose email or phone
 *        is already in the main list (or earlier in the sign-ups tab), and test rows.
 * POST → appends a website sign-up to the "Website sign-ups" tab (needs the secret)
 *        and emails NOTIFY_EMAIL the details.
 */
const SECRET = "PASTE_SECRET_HERE";         // must match SHEET_WEBHOOK_SECRET on Netlify
const FAMILIES_TAB = "רישום משפחות";
const SIGNUPS_TAB = "Website sign-ups";
const NOTIFY_EMAIL = "yishuvproject@gmail.com";   // who gets an email for each website sign-up
const PHONE_COL = 10;                        // J: טלפון / וואטסאפ
const EMAIL_COL = 11;                        // K: דוא״ל
const COUNTRY_COL = 8;                       // H: מדינת מגורים
const CHILDREN_COL = 12;                     // L: מספר ילדים
const ISRAEL = ["ישראל", "israel", "ארץ ישראל", "eretz yisroel"];

// Every email in a cell (cells can hold several, e.g. "a@x.com / b@y.com")
function emails_(text) {
  return (String(text).toLowerCase().match(/[^\s\/,;]+@[^\s\/,;]+/g) || []);
}

// Every phone in a cell, as its last 9 digits, so 054…, +972 54… and 97254… all match
function phones_(text) {
  return String(text).split(/[\/\n,;]|וואטסאפ|נוסף|whatsapp/i)
    .map(function (part) { return part.replace(/\D/g, ""); })
    .filter(function (digits) { return digits.length >= 7; })
    .map(function (digits) { return digits.slice(-9); });
}

function doGet() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get("counts-v2");
  if (cached) return json_(JSON.parse(cached));

  const book = SpreadsheetApp.getActive();
  let families = 0, israel = 0, abroad = 0, children = 0;
  const seen = {};
  const remember = function (keys) { keys.forEach(function (k) { seen[k] = true; }); };
  const isKnown = function (keys) { return keys.some(function (k) { return seen[k]; }); };

  // 1. Main list
  const main = book.getSheetByName(FAMILIES_TAB);
  const rows = main.getRange(2, 1, Math.max(main.getLastRow() - 1, 0), CHILDREN_COL).getDisplayValues();
  rows.forEach(function (r) {
    if (!r.some(function (v) { return String(v).trim() !== ""; })) return;   // empty row
    families++;
    const country = String(r[COUNTRY_COL - 1]).trim().toLowerCase();
    if (ISRAEL.indexOf(country) !== -1) israel++;
    else if (country) abroad++;
    const kids = parseInt(String(r[CHILDREN_COL - 1]).trim(), 10);
    if (!isNaN(kids)) children += kids;
    remember(emails_(r[EMAIL_COL - 1]).concat(phones_(r[PHONE_COL - 1])));
  });

  // 2. Website sign-ups not already in the main list
  const signups = book.getSheetByName(SIGNUPS_TAB);
  if (signups && signups.getLastRow() > 1) {
    const all = signups.getDataRange().getDisplayValues();
    const head = all[0];
    const col = function (name) { return head.indexOf(name); };
    const get = function (r, name) { const i = col(name); return i === -1 ? "" : String(r[i]).trim(); };

    all.slice(1).forEach(function (r) {
      const label = (get(r, "Name") + " " + get(r, "Family name")).toLowerCase();
      if (!label.trim() || /please delete|^test\b/.test(label.trim())) return;   // blank or test row
      const keys = emails_(get(r, "Email")).concat(phones_(get(r, "Phone / WhatsApp")));
      if (isKnown(keys)) return;                                                   // duplicate
      remember(keys);
      families++;

      const country = get(r, "Country").toLowerCase();
      const where = get(r, "Where they live now").toLowerCase();
      if (ISRAEL.indexOf(country) !== -1 || (!country && /eretz yisroel|yerushalayim/.test(where))) israel++;
      else if (country || /america/.test(where)) abroad++;

      let kids = parseInt(get(r, "Children"), 10);
      if (isNaN(kids)) kids = (parseInt(get(r, "Boys"), 10) || 0) + (parseInt(get(r, "Girls"), 10) || 0);
      children += kids;
    });
  }

  const counts = { families: families, israel: israel, abroad: abroad, children: children,
                   updated: new Date().toISOString() };
  cache.put("counts-v2", JSON.stringify(counts), 300);   // 5 minutes
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
    notify_(body.fields || []);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Email the sign-up details (skipped quietly if Gmail refuses, so the row is still saved)
function notify_(fields) {
  try {
    const value = function (name) {
      const pair = fields.filter(function (p) { return p[0] === name; })[0];
      return pair ? String(pair[1]).replace(/^'/, "") : "";
    };
    const lines = fields
      .filter(function (p) { return String(p[1]).trim() !== ""; })
      .map(function (p) { return p[0] + ": " + String(p[1]).replace(/^'/, ""); });
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: value("Email") || NOTIFY_EMAIL,
      subject: "New website sign-up: " + (value("Name") || value("Family name") || "family"),
      body: lines.join("
") + "

Saved in the \"" + SIGNUPS_TAB + "\" tab: " + SpreadsheetApp.getActive().getUrl()
    });
  } catch (err) {
    console.error(err);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
