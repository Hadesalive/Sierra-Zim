# SierraZim Training Academy — Website

Marketing website **and CMS** for **SierraZim Training Academy** (Sierrazim Limited) —
defensive driving, heavy-vehicle, surface mobile equipment and agriculture operator
training, assessment and certification in Makeni, Sierra Leone.

Every piece of content (except icons) is editable in a built-in admin. The public
site is statically prerendered for speed and SEO; edits publish **instantly** without
a rebuild.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack, React 19) |
| Styling | **Tailwind CSS v4** (`@theme` tokens, no config file) + Phosphor Icons |
| CMS | **Payload 3** (embedded in the same Next app) |
| Database | **Neon Postgres** (`@payloadcms/db-postgres`) |
| Media | **Vercel Blob** (`@payloadcms/storage-vercel-blob`) |
| Hosting | **Vercel** |

The project is **ESM** (`"type": "module"` in `package.json`) — required by Payload's
CLI and standalone scripts.

## Quick start

```bash
npm install
cp .env.example .env      # then fill in PAYLOAD_SECRET, DATABASE_URI, BLOB_READ_WRITE_TOKEN
npm run dev               # http://localhost:3000  ·  admin at /admin
```

First run: visit **`/admin`** and create the first admin user, then manage content.
See **[docs/development.md](docs/development.md)** for the full local setup, scripts,
and how to seed content.

```bash
npm run build    # payload generate:importmap && next build
npm run start    # serve the production build
npm run lint
npm run migrate  # apply Payload DB migrations
```

## How content works

- Content lives in **Payload** (Neon Postgres); images live in **Vercel Blob**.
- Pages read content through the typed getters in **`src/lib/content.ts`** (Payload's
  local API) — never by importing data directly.
- **Icons stay in code** (`src/lib/icons.ts`, mapped by slug) — everything else is
  editable in the admin.
- Editing in `/admin` triggers on-demand revalidation, so changes appear on the live
  site within seconds — no rebuild.

What's editable: programmes, sectors, case studies, clients, value props, FAQs, the
gallery (images **and** videos), plus site settings and all home/about/contact/index
page copy. Full field reference: **[docs/content-model.md](docs/content-model.md)**.

## Documentation

- **[docs/architecture.md](docs/architecture.md)** — how the system fits together
  (route groups, content layer, media, instant publishing, SSG).
- **[docs/content-model.md](docs/content-model.md)** — the CMS schema: every
  collection, global and field.
- **[docs/development.md](docs/development.md)** — local setup, env vars, npm scripts,
  seeding, type generation, adding a field/collection.
- **[docs/deploy.md](docs/deploy.md)** — deploying to Vercel (env vars, first admin
  user, migrations, domain).

## Design language

A bespoke "field-manual" art direction — deliberately not a generic template:

- **Type:** Bricolage Grotesque (display), Hanken Grotesk (body), Space Mono
  (technical labels) — wired via `next/font` in `src/app/(frontend)/layout.tsx`.
- **Palette:** warm paper, forest green, safety amber, red-earth clay. Tokens live in
  `src/app/(frontend)/globals.css` under `@theme` (`paper`, `forest-*`, `safety-*`,
  `clay-*`).
- **Motifs:** hairline rules, blueprint grid, index numbers, a certification "seal",
  square industrial edges, flat surfaces.

## Project structure

```
src/
  app/
    (frontend)/             the public marketing site (its own root layout)
      layout.tsx            fonts, metadata, header/footer, Org JSON-LD
      page.tsx              home
      about/ services/ portfolio/ gallery/ sectors/ contact/
      services/[slug]/  portfolio/[slug]/  sectors/[slug]/   detail routes
      sitemap.ts  robots.ts  globals.css
    (payload)/              the Payload admin + REST/GraphQL API
      admin/  api/  layout.tsx
  collections/              Payload collections (Programmes, Sectors, …, Media, Users)
  globals/                  Payload globals (Site, Home, Pages)
  fields/shared.ts          reusable field helpers (slug, order, index hero)
  lib/
    content.ts              typed getters — pages read content from here
    payload.ts              the Payload local-API client
    revalidate.ts           on-demand revalidation hooks (instant publishing)
    icons.ts                slug → icon maps (icons stay in code)
    metadata.ts             shared OpenGraph helper
    structured-data.ts      JSON-LD builders
    site.ts                 non-content config (SITE_URL, nav, gallery types)
  content/                  seed data (JSON) — source for scripts/seed.ts only
  migrations/               Payload DB migrations (committed)
  payload.config.ts         the CMS schema + adapters
scripts/seed.ts             one-off: src/content → Neon + Blob
public/                     logo, favicons, gallery photos
docs/                       documentation (see above)
```

## SEO

- Per-page `<title>`/description, canonical URLs, Open Graph + Twitter cards (each
  page emits its own — see `src/lib/metadata.ts`).
- `sitemap.xml` and `robots.txt` (generated, CMS-driven).
- JSON-LD: `EducationalOrganization` + `LocalBusiness` site-wide; `Course` + FAQ +
  `BreadcrumbList` where relevant.

> **Before launch:** set the real production domain in `SITE_URL`
> (`src/lib/site.ts`) — it drives canonicals, sitemap and structured data.
