# Local development

## Prerequisites

- **Node.js 20+**
- A **Neon Postgres** database (or any Postgres) — connection string
- A **Vercel Blob** store — read/write token
- This is an **ESM** project (`"type": "module"`). Don't add CommonJS `.js` files at the
  root; use `.mjs`/`.ts`.

## Environment

Copy `.env.example` to `.env` (gitignored) and fill in:

```bash
PAYLOAD_SECRET=        # openssl rand -hex 32
DATABASE_URI=          # Neon connection string (direct/unpooled host for migrations)
BLOB_READ_WRITE_TOKEN= # Vercel Blob store token
```

Next.js auto-loads `.env`. For standalone scripts (seed, migrate), load it first:

```bash
set -a; . ./.env; set +a
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (`http://localhost:3000`, admin at `/admin`). In dev, Payload **pushes** schema changes to the DB automatically. |
| `npm run build` | `payload generate:importmap && next build` — regenerate the admin import map, then prerender all routes. |
| `npm run start` | Serve the production build. |
| `npm run lint` | ESLint. |
| `npm run migrate` | `payload migrate` — apply pending DB migrations. |
| `npm run generate:types` | Regenerate `src/payload-types.ts` from the config. |
| `npm run generate:importmap` | Regenerate `src/app/(payload)/admin/importMap.js`. |
| `npm run payload -- <cmd>` | Run any Payload CLI command (e.g. `migrate:create`). |

## First run

1. `npm install`
2. Create `.env` (above).
3. `npm run dev`
4. Open `/admin` and **create the first admin user**.
5. If the database is empty, seed it (below).

## Seeding content

`scripts/seed.ts` rebuilds all content from `src/content/*.json` and uploads
`public/gallery/*` to Blob. It **clears the content collections first**, so it's
destructive to existing content (but not to users). Use it to populate a fresh DB or
reset to the baseline:

```bash
set -a; . ./.env; set +a
npx tsx scripts/seed.ts
```

`src/content/` is *only* the seed source — the running site reads from Payload, not
from these files.

## Generated files

- **`src/payload-types.ts`** — TypeScript types for collections/globals. Regenerate
  after schema changes: `npm run generate:types`.
- **`src/app/(payload)/admin/importMap.js`** — maps custom admin components (the Blob
  upload handler, dashboard cards). The build regenerates it; it's also committed.
  Regenerate manually with `npm run generate:importmap`.

## Adding or changing a field / collection

1. Edit the config:
   - a collection → `src/collections/<Name>.ts` (and register it in
     `src/payload.config.ts`)
   - a global → `src/globals/<Name>.ts`
   - reusable field helpers live in `src/fields/shared.ts`
2. If the frontend needs the new field, update the matching getter in
   `src/lib/content.ts` (keep the returned shape typed) and the page/component that
   renders it.
3. Regenerate types: `npm run generate:types`.
4. In dev, Payload pushes the schema change automatically. For production, create a
   migration:
   ```bash
   npm run payload -- migrate:create <name>
   git add src/migrations            # commit the migration
   ```
5. Apply migrations to a target DB with `npm run migrate` (see
   [deploy.md](deploy.md) for the production workflow).

## Database migrations

The schema is migration-managed (`src/migrations/`). In **dev** Payload pushes changes
directly so you rarely run migrations locally; in **production** migrations are the
source of truth. The existing Neon DB was *baselined* (the initial migration is
recorded as applied). See [deploy.md](deploy.md) §5 for details, including the note
about Payload's dev-push marker if you point `payload migrate` at this DB.

## Useful paths

- Public pages: `src/app/(frontend)/`
- Admin/API: `src/app/(payload)/`
- Content getters: `src/lib/content.ts`
- CMS schema: `src/payload.config.ts`, `src/collections/`, `src/globals/`
- Icons (code): `src/lib/icons.ts`
