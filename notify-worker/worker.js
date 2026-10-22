// yishuv-notify: emails each website sign-up to the team, through Cloudflare Email Routing.
// It has no public address (workers_dev = false); only the website's /api/join function reaches
// it, through the NOTIFY service binding on the Pages project.
//
// Deploy: cd notify-worker && npx wrangler deploy
// The "to" address must be a verified destination in Email Routing for yishuvchasidi.com.
import { EmailMessage } from "cloudflare:email";

const FROM = "signups@yishuvchasidi.com";
const TO = "yishuvproject@gmail.com";

// Base64 of UTF-8 text, wrapped at 76 characters, so Hebrew and Yiddish names arrive intact.
function base64(text) {
  let binary = "";
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/.{76}/g, "$&\r\n");
}

const header = (text) => `=?UTF-8?B?${base64(text).replace(/\r\n/g, "")}?=`;

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("Not found", { status: 404 });
    const { fields = [], received, savedToSheet } = await request.json();
    const byHeading = Object.fromEntries(fields);
    const clean = (v) => String(v == null ? "" : v).replace(/^'/, "");

    const lines = fields
      .filter(([, value]) => clean(value))
      .map(([heading, value]) => `${heading}: ${clean(value)}`);
    lines.push("", `Received: ${received}`);
    lines.push(savedToSheet ? "Also added to the Google Sheet." : "NOT in the Google Sheet (the sheet could not be reached). It is saved on the website; download all sign-ups from /api/signups-export.");

    const name = clean(byHeading.Name) || clean(byHeading["Family name"]) || "a new family";
    const replyTo = clean(byHeading.Email).replace(/[\r\n<>]/g, "");
    const headers = [
      `From: Yishuv website <${FROM}>`,
      `To: ${TO}`,
      `Subject: ${header(`New sign-up: ${name}`)}`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${crypto.randomUUID()}@yishuvchasidi.com>`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64"
    ];
    if (replyTo) headers.push(`Reply-To: ${replyTo}`); // hitting Reply answers the family
    const raw = headers.join("\r\n") + "\r\n\r\n" + base64(lines.join("\r\n"));

    await env.EMAIL.send(new EmailMessage(FROM, TO, raw));
    return Response.json({ ok: true });
  }
};
