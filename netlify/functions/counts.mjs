// /api/counts — live totals from the Google Sheet (via the Apps Script web app).
// Cached at Netlify's edge for 5 minutes so the sheet isn't hit on every page view.
// Env: SHEET_WEBHOOK_URL (the Apps Script /exec URL)
export default async () => {
  const url = process.env.SHEET_WEBHOOK_URL;
  if (!url) return new Response("not configured", { status: 503 });

  try {
    const res = await fetch(url, { redirect: "follow" });
    const data = await res.json();
    const counts = {
      families: Number(data.families) || 0,
      israel: Number(data.israel) || 0,
      abroad: Number(data.abroad) || 0,
      children: Number(data.children) || 0,
      updated: data.updated || null
    };
    return Response.json(counts, {
      headers: {
        "Cache-Control": "public, max-age=60",
        "Netlify-CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400"
      }
    });
  } catch (err) {
    console.error("counts error", err);
    return new Response("unavailable", { status: 502 });
  }
};

export const config = { path: "/api/counts" };
