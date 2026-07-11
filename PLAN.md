# Norbert — Portfolio Site Plan

A fast, good-looking one-page personal site for **Norbert**, a Hungarian ⇄ English
translator who also teaches music. One person, one brand, two services.

> **Status:** PLAN ONLY — nothing built yet. This file is the brief.
> **Goal in one line:** a warm, professional single page that books translation clients
> *and* music students, loads instantly, and works on a phone.

---

## 0. Locked decisions (defaults — change any before building)

1. **Stack: Astro (static output), content in JSON.** All copy lives in a typed JSON content
   file — the components read from it and Astro renders **static HTML at build time with
   near-zero JS shipped** to the browser. Fast to load, trivial to edit (change words in JSON,
   never touch markup), and it matches the `portfolio-rework` setup on this machine (Astro 5,
   Node 20). Ships `dist/` → drag-to-Netlify or git-linked deploy.
2. **Bilingual HU ⇄ EN, JSON-keyed.** Every string exists as `{ "hu": "…", "en": "…" }` in the
   content JSON. A `[ HU | EN ]` switch top-right flips the active language. For a *translator*,
   the site itself is the portfolio piece — it must read flawlessly in both. Default language =
   Hungarian (home market); choice persisted in `localStorage`. (See §4 for the mechanism —
   both languages ship in the DOM for SEO; the toggle is the only client JS besides the menu.)
3. **Equal billing, one page.** Translation and Music Lessons are two halves of one identity,
   not two mini-sites. Shared hero, shared contact.
4. **No stock-photo clutter.** One real portrait of Norbert + clean typography + a soft accent
   color do the work. Everything else is CSS (no image-heavy hero).
5. **Zero third-party requests where avoidable.** Self-host or system-stack the font; SVG icons
   inline; no analytics by default (add later if wanted). Fast + private.

---

## 1. Who it's for (audience → what they need)

- **Translation clients** (agencies, businesses, individuals needing documents, websites,
  certificates, subtitles): want to know language pair, specialties, turnaround, rates/quote,
  and *trust* (credentials, sample/testimonial). CTA = **request a quote**.
- **Prospective music students / parents** (local + online): want instrument(s), levels taught,
  lesson format (in-person/online), price, and a friendly first impression. CTA = **book a
  trial lesson**.
- Both value: a real human, quick response, clear pricing, proof he's good.

---

## 2. Page structure (top → bottom)

1. **Sticky header** — name/logotype left · nav (About · Translation · Music · Contact) ·
   `[HU|EN]` toggle right. Collapses to a hamburger under ~720px.
2. **Hero** — portrait + name + one-line dual tagline
   (*"Hungarian–English translator & music teacher."*) + two side-by-side CTA buttons:
   **Get a translation quote** / **Book a music lesson**. Both scroll to the relevant section.
3. **About** — 2–3 short paragraphs: background, languages, what makes him trustworthy
   (years of experience, education, region). Small "at a glance" chips: *Native Hungarian ·
   Fluent English · Online worldwide*.
4. **Translation** (service block A) — headline, sub-services as cards
   (Documents · Websites & marketing · Certificates/official · Subtitles/transcription),
   short "how it works" 3-step (Send → Quote → Delivered), and a note on turnaround.
   CTA → contact with subject preset "Translation".
5. **Music Lessons** (service block B) — headline, instrument(s) + levels, format
   (in-person / online), who it's for (beginners → advanced, kids & adults), simple price line
   or "from X / lesson." CTA → contact with subject preset "Music".
6. **Testimonials / trust** (optional, ship empty-ready) — 2–3 short quotes, star row or a
   simple card. Placeholder copy until Norbert supplies real ones.
7. **Contact** — the conversion point. A dependency-free form (name · email · service
   dropdown [Translation / Music / Other] · message) + direct email + optional phone. Form
   posts to a simple handler (see §6). Response-time promise ("usually within 24h").
8. **Footer** — name · email · social (if any) · language toggle again · © year.

*Section order can flip to Translation-led later by moving block A above About.*

---

## 3. Visual design

- **Tone:** warm, calm, trustworthy, a little cultured (nods to both language & music).
  Not corporate-cold, not childish.
- **Color:** one accent + neutrals. Proposed: deep teal/ink `#1f5f5b` accent, warm off-white
  `#faf8f4` background, near-black `#1a1a1a` text, soft accent tint for section bands. A single
  gold/amber micro-accent (`#c8973f`) for the music side to gently distinguish it.
- **Type:** a characterful but readable serif for headings (e.g. *Fraunces* / *Spectral* /
  system Georgia fallback) + a clean sans for body (*Inter* / system UI stack). Self-host the
  woff2 or fall back to the system stack for zero requests.
- **Layout:** generous whitespace, max content width ~1080px, comfortable line-length. Cards
  with soft shadows + subtle rounded corners. One tasteful motif — e.g. a faint musical-note
  or quotation-mark watermark — used sparingly.
- **Motion:** subtle fade/slide-in on scroll (IntersectionObserver), respects
  `prefers-reduced-motion`. Nothing heavy.
- **Dark mode:** optional, via `prefers-color-scheme` — nice-to-have, not required for v1.

---

## 4. Content model & bilingual mechanism (JSON-driven)

**All content lives in `src/content/site.json`** (typed via a TS interface + optional Zod
schema in `src/content/config.ts`). Astro imports it and renders every section from data — no
copy hardcoded in markup. Editing the site = editing JSON.

Shape (every user-facing string is a `{ hu, en }` pair):

```jsonc
{
  "meta":   { "title": { "hu": "…", "en": "…" }, "description": { "hu": "…", "en": "…" } },
  "brand":  { "name": "Norbert …", "tagline": { "hu": "…", "en": "…" } },
  "nav":    [ { "id": "about", "label": { "hu": "Rólam", "en": "About" } }, … ],
  "hero":   { "heading": {…}, "sub": {…}, "ctaTranslate": {…}, "ctaMusic": {…} },
  "about":  { "heading": {…}, "body": [ {…}, {…} ], "chips": [ {…}, … ] },
  "translation": {
    "heading": {…}, "intro": {…},
    "services": [ { "title": {…}, "desc": {…} }, … ],
    "steps":    [ { "title": {…}, "desc": {…} }, … ]
  },
  "music": {
    "heading": {…}, "intro": {…},
    "instruments": [ {…} ], "levels": {…}, "format": {…}, "price": {…}
  },
  "testimonials": [ { "quote": {…}, "author": "…" } ],
  "contact": { "heading": {…}, "email": "…", "phone": "…", "note": {…},
               "form": { "name": {…}, "message": {…}, "subjectOptions": [ {…} ] } }
}
```

**Rendering + toggle:**
- Astro components (`Hero.astro`, `Translation.astro`, …) receive the JSON slice and emit
  **both** language strings into the DOM, e.g. `<span data-i18n data-hu="…" data-en="…">`, or
  render both and hide the inactive one with a `[lang]` CSS rule. Both languages ship statically
  → crawlable, no flash, works with JS off (defaults to HU).
- A ~15-line inline script handles the toggle: set `document.documentElement.lang`, swap the
  visible strings, persist to `localStorage`, restore on load. This + the mobile menu are the
  *only* client JS.
- `<title>`, meta description, and form labels/placeholders all read from the same JSON and
  switch too.
- **SEO:** correct `lang` attribute; both languages present in source. If it ever grows, split
  into `/` (hu) + `/en` routes with `hreflang` — the JSON model already supports it (just pick a
  language per route at build time instead of shipping both).

---

## 5. Accessibility & performance

- Semantic landmarks (`header/main/section/footer`), real `<button>`/`<a>`, labelled form
  fields, visible focus rings, alt text on the portrait, color contrast ≥ WCAG AA.
- Keyboard-navigable nav + toggle; hamburger is a real button with `aria-expanded`.
- Perf budget: **< 100 KB total** on first load excluding the portrait; portrait as an
  optimized/compressed `.webp` (with `.jpg` fallback), `loading="lazy"` below the fold.
- Lighthouse target: 95+ across the board. No render-blocking third-party anything.

---

## 6. Contact form (no backend to run)

Pick one at build time:
- **Netlify Forms** — add the `data-netlify` attr to the `<form>`; zero backend code, works on
  Netlify hosting (matches `portfolio-rework`'s deploy target). Recommended.
- **Formspree / Web3Forms** — a single POST endpoint, works on any static host.
- **`mailto:` fallback** — always present as a plain email link (from `contact.email` in the
  JSON) so it works with no service at all.

The destination email + phone live in `site.json` (`contact.email` / `contact.phone`) — one
place. Service dropdown (`contact.form.subjectOptions`) prefills from whichever CTA was clicked
(Translation vs Music) via a URL hash read by the same inline script.

---

## 7. Content Norbert needs to supply (collect before/while building)

- [ ] Portrait photo (landscape or square, decent resolution).
- [ ] Full name + preferred logotype spelling; any tagline he likes.
- [ ] About text (or bullet facts → I draft it): experience, education, region, languages.
- [ ] **Translation:** specialties, document types, whether he does certified/official work,
      typical turnaround, and rate model (per word / per page / per project / "quote only").
- [ ] **Music:** instrument(s) taught, levels, in-person area + online yes/no, price line,
      age groups.
- [ ] 2–3 testimonials (name + one line each), if available.
- [ ] Contact email (+ phone/social if he wants them public).
- [ ] Domain name, if chosen (e.g. `norbert-translations.hu` / `.com`).

*Everything not yet supplied ships as clearly-marked placeholder copy so the site is complete
and viewable from day one.*

---

## 8. Build order (each step viewable via `npm run dev`)

- **P0 — Scaffold:** `npm create astro` (minimal, static). Add the `Layout.astro` + a single
  `src/pages/index.astro`. Confirm dev server runs.
- **P1 — Content model:** author `src/content/site.json` (all sections, EN + HU placeholder
  copy) + the TS type in `src/content/config.ts`. This is the spine everything reads from.
- **P2 — Components:** one `.astro` component per section (Header, Hero, About, Translation,
  Music, Testimonials, Contact, Footer), each fed its JSON slice. Semantic structure, no styling
  yet. Confirm the whole page renders from data.
- **P3 — Style:** the full CSS design system (§3) — global tokens, hero, cards, header, footer,
  responsive down to 360px.
- **P4 — Bilingual:** dual-language rendering + the toggle script + persistence (§4).
- **P5 — Interactions:** mobile menu, smooth scroll, scroll-reveal (IntersectionObserver),
  CTA→contact subject prefill.
- **P6 — Contact + polish:** wire the form (§6), favicon, meta/OG tags, self-hosted font,
  optimize the portrait (Astro `<Image>` or pre-optimized webp), reduced-motion/contrast pass.
- **P7 — Ship:** `npm run build`, test `dist/` on phone + desktop, run Lighthouse, deploy.

---

## 9. Deliverable

```
Websites/Norbert/
  src/
    content/
      site.json          ← ALL copy (hu + en) — the single edit surface
      config.ts          ← TS type / Zod schema for site.json
    components/
      Header.astro  Hero.astro  About.astro  Translation.astro
      Music.astro   Testimonials.astro  Contact.astro  Footer.astro
    layouts/
      Layout.astro       ← <head>, meta/OG, font, global CSS, i18n toggle script
    pages/
      index.astro        ← composes the components
    styles/
      global.css         ← design tokens + shared rules
  public/
    norbert.webp         ← portrait (+ .jpg fallback)
    favicon.svg
  astro.config.mjs  package.json  tsconfig.json
  PLAN.md                ← this file
```

Builds to a static `dist/` — deploys by drag-and-drop or git-linked Netlify. Fast (near-zero
JS), bilingual, and the JSON content file means Norbert (or you) can update every word without
touching a component. The site *is* the translator's proof-of-work.

> **Note (this machine):** system Node is 16 but Astro 5 needs Node 20 — a portable Node 20
> already lives at `C:\Users\domin\.tools\node-v20.x-win-x64` (used by `portfolio-rework`).
> Reuse it (or its `npm20` wrapper) for `install` / `dev` / `build` here too.

---

## 10. Open questions for Norbert (won't block starting P1)

1. Default language HU or EN? (plan assumes **HU**.)
2. Translation pricing shown, or "request a quote" only?
3. Which instrument(s), and does he teach online, in-person, or both?
4. Certified/official translations offered? (affects trust copy.)
5. Any brand color he already uses, or is the proposed teal/amber fine?
