// GET /api/signups-export?key=<SHEET_WEBHOOK_SECRET>
// Downloads every website sign-up stored in Cloudflare KV (binding SIGNUPS) as a CSV file that
// opens in Excel or Google Sheets. Includes a "Saved to sheet" column, so sign-ups that never
// reached the Google Sheet are easy to spot.
export async function onRequestGet({ request, env }) {
  const key = new URL(request.url).searchParams.get("key");
  if (!env.SHEET_WEBHOOK_SECRET || key !== env.SHEET_WEBHOOK_SECRET) {
    return new Response("Not found", { status: 404 });
  }
  if (!env.SIGNUPS) return new Response("Storage not configured", { status: 503 });

  const records = [];
  let cursor;
  do {
    const page = await env.SIGNUPS.list({ prefix: "signup:", cursor });
    const values = await Promise.all(page.keys.map((k) => env.SIGNUPS.get(k.name, "json")));
    records.push(...values.filter(Boolean));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  const headings = ["Received", "Saved to sheet", "Suspected spam"];
  for (const r of records) for (const [h] of r.fields) if (!headings.includes(h)) headings.push(h);

  const cell = (v) => {
    const text = String(v == null ? "" : v).replace(/^'/, "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = [headings.map(cell).join(",")];
  for (const r of records) {
    const byHeading = Object.fromEntries(r.fields);
    byHeading.Received = r.received;
    byHeading["Saved to sheet"] = r.savedToSheet ? "Yes" : "No";
    byHeading["Suspected spam"] = r.spam || "";
    lines.push(headings.map((h) => cell(byHeading[h])).join(","));
  }

  const date = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="website-signups-${date}.csv"`,
      "Cache-Control": "no-store"
    }
  });
}
