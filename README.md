# Yishuv — community website

A single-page static site for families interested in joining Yishuv. It explains the vision,
what community life will be like, the plan and timeline, FAQs, and has two forms:
**Request a brochure** and **Sign up to join**.

No build step — just HTML, CSS and JavaScript.

## Files

| File | What it is |
| --- | --- |
| `index.html` | All page content (edit text here) |
| `styles.css` | Colours, fonts and layout (colours are at the top) |
| `script.js` | Mobile menu and form submission |
| `config.js` | Where form submissions are sent |
| `assets/favicon.svg` | Logo / browser icon |

## Before you launch: fill in the placeholders

Search `index.html` for `[` to find every placeholder, e.g. `[Region]`, `[Year]`,
`[XX]` families, `[location]`, `[Timeframe]`, the religious-character FAQ answer,
pricing and schools. Also replace `hello@example.com` and `[Phone number]` in the footer.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Publishing & receiving form submissions

**Option A — Netlify (easiest).** Drag this folder onto https://app.netlify.com/drop
(or connect this GitHub repo). Forms work automatically: submissions appear under
*Site → Forms*, and you can enable email notifications there. Leave `config.js` empty.

**Option B — any other host (GitHub Pages, etc.).** Create two free forms at
https://formspree.io (one for brochures, one for sign-ups) and paste their endpoint
URLs into `config.js`. Submissions are emailed to you.
