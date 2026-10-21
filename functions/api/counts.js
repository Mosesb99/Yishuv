// GET /api/counts — live totals from the Google Sheet (via the Apps Script web app).
// Cached at Cloudflare's edge for 5 minutes so the sheet isn't hit on every page view.
// Setting: SHEET_WEBHOOK_URL (the Apps Script /exec URL)
export async function onRequestGet({ request, env, waitUntil }) {
  const cache = caches.default;
  const key = new Request(new URL("/api/counts", request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;

  if (!env.SHEET_WEBHOOK_URL) return new Response("not configured", { status: 503 });
  try {
    const res = await fetch(env.SHEET_WEBHOOK_URL, { redirect: "follow" });
    const data = await res.json();
    const counts = {
      families: Number(data.families) || 0,
      israel: Number(data.israel) || 0,
      abroad: Number(data.abroad) || 0,
      children: Number(data.children) || 0,
      updated: data.updated || null
    };
    const response = Response.json(counts, { headers: { "Cache-Control": "public, max-age=300" } });
    waitUntil(cache.put(key, response.clone()));
    return response;
  } catch (err) {
    console.error("counts error", err);
    return new Response("unavailable", { status: 502 });
  }
}
