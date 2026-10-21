// POST /api/join — the website sign-up form (Cloudflare Pages Function).
// 1. Adds the sign-up to the "Website sign-ups" tab of the Google Sheet
//    (the sheet's Apps Script also emails a notification).
// 2. Adds the person to the MailerLite mailing list, when configured.
//
// Settings (Cloudflare → Workers & Pages → the project → Settings → Variables and Secrets):
//   SHEET_WEBHOOK_URL     the Apps Script web app /exec URL
//   SHEET_WEBHOOK_SECRET  the same secret as in the Apps Script
//   MAILERLITE_API_KEY    (optional) MailerLite → Integrations → API → Generate new token
//   MAILERLITE_GROUP_ID   (optional) MailerLite → Subscribers → Groups → the group's ID

const REQUIRED = ["family_name", "email", "phone", "country"];
const MIN_FILL_MS = 3000; // bots submit instantly; people take longer than 3 seconds

// Google Sheets reads text starting with = + - @ as a formula (a "+972…" phone becomes #ERROR!).
// A leading apostrophe makes the sheet store it as plain text.
function asText(value) {
  const text = value == null ? "" : String(value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function sheetFields(d) {
  const boys = parseInt(d.boys, 10) || 0;
  const girls = parseInt(d.girls, 10) || 0;
  const children = d.boys || d.girls ? String(boys + girls) : "";
  const name = [d.husband_name, d.wife_name].filter(Boolean).join(" & ") + (d.family_name ? " " + d.family_name : "");

  // Column heading → value. The sheet script adds any heading that's missing.
  return [
    ["Name", name.trim()],
    ["Email", d.email],
    ["Phone / WhatsApp", d.phone],
    ["Children", children],
    ["How they'd like to join", d.stage],
    ["Message", d.message],
    ["Family name", d.family_name],
    ["Husband's first name", d.husband_name],
    ["Husband's age", d.husband_age],
    ["Husband's occupation", d.husband_occupation],
    ["Wife's first name", d.wife_name],
    ["Wife's age", d.wife_age],
    ["Wife's occupation", d.wife_occupation],
    ["Country", d.country],
    ["City", d.city],
    ["Boys", d.boys],
    ["Boys' ages", d.boys_ages],
    ["Girls", d.girls],
    ["Girls' ages", d.girls_ages],
    ["Interest level", d.interest],
    ["Move timeframe", d.timeframe],
    ["Temporary housing?", d.temp_housing],
    ["Help with organizing", d.help],
    ["Share with Amana?", d.amana ? "Yes" : "No"]
  ].map(([heading, value]) => [heading, asText(value)]);
}

async function addToSheet(env, id, d) {
  if (!env.SHEET_WEBHOOK_URL || !env.SHEET_WEBHOOK_SECRET) throw new Error("sheet not configured");
  const res = await fetch(env.SHEET_WEBHOOK_URL, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: env.SHEET_WEBHOOK_SECRET, id, fields: sheetFields(d) })
  });
  const text = await res.text();
  if (!res.ok || !text.includes('"ok":true')) throw new Error(`sheet ${res.status}: ${text.slice(0, 200)}`);
}

async function addToMailingList(env, d) {
  if (!env.MAILERLITE_API_KEY || !d.email) return;
  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.MAILERLITE_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      email: d.email,
      fields: {
        name: [d.husband_name, d.wife_name].filter(Boolean).join(" & "),
        last_name: d.family_name || "",
        phone: d.phone || ""
      },
      groups: env.MAILERLITE_GROUP_ID ? [env.MAILERLITE_GROUP_ID] : []
    })
  });
  if (!res.ok) console.error("mailerlite", res.status, await res.text());
}

export async function onRequestPost({ request, env, waitUntil }) {
  const reply = (body, status = 200) => Response.json(body, { status });

  let d;
  try {
    d = Object.fromEntries(await request.formData());
  } catch {
    return reply({ ok: false, error: "bad request" }, 400);
  }

  const id = crypto.randomUUID();
  const received = new Date().toISOString();

  // Spam checks: the hidden honeypot field must be empty, and the form can't be filled within
  // seconds. The fill time ("e") is measured on the visitor's own device, so a phone or computer
  // whose clock is wrong is never mistaken for a bot. Suspected spam still gets a normal "ok" (so
  // bots don't retry) and is kept, flagged, rather than thrown away.
  const elapsed = parseInt(d.e, 10);
  const spam = d["bot-field"] ? "hidden field filled" : !(elapsed >= MIN_FILL_MS) ? "sent too fast" : "";
  if (spam) {
    if (env.SIGNUPS) {
      const record = { id, received, savedToSheet: false, spam, fields: sheetFields(d) };
      waitUntil(env.SIGNUPS.put(`signup:${received}:${id}`, JSON.stringify(record)).catch((err) => console.error("kv", err)));
    }
    return reply({ ok: true });
  }

  if (REQUIRED.some((key) => !String(d[key] || "").trim())) {
    return reply({ ok: false, error: "missing fields" }, 422);
  }

  // Every sign-up is also kept in Cloudflare KV (binding SIGNUPS), so nothing is lost if the
  // Google Sheet can't be reached. Download them all at /api/signups-export?key=<sheet secret>.
  let sheetError = null;
  try {
    await addToSheet(env, id, d);
  } catch (err) {
    console.error(err);
    sheetError = String(err.message || err);
  }

  let stored = false;
  if (env.SIGNUPS) {
    try {
      const record = { id, received, savedToSheet: !sheetError, sheetError, fields: sheetFields(d) };
      await env.SIGNUPS.put(`signup:${received}:${id}`, JSON.stringify(record));
      stored = true;
    } catch (err) {
      console.error("kv", err);
    }
  }

  if (sheetError && !stored) return reply({ ok: false, error: "could not save" }, 502);
  waitUntil(addToMailingList(env, d));
  return reply({ ok: true });
}
