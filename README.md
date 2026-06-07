# SierraZim Training Academy — Website

Marketing website for **SierraZim Training Academy** (Sierrazim Limited) — defensive
driving, heavy-vehicle, surface mobile equipment and agriculture operator training,
assessment and certification.

Built with **Next.js 16 (App Router) · Tailwind CSS v4 · Phosphor Icons**, statically
generated for speed and SEO.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build (static export of all routes)
npm run start    # serve the production build
npm run lint
```

## Design language

A bespoke "field-manual" art direction — deliberately not a generic template:

- **Type:** Bricolage Grotesque (display), Hanken Grotesk (body), Space Mono
  (technical labels) — wired via `next/font` in `src/app/layout.tsx`.
- **Palette:** warm paper, forest green, safety amber, red-earth clay. Tokens live
  in `src/app/globals.css` under `@theme` (`paper`, `forest-*`, `safety-*`, `clay-*`).
- **Motifs:** hairline rules, blueprint grid, index numbers, a certification "seal",
  square (non-rounded) industrial edges, flat surfaces (no soft glow shadows).

## Editing content

Almost all copy and data is centralised in **`src/lib/site.ts`**:

- `site` — name, contact details, phones, address, hours, leadership.
- `services` — the 7 programmes (title, copy, features, icon, image). Drives the
  services pages **and** the static `/services/[slug]` routes, sitemap and JSON-LD.
- `clients`, `valueProps`, `stats`, `gallery`.

Change it there and every page, the sitemap and structured data update automatically.

## Structure

```
src/
  app/
    layout.tsx              root layout: fonts, metadata, header/footer, Org JSON-LD
    page.tsx                home
    about/  services/  portfolio/  gallery/  contact/   pages
    services/[slug]/        static service detail pages
    portfolio/[slug]/       static case-study pages
    sitemap.ts  robots.ts   SEO route files
    icon.png  apple-icon.png  favicons (generated from the logo)
  components/
    site-header.tsx  site-footer.tsx
    contact-form.tsx
    sections/               home/page section blocks
    ui/                     container, button-link, eyebrow, logo, page-header
  lib/
    site.ts                 <- single source of content
    structured-data.ts      JSON-LD builders
    utils.ts
public/
  brand/logo.png
  gallery/*.jpg             curated training photos
```

## SEO included

- Per-page `<title>`/description, canonical URLs, Open Graph + Twitter cards.
- `sitemap.xml` and `robots.txt` (generated).
- JSON-LD: `EducationalOrganization` + `LocalBusiness` site-wide; `Service` and
  `BreadcrumbList` on each programme page.
- Semantic headings, descriptive `alt` text, optimised `next/image`.

> **Before launch:** set the real production domain in `SITE_URL`
> (`src/lib/site.ts`) — it drives canonicals, sitemap and structured data.

## Things to confirm / wire up

- **Portfolio photos:** only the **DADTCO Mozambique** case study uses photos from
  that actual engagement. The other case studies (Sierra Rutile, Sierra Tropical,
  Frontier Buses, Miro Forestry, Mantrac) reuse representative training photos as
  placeholders — replace the `image`/`gallery` fields in `caseStudies` (`site.ts`)
  with real client photos when available. Also confirm the case-study copy/outcomes.
- **Stats numbers** (`stats` in `site.ts`) are sensible defaults — adjust to real
  figures if available (e.g. drivers trained, years operating).
- **Contact form** currently opens the visitor's email app, pre-filled, to
  `info@sierrazim.com` (works with zero backend). To deliver straight to an inbox,
  wire a form service (e.g. Resend or Formspree) in `src/components/contact-form.tsx`.
- **Map** embeds Makeni via Google Maps — swap in the exact address/pin when known.
- **Deployment:** ready for Vercel (`vercel` / push to a connected repo). It's a
  static site, so any static host works too.
