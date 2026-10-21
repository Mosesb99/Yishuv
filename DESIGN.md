---
name: Yishuv
description: A calm, photography-led recruitment site for a new Chassidish moshav in the hills of Binyamin.
colors:
  white: "#ffffff"
  soft-band: "#f5f6f4"
  charcoal-ink: "#1f2328"
  slate-text: "#4a5058"
  quiet-grey: "#5e646c"
  hairline: "#dfe2e0"
  field-stroke: "#c4c8ca"
  brass: "#8b6a35"
  brass-deep: "#75592b"
  night: "#1f2328"
  on-night: "#f1f2f0"
  on-night-quiet: "#c6cacd"
  success: "#2f6b3f"
  error: "#a3361f"
typography:
  display:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.1rem, 3.6vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1.12
  headline:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "1.3rem"
    fontWeight: 400
    lineHeight: 1.15
  numeral:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.6rem, 5vw, 3.8rem)"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "tnum, lnum"
  body:
    fontFamily: "Assistant, Arial, Segoe UI, Helvetica, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.65
  lede:
    fontFamily: "Assistant, Arial, Segoe UI, Helvetica, sans-serif"
    fontSize: "clamp(1.08rem, 1.4vw, 1.22rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Assistant, Arial, Segoe UI, Helvetica, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.14em"
  hebrew:
    fontFamily: "Frank Ruhl Libre, Times New Roman, serif"
    fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)"
    fontWeight: 500
    lineHeight: 1.3
rounded:
  none: "0px"
spacing:
  gutter: "clamp(20px, 4vw, 48px)"
  container: "1200px"
  nav-height: "72px"
  section: "clamp(80px, 10vw, 128px)"
  column-gap: "72px"
  list-row: "20px"
components:
  button-primary:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.brass-deep}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 26px"
    height: "50px"
  button-outline-hover:
    backgroundColor: "{colors.charcoal-ink}"
    textColor: "{colors.white}"
  nav-cta:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.none}"
    padding: "12px 18px"
  nav-cta-hover:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.white}"
  input-text:
    backgroundColor: "{colors.white}"
    textColor: "{colors.charcoal-ink}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
    height: "48px"
---

# Design System: Yishuv

## Overview

**Creative North Star: "The Open Hillside"**

The site behaves like a well-made brochure for a planned community at the Serenbe / Kiawah River standard: the landscape leads, the words are few and calm, and the sign-up is always a thumb away. The ground is plain white, the ink is a cool charcoal, and the photographs carry nearly all the colour. A single brass accent marks the primary action and a handful of small signals; everything else is type, hairlines and space.

Density is low and generous. Sections breathe on 80–128px of vertical padding, content is organised by thin rules rather than boxes, and a rhythm of white, cool off-white bands and one charcoal band paces the long single page. Depth is almost absent: corners are square, there are no cards and no lifted surfaces. Photographs either run full bleed or dissolve softly into the white page through a gradient mask, never ending in a hard frame edge.

The world explicitly refuses the cream-serif-terracotta "AI site" look, green-dominant palettes, and developer pop-ups or promo banners.

**Key Characteristics:**
- White ground, cool off-white bands, one charcoal band; photography supplies colour.
- One brass accent, reserved for the primary action and small marks.
- Libre Caslon Text headlines at regular weight over Assistant text; Frank Ruhl Libre for Hebrew and Yiddish.
- Square corners, hairline rules, no cards, no shadows at rest.
- Photographs dissolve into the page with gradient masks instead of hard edges.

## Colors

A cool, near-monochrome neutral palette with one warm metallic accent; the imagery does the rest.

### Primary
- **Brass** (brass): the solid primary button, the mobile "Join" button, focus rings, caret, selection tint, checkbox/radio accent, and the goal tick on the garin grid. Nothing decorative.
- **Deep Brass** (brass-deep): primary-button hover, and brass used as text (timeline years, stage letters, step numerals, form legends, status lines, text links), where the darker value keeps small type legible on white.

### Neutral
- **White** (white): the page ground, nav, hero text column and form fields.
- **Soft Band** (soft-band): a cool off-white for alternating full-width bands (statement, feature, join). Never cream.
- **Charcoal Ink** (charcoal-ink): all headings and body text; also the strong rule above content groups and the filled squares of the garin grid.
- **Slate Text** (slate-text): secondary copy, ledes, descriptions under headings.
- **Quiet Grey** (quiet-grey): captions, sources, "as of" notes, the בס״ד mark.
- **Hairline** (hairline): every light divider: list rows, counter separators, ledger rows.
- **Field Stroke** (field-stroke): form field borders at rest.

### Night band
- **Night** (night): background of the single dark section (the numbers / price comparison) and the footer. Same value as Charcoal Ink, used as a surface.
- **On Night** (on-night) and **On Night Quiet** (on-night-quiet): primary and secondary text on the night band; dividers there are `rgba(241,242,240,.18)`.

### Status
- **Success** (success) and **Error** (error): form status text only; invalid fields take the error border on a pale `#fbf1ee` fill.

### Named Rules
**The One Brass Rule.** Brass is the only chromatic colour the interface owns. It marks the primary action and small signals; it never fills a band, a heading or a decorative shape.

**The Photographs Carry Colour Rule.** Surfaces stay white, cool off-white or charcoal. Any warmth or green on the page comes from the imagery, not from UI fills.

**The One Night Band Rule.** The page has exactly one dark content section (the numbers), plus the footer. Do not add a second dark band; its rarity is what makes the price comparison land.

## Typography

**Display Font:** Libre Caslon Text (with Georgia, Times New Roman)
**Body Font:** Assistant (with Arial, Segoe UI, Helvetica)
**Hebrew / Yiddish Font:** Frank Ruhl Libre (with Times New Roman), applied by `lang="he"` / `lang="yi"`

**Character:** A bookish, regular-weight transitional serif for everything that speaks, set against a clean humanist sans for everything that informs; the Hebrew serif sits naturally beside the Caslon.

### Hierarchy
- **Display** (400, clamp(2.1rem → 3.4rem), 1.12): the hero headline only.
- **Headline** (400, clamp(1.9rem → 2.9rem), 1.15, -0.01em): section headings; balanced wrapping.
- **Title** (400, 1.2–1.5rem serif): item headings in lists, ledger rows, stage points.
- **Numeral** (400 serif, clamp(2.6rem → 3.8rem), 1, tabular lining figures): live counts, headline prices and other figures that carry the argument. Smaller serif numerals (2–2.4rem) for inline figures.
- **Body** (400, 18px, 1.65): running text; paragraphs held to 44–64ch.
- **Lede** (400, clamp(1.08rem → 1.22rem), 1.6, slate): the one sentence under a section heading, max 46ch.
- **Label** (600, 0.72–0.82rem, 0.12–0.14em, uppercase): buttons, nav links, form-group legends and the small "Stage" mark under each stage letter only.

### Named Rules
**The Regular Weight Rule.** Serif headings are always weight 400. Emphasis comes from size and space, never from bold serif.

**The Figures Are Type Rule.** Numbers that persuade (counts, prices, years) are set in the serif with tabular lining figures, large, on their own line, not in body text.

## Layout

A single long page in a 1200px container with a fluid gutter (clamp(20px, 4vw, 48px)). Sections run on 80–128px vertical padding and alternate white, soft band and, once, night. The fixed nav is 72px tall; anchors account for it via scroll padding.

The recurring grid is an asymmetric two-column split: 5fr heading column against 7fr content (sticky heading on desktop), and its mirror, 7fr photo against 5fr text, in the hero. Feature sections pair an image half with a text half on the soft band. Lists of three (points, ideas, who) use equal three-column grids with 24–40px gutters. Full-bleed landscape plates (280–620px tall, cover-cropped) break the page between sections.

Responsive behaviour: at 900px and below, splits collapse to one column, the sticky heading becomes static, and the nav becomes a menu toggle plus a compact brass "Join" button. In the hero, the photo moves on top at 36vh (min 220px) and fades downward into the page; both hero buttons go full width. Three-column grids collapse at 760–860px; counters drop to two columns at 700px.

## Elevation & Depth

Flat. Hierarchy comes from tonal bands (white / soft / night) and hairline rules, not from shadows. Two functional exceptions exist: a one-pixel hairline under the nav once the page scrolls, and a soft drop under the open mobile menu so it reads above the content.

### Shadow Vocabulary
- **Nav scrolled** (`box-shadow: 0 1px 0 #dfe2e0`): a hairline, not a shadow; appears only after scrolling.
- **Mobile menu** (`box-shadow: 0 12px 24px -12px rgba(31,35,40,.25)`): the open dropdown panel only.

### Named Rules
**The Flat Page Rule.** Nothing on the page is lifted at rest. If a surface needs separation, use a band change or a rule.

**The Dissolve Rule.** Photographs that sit beside text fade into the page through a gradient mask (horizontal on desktop, vertical on phones) rather than ending in a hard edge.

## Shapes

Square everywhere: buttons, fields, bars, grid cells and image crops all use a 0 radius. Structure is drawn with 1px rules: a light hairline between rows, a charcoal rule on top of each content group (points, figures, who, form). No cards, no outlined boxes around content. Data shapes are plain rectangles: horizontal bars for comparisons, a 30-column grid of small squares for the garin count with a thin brass tick marking the goal.

## Components

### Buttons
Quiet, tracked capitals; confident without shouting.
- **Shape:** square (0 radius), 50px tall (56px when full width in the form).
- **Primary:** brass fill, white tracked uppercase label, 26px side padding.
- **Hover / Focus:** fill deepens to deep brass over 0.2s on the site ease; focus is a 2px brass outline offset 3px.
- **Outline:** 1px charcoal border, charcoal label; fills charcoal with white text on hover.

### Navigation
White bar (96% opacity, light blur), 72px tall. Serif wordmark left with a small grey בס״ד beside it; tracked uppercase links right with a 1px outlined "Join" button that fills brass on hover. On phones: a three-line toggle opens a full-width white panel of ruled links, and a compact brass "Join" button stays visible in the bar.

### Inputs / Fields
- **Style:** white field, 1px field-stroke border, square, 48px tall, 12px × 14px padding, label above in 600 weight.
- **Hover / Focus:** border darkens to `#9aa0a5` on hover; on focus a 2px brass outline sits on a brass border.
- **Error:** error-red border on a pale `#fbf1ee` fill, shown only after a submit attempt. Radios and checkboxes use the brass accent colour at 20px.
- **Groups:** form sections are separated by hairlines and introduced by a small brass tracked-caps legend.

### Ruled Lists (signature)
The workhorse pattern: rows separated by hairlines with a fixed-width left column (a year, a step numeral, a Hebrew stage letter in deep brass) and text to the right. Used for history, stages, steps to join and the challenges ledger. Never wrapped in cards.

### Counters
Centered row of large serif numerals over short slate labels, separated by vertical hairlines, with a quiet "as of" note beneath.

### Comparison Bars (night band)
Square horizontal bars on charcoal: a pale bar for the founder price, a slate bar for the later price, each followed by a large serif figure in white. Bars grow in from zero when scrolled into view (1.4s on the site ease), instantly under reduced motion.

## Do's and Don'ts

### Do:
- **Do** keep surfaces to white, soft band (#f5f6f4) and the single night band; let photographs supply colour.
- **Do** reserve brass for the primary action, focus states and small marks; use deep brass when brass is set as text.
- **Do** set headings in Libre Caslon Text at 400 and persuasive figures as large serif tabular numerals.
- **Do** organise content with hairline rules and a charcoal top rule per group, on square corners.
- **Do** fade photographs into the page with a gradient mask when they sit beside text.
- **Do** keep image notes ("illustrative") visible on renderings.

### Don't:
- **Don't** use cream or warm beige grounds, green-dominant palettes, or terracotta accents.
- **Don't** add pop-ups, promo banners or ad-like call-outs.
- **Don't** round corners or wrap content in cards or shadowed boxes.
- **Don't** add a second dark content band.
- **Don't** use bold serif headings or tracked uppercase outside buttons, nav, form legends and stage marks.
