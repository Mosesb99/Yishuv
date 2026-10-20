// Runs automatically on Netlify after every verified form submission.
// 1. Adds the sign-up to the "Website sign-ups" tab of the Google Sheet.
// 2. Adds the person to the MailerLite mailing list.
//
// Set these in Netlify → Project configuration → Environment variables:
//   SHEET_WEBHOOK_URL     the Apps Script web app /exec URL
//   SHEET_WEBHOOK_SECRET  the same secret as in the Apps Script
//   MAILERLITE_API_KEY    MailerLite → Integrations → API → Generate new token
//   MAILERLITE_GROUP_ID   (optional) MailerLite → Subscribers → Groups → the group's ID
// Google Sheets reads text starting with = + - @ as a formula (a "+972…" phone becomes #ERROR!).
// A leading apostrophe makes the sheet store it as plain text.
function asText(value) {
  const text = value == null ? "" : String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

async function addToSheet(payload) {
  const url = process.env.SHEET_WEBHOOK_URL;
  const secret = process.env.SHEET_WEBHOOK_SECRET;
  if (!url || !secret) return "sheet not configured";

  const data = {};
  for (const [key, value] of Object.entries(payload.data || {})) data[key] = asText(value);

  const res = await fetch(url, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, id: payload.id, data })
  });
  const text = await res.text();
  if (!res.ok || !text.includes('"ok":true')) throw new Error(`sheet ${res.status}: ${text.slice(0, 200)}`);
  return "sheet ok";
}

async function addToMailingList(data) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey || !data.email) return "mailerlite not configured";

  const groupId = process.env.MAILERLITE_GROUP_ID;
  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      email: data.email,
      fields: { name: data.name || "", phone: data.phone || "" },
      groups: groupId ? [groupId] : []
    })
  });
  if (!res.ok) throw new Error(`mailerlite ${res.status}: ${await res.text()}`);
  return "mailerlite ok";
}

exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body);
  if (payload.form_name !== "join") return { statusCode: 200, body: "skipped" };

  const results = await Promise.allSettled([addToSheet(payload), addToMailingList(payload.data || {})]);
  results.forEach((r) => (r.status === "rejected" ? console.error(r.reason) : console.log(r.value)));
  return { statusCode: 200, body: "done" };
};
