# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

American Chassidish families, both bnei Torah and baalei batim, considering a new moshav in Eretz Yisroel:

- working and kollel families already in Eretz Yisroel who came "for a few years" and want to stay;
- families already living in Yerushalayim in cramped apartments;
- families in America (Monsey, Brooklyn, Lakewood and similar communities) with established careers, ready to make aliyah.

Most visitors arrive from a link shared on WhatsApp and read on a phone. Their job on the site: understand the idea, judge whether it is serious and affordable, and sign up their family for the founding garin. The site is in English, with Yiddish and Hebrew lines as part of the voice.

## Product Purpose

Recruit founding families for a heimishe Chassidishe moshav in the hills of Binyamin, about half an hour from Yerushalayim. Success means families submit the sign-up form (full family details, boys and girls with ages) and join the garin; the target is 50+ founding families to show the authorities real demand.

## Positioning

A kehilla built by American Chassidish families, for American Chassidish families, organised by the families themselves rather than a developer: every founding family has an equal say. Founders get land through bar-reshut or a ~50-year lease for a symbolic sum and pay mainly for infrastructure (about ₪200,000 per 500 m² plot, versus roughly ₪2,000,000 buying later), plus a caravilla on 0% financing that is theirs after 2½ years.

## Operating Context

- Families compare this with renting or buying in Yerushalayim, Beit Shemesh and other cities, and with staying in America.
- The project is in its founding stage: forming the garin (Stage A), then caravillas (Stage B), then zoning and permanent homes (Stage C). Working with the Mateh Binyamin Regional Council; possibly one of two approved yishuvim off Route 443.
- Live sign-up counts come from the team's Google Sheet and update on the site automatically.
- The owner edits all copy and numbers in a browser-based admin (Decap CMS) without touching code.

## Capabilities and Constraints

- Static site: Eleventy builds `index.njk` from `_data/site.json`; hosted on Cloudflare Pages with small Pages Functions for the sign-up form and live counters. No framework.
- Every word, number and image must stay editable in the admin; every key in `_data/site.json` needs a matching field in `admin/config.yml`.
- Undecided: the moshav's final name (the site uses the working name "Yishuv"), the exact site, a logo, and the Rav.

## Brand Commitments

- Content and facts come from the owner's brochure (`Refrence docs/…V3.0.pdf`); its look is not binding and the website is free to have its own identity.
- Voice: warm, heimish, plain-spoken; Yiddish and Hebrew phrases (בס״ד, a pasuk from Tehillim, ובשם ה׳ נעשה ונצליח) belong to the voice.
- Contact: yishuvproject@gmail.com, M. Lebovits 929-474-8086 (call/WhatsApp).
- The owner has asked that the site not look AI-generated or templated.
- Standing preference (chosen 2026-10-21 over bolder notice-board and seforim-binding directions): the
  category standard for a new community, executed at full craft. Quality bar: serenbe.com and
  kiawahriver.com (photography-led, calm, generous white space). Not wanted: cream backgrounds,
  green-dominant palettes, pop-ups or ad-like promotions (the Babcock Ranch pattern).

## Evidence on Hand

- Real figures: live family and children counts; history timeline; aliyah and demographic statistics with sources (DellaPergola/JPR 2026, Israel Democracy Institute 2023, Ministry of Education 2025); plot and caravilla prices.
- Images: only AI-generated concept renderings from the brochure (`assets/img/`), labelled as illustrative. No real photographs of the land, the families or the founders yet.
- No testimonials, named founders, or Rav endorsement on hand. Do not invent any.

## Product Principles

- Specific over general: real numbers, prices, dates and places carry the persuasion.
- Families first: sign-up must be easy on a phone opened from WhatsApp.
- Honest about the stage: ideas are ideas, estimates are estimates, images are illustrative.
- Built by its founders: the families decide, and the site should feel like it comes from them, not from a developer.

## Accessibility & Inclusion

- Phone-first reading; readable contrast; form usable with one thumb.
- Mixed right-to-left (Hebrew, Yiddish) and left-to-right text must both render correctly.
