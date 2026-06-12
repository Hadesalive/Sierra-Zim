# Architecture

The website and its CMS are **one Next.js 16 app**. Payload 3 is embedded in the same
codebase rather than run as a separate service, so there is a single deploy, a single
build, and the public pages can read content directly from Payload's local API (no
network hop).

```
                 ┌─────────────────────────── Next.js app ───────────────────────────┐
   Visitor  ──▶  │  src/app/(frontend)/   public marketing site (static / SSG)        │
                 │        │ reads via                                                  │
                 │        ▼                                                            │
                 │  src/lib/content.ts  ──▶  Payload local API  ──▶  Neon Postgres     │
                 │                                   ▲                                 │
   Editor   ──▶  │  src/app/(payload)/    admin UI + REST/GraphQL                      │
                 │        │ on save                          media ▼                   │
                 │        ▼                                  Vercel Blob               │
                 │  revalidatePath('/', 'layout')  ──▶  refresh affected pages         │
                 └────────────────────────────────────────────────────────────────────┘
```

## Two root layouts (route groups)

Payload's admin ships its own `<html>` document, which cannot coexist with the site's
root layout. So the app is split into two **route groups**, each with its own root
layout:

- **`src/app/(frontend)/`** — the public site. Its `layout.tsx` sets fonts, metadata,
  the header/footer, and the organisation JSON-LD.
- **`src/app/(payload)/`** — the Payload admin (`/admin`) and API
  (`/api/*`, `/api/graphql`). These files are thin re-exports of Payload's Next
  integration; the admin import map lives in `(payload)/admin/importMap.js`.

Route groups (the parentheses) don't affect URLs — `(frontend)/about/page.tsx` still
serves `/about`.

## The content layer

Pages and components **never import content data directly**. They call typed async
getters in **`src/lib/content.ts`**, which query Payload's local API via
**`src/lib/payload.ts`** (`getPayload({ config })`, cached per process):

```ts
const programmes = await getProgrammes();   // ProgrammeItem[]
const site = await getSite();               // SiteSettings (with derived fields)
const { about, contact } = await getPages();
```

Each getter returns a **stable, typed shape** and coerces Payload's nullable fields
(`str`/`num`/`arr`/`mediaUrl`/`relSlug` helpers). This insulation means the CMS behind
the getters could change again without touching the page/component layer.

Relationships (e.g. a sector's programmes/clients, a case study's services) are stored
as references and resolved to **slugs** at `depth: 1`; images resolve to their public
**Blob URL**.

## Media (Vercel Blob)

Uploads go to the `media` collection, backed by Vercel Blob. The collection sets
`disablePayloadAccessControl: true`, so each file's `url` is the **direct public Blob
CDN URL** (e.g. `https://<store>.public.blob.vercel-storage.com/<file>.jpg`) instead of
a per-request Payload proxy route. `next.config.ts` allows that host in
`images.remotePatterns`, so `next/image` optimises them.

## Instant publishing

The public pages are in Next's **Full Route Cache** (statically prerendered). To make
edits appear without a rebuild, every collection and global has `afterChange` /
`afterDelete` hooks (`src/lib/revalidate.ts`) that call:

```ts
revalidatePath('/', 'layout');
```

This busts the cache for the whole site, so the next request re-renders the affected
pages from the database — typically within a second or two. `revalidatePath` only works
inside a Next request; the hook lazily imports `next/cache` in a `try/catch`, so the
same config still loads under the CLI and the seed script (outside a request).

Content is cross-cutting (one programme appears on the home page, the services index,
its own page, plus sector and case-study pages) and edits are occasional, so a
full-site revalidation is the simplest way to keep every page consistent.

## Rendering model

`next build` queries Neon and **prerenders every public route**:

- Static: `/`, `/about`, `/contact`, `/gallery`, `/portfolio`, `/sectors`,
  `/services`, `/sitemap.xml`, `/robots.txt`.
- SSG (via `generateStaticParams`): `/services/[slug]`, `/portfolio/[slug]`,
  `/sectors/[slug]`.
- Dynamic (server-rendered): the Payload `/admin` and `/api/*` routes.

So the marketing site is fast and SEO-friendly, while the admin/API run on demand.

## Icons stay in code

Per the design rules, **icons are not CMS-editable**. `src/lib/icons.ts` maps a
collection slug to a Phosphor icon and exposes renderer components
(`ProgrammeIcon`, `ValuePropIcon`) so the mapping satisfies React's static-component
lint rule. Everything else about a programme/value-prop is editable.

## Seeding & migrations

- **Seed:** `scripts/seed.ts` is a one-off that imported `src/content/*.json` into Neon
  and uploaded `public/gallery/*` to Blob. `src/content/` now exists only as that seed
  source — the live site does not read it.
- **Migrations:** the schema is migration-managed (`src/migrations/`, committed). See
  [development.md](development.md) and [deploy.md](deploy.md).

## Key files

| File | Role |
| --- | --- |
| `src/payload.config.ts` | CMS schema: collections, globals, Postgres + Blob adapters, revalidation wiring |
| `src/lib/content.ts` | Typed getters the frontend reads from |
| `src/lib/payload.ts` | Local-API client (`getPayload`) |
| `src/lib/revalidate.ts` | Instant-publish hooks |
| `src/lib/icons.ts` | Slug → icon maps (icons in code) |
| `src/lib/metadata.ts` | Shared OpenGraph fields per page |
| `src/lib/structured-data.ts` | JSON-LD builders |
| `src/lib/site.ts` | Non-content config (SITE_URL, nav, gallery types) |
| `next.config.ts` | `withPayload(...)` + Blob image host |
