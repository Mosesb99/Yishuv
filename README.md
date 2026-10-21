# Yishuv — community website (yishuvchasidi.com)

A one-page site for the Chassidishe moshav in Binyamin, with an admin editor, a sign-up form and a
mailing list.

| Part | Tool | Cost |
| --- | --- | --- |
| Hosting | Cloudflare Pages (builds the site from this GitHub repo on every push) | Free, 500 builds/month |
| Sign-up form + live counters | Cloudflare Pages Functions in `functions/api/` | Free |
| Sign-ups list + email alerts | Google Sheet "Yishuv Family Signup" + its Apps Script (`google-apps-script/Code.gs`) | Free |
| Admin editor | Decap CMS at `/admin` (GitHub login, via the GitHub OAuth app on the old Netlify project) | Free |
| Mailing list | MailerLite (optional; every sign-up is added once the key is set) | Free up to 1,000 |
| Domain + email forwarding | Cloudflare | ~$11/year |

## How it fits together

- **All text, numbers and images** live in `_data/site.json`. Edit them in the editor at
  `yishuvchasidi.com/admin`; publishing saves to GitHub and Cloudflare rebuilds in about a minute.
- `index.njk` is the page layout, `styles.css` the design, and `script.js` the menu, animations,
  counters and form.
- `functions/api/join.js` receives the sign-up form and adds it to the sheet's "Website sign-ups" tab
  (the sheet script then emails yishuvproject@gmail.com). Spam protection: hidden honeypot field plus
  a minimum fill time.
- `functions/api/counts.js` serves the live totals (main list + new website sign-ups, without
  duplicates) to the counters, cached for 5 minutes.

## Cloudflare Pages settings

Build command `npm run build`, output directory `_site`, production branch
`claude/community-recruitment-site-t98qrh`. Variables and secrets: `SHEET_WEBHOOK_URL`,
`SHEET_WEBHOOK_SECRET`, and optionally `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`.

## Preview on your computer

```sh
npm install
npm run build && npx wrangler pages dev _site   # site + functions at http://localhost:8788
npx decap-server                                # in a second window: lets /admin edit local files
```
