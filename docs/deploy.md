# Deploying SierraZim (Payload CMS) to Vercel

The site is Next.js 16 with Payload 3 embedded, backed by **Neon Postgres** and
**Vercel Blob**. The public site prerenders statically from the database at build
time; content edits publish instantly via on-demand revalidation.

## 1. Environment variables (Vercel → Project → Settings → Environment Variables)

Set all three for the **Production** (and Preview) environments:

| Variable | Value | Notes |
| --- | --- | --- |
| `PAYLOAD_SECRET` | `openssl rand -hex 32` | Signs auth/preview tokens. Any long random string. |
| `DATABASE_URI` | Neon connection string | **Use the direct/unpooled host** (`ep-…-apcp0ng4.c-7…`, *not* `-pooler`) so migrations can run. Keep `?sslmode=require`. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store token | Storage → your Blob store → tokens. |

> ⚠️ **Rotate the credentials that were shared during development** (Neon DB
> password + Blob token) before/after launch — pasted secrets can linger in logs.
> After rotating, update `DATABASE_URI` / `BLOB_READ_WRITE_TOKEN` here and in your
> local `.env`.

## 2. Build settings

The repo's `build` script already does the right thing:

```
payload generate:importmap && next build
```

Leave Vercel's Build Command on the default (it runs `npm run build`). No custom
install/output settings are needed.

## 3. First deploy

1. Push the `payload-cms` branch (or merge to `main`) — Vercel builds and deploys.
2. The build prerenders every page from the Neon database (already seeded), so the
   site is live immediately.
3. Visit **`/admin`** and **create the first admin user** (the DB ships with zero
   users by design). That account manages all content.

## 4. Publishing & instant updates

- Editors change content in `/admin`. On save, an `afterChange` hook calls
  `revalidatePath('/', 'layout')`, so the affected pages refresh on the next
  request — **no rebuild**, usually within a second or two.
- Media (images) are uploaded in the admin and served from Vercel Blob via
  `next/image` (CDN-cached).

## 5. Database migrations (schema changes)

The schema is migration-managed. The current Neon DB is **baselined** (the initial
migration is recorded as applied), so nothing is needed for the first deploy.

When you change the content model later (add a field/collection):

```bash
# 1. generate a migration from the schema change
npm run payload migrate:create <name>
# 2. commit src/migrations/**
# 3. apply it to the production DB (run locally with prod DATABASE_URI, or as a one-off)
DATABASE_URI="<prod direct url>" npm run migrate
```

`npm run migrate` (= `payload migrate`) applies any pending migrations.

> Note: this project shares one Neon DB between local dev (schema "push") and
> production. If you ever want `payload migrate` to run automatically inside the
> Vercel build, first clear Payload's dev-push marker row
> (`DELETE FROM payload_migrations WHERE name = 'dev'`) so migrate doesn't prompt
> about dev mode — then you can restore `payload migrate` to the build command.
> Cleanest long-term: use a **separate** database for local dev vs production.

## 6. Re-seeding (only if you need to reset content)

`scripts/seed.ts` rebuilds all content from `src/content/*.json` and re-uploads
`public/gallery/*` to Blob. It clears the content collections first, so it is
destructive to current content (but not to users):

```bash
set -a; . ./.env; set +a
npx tsx scripts/seed.ts
```

## Domain

`SITE_URL` is hardcoded to `https://www.sierrazim.com` in `src/lib/site.ts`
(used for canonical URLs, OG tags, sitemap). Update it there if the production
domain differs, then point the domain at the Vercel project.
