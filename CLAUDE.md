# Yishuv website — project context

This file carries over the conversation so far, so any new Claude session picks up where we left off.

## What this is

A recruitment website for a new **heimishe Chassidishe moshav in Binyamin** (Yehudah V'Shomron),
built by and for American Chassidish families. Domain: **yishuvchasidi.com** (registered at Cloudflare).

Stack (decided Oct 2026, owner wants every word editable via one admin login):
- Eleventy 3 builds `index.njk` from `_data/site.json` (ALL copy, numbers and image paths live there;
  `**bold**` is allowed via the `md` filter). Output `_site/`.
- Decap CMS at `/admin` (`admin/config.yml`, GitHub backend). Login uses the GitHub OAuth provider
  installed on the old Netlify project (`base_url: https://api.netlify.com`,
  `site_domain: yishuvchasidi.netlify.app`), so keep that Netlify project. Every key in site.json must
  have a matching field in config.yml, or a save could drop it. Keep them in sync.
- **Hosting moved to Cloudflare Pages (2026-10-21)** because Netlify's free plan (300 credits, 15
  per deploy) ran out. Cloudflare builds from GitHub on push (`npm run build` → `_site`, Node from
  `.node-version`). Pages Functions: `functions/api/join.js` (sign-up form: honeypot + 3-second
  minimum fill time, then POST to the sheet script and optional MailerLite) and
  `functions/api/counts.js` (live totals, 5-min edge cache). Cloudflare variables: SHEET_WEBHOOK_URL,
  SHEET_WEBHOOK_SECRET (+ optional MAILERLITE_API_KEY, MAILERLITE_GROUP_ID).
- Old Netlify project **yishuvchasidi** (id fb5aca35-a86f-4dd1-aff7-a3e6197ce4ed, team mmm790793) is
  kept only for the admin login. The owner's other Netlify project `legendary-fudge-7ce8c4` is an
  unrelated cleaning-business site. Never touch it.
- Email: Cloudflare Email Routing `info@` → yishuvproject@gmail.com, plus Gmail "send as".
- Site stays English with Yiddish/Hebrew accents (no full translation planned).
- The owner edits through /admin, which commits "Update site content" to GitHub. Always `git pull`
  before editing `_data/site.json`. An admin tab opened before a code push can save stale content
  over it (happened 2026-10-16: it dropped `counters`, which was restored in b2af9b1).
- Google Sheet "Yishuv Family Signup" (id 1qQAnCnK7M3fJkCEK8Lf_JvRwfAXWlZCJ5Ab5rpXLUIQ; owner
  Lebovits, editor yishuvproject@gmail.com; Claude's Drive connector = smestatesusa@gmail.com, viewer).
  Bound Apps Script web app (source `google-apps-script/Code.gs`; the deployed copy has the real
  secret). The owner pastes updates and deploys them via Manage deployments → New version.
  GET returns totals from tab "רישום משפחות" (col H country, col L children) **plus** rows in
  "Website sign-ups" whose email/phone isn't already known (test rows skipped). POST appends to
  "Website sign-ups" by column heading (adds missing columns) and emails NOTIFY_EMAIL.
  Counter backup numbers in site.json are used only if the sheet can't be reached.
- Domain registered at Cloudflare (nameservers quentin/vera.ns.cloudflare.com).

## Design (Impeccable)

- Redesign lives on branch `redesign` (preview: https://redesign.yishuvchasidi.pages.dev) until the
  owner says "make it live"; then merge into `claude/community-recruitment-site-t98qrh`.
- Design tool: Impeccable skill (installed globally, telemetry off, no hooks). `PRODUCT.md` holds
  product truth, `DESIGN.md` + `.impeccable/design.json` hold the visual system, and
  `.impeccable/surfaces/index-njk.md` holds the direction contract. Owner chose the
  "category standard" (Serenbe / Kiawah River bar) and a split hero: photo left fading into the text.
- Run `impeccable detect --json <built page>` after UI changes; it was at 0 findings.
- Open item: photo quality (hero is a softened AI render; the two real Binyamin photos are flat).

## Source of truth: the brochure

`Refrence docs/A Heimishe Chassidishe Moshav in Eretz Yisroel for American Families V3.0.pdf`
(8 pages; a copy is served at `assets/yishuv-brochure.pdf` for download). The site (Oct 2026
rebuild) follows the brochure section by section: cover → history → today's stats → challenges &
answers → mission → 3-stage process → founders' numbers → vision → join.

Key facts from it: ½ hour from Yerushalayim; possibly one of two approved yishuvim off Route 443
(Givat Ze'ev–Modi'in); working with Mateh Binyamin. Garin target 50+ families, **22 committed**
(update `data-committed` on `.garin` in `index.html`). Caravilla purchase at 0% over 30 months
(confirmed); rental in discussion with Amana. Plot infrastructure ~₪200k (~$65k) per 500 m² vs
~₪2M buying later; ~$1M all-in for a ~300 m² home. Contact: yishuvproject@gmail.com,
M. Lebovits 929-474-8086 (call/WhatsApp).

Audience: kollel families in EY who want to stay, families already in Yerushalayim, and families in
America ready to make aliyah — bnei Torah and baalei batim.

## Images

The brochure PDF only contains flattened full-page JPEGs (text baked in). `assets/img/hills.jpg`,
`village-concept.jpg` and `house-terraces.jpg` are crops of the clean photo areas, downscaled 3× and
then AI-upscaled 4× with Real-ESRGAN (`realesrgan-x4plus`), plus a gentle highlight tone-down on
hills/house. The owner has no source files, no real photos (project is still conceptual) and no logo
yet. All imagery is illustrative: the hero carries an "Illustrative concept" note and the village image
keeps its "AI-generated concept · illustrative only" caption. Keep those labels.

## Open items for the owner

1. Real photos of the land once a site is chosen (replace the illustrative images).
2. Brochure cover has a stray "Your text here" text box next to "Moshav" — fix before sharing the PDF.
3. Logo (currently a placeholder house icon in `assets/favicon.svg`).
4. Launch steps in README (domain, Netlify, OAuth, MailerLite, email routing) are the owner's to do.
5. Rav / founding families — anything they want shown publicly?
6. Older notes (Monsey-style families, "Make aliyah without giving up your backyard") were from before
   the brochure; brochure wording now takes precedence.
