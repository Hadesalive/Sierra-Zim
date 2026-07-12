# Photo archive migration — design

**Date:** 2026-07-12
**Status:** Approved (pending spec review)

## Goal

Bring the real SierraZim photo archive (711 MB, 456 images + 10 videos, delivered in
`../Sierrazim Photo Gallery 2026/`) into the site so every placement shows a real
photo, managed through the Payload CMS — **not hardcoded in code or content JSON**.

Scope confirmed with the user:

- **Broad & organized** — migrate all *usable* photos (skip only junk/dupes), organized
  per project/programme, with the client free to prune extras in `/admin` afterward.
- **Optimize on the way in** — no raw multi-MB phone photos hit Blob.
- **Data-driven** — image→placement mapping lives in a manifest (data), not in code.
  After the seed runs, Blob + Payload is the source of truth and every image is editable
  in `/admin`.

## Non-goals

- No Payload **schema** migration (`payload migrate`) — the `case-studies`, `gallery`,
  and `site.leadership` models already support everything we need. This is a **content/
  media seed**, run via `scripts/seed.ts`.
- No fabricated case studies. Projects without existing written copy (Bam Natull, Marie
  Stopes, Côte d'Ivoire, Sembehun, Mano) go to the **Gallery**, not the portfolio.
- No redesign of pages/components. Images flow into the existing slots.

## Correction to an earlier default

During exploration I told the user team photos couldn't be attached per-person without a
schema change. That was wrong: `src/globals/Site.ts` already defines
`leadership[].photo` (upload → media). So **real leadership headshots are in scope** with
no schema change. The archive has `CEO Sierrazim.jpg` and `Sierrazim Managing
Director.jpg`, matching the two current leaders (Stephen Mafunga — CEO; Anastasia R.
Zayat — MD).

## Architecture — three pieces

### 1. `scripts/photos/prepare.mjs` — curate + optimize (offline build step)

Input: the archive folder (path passed as an arg / env var; **not** committed to the repo).
Output: optimized images in `public/media/<category>/<slug>.jpg` + a generated
`src/content/media-manifest.json`.

Steps:

1. **Walk** the archive; consider only `.jpg/.jpeg/.png/.mp4`.
2. **Dedupe** by content hash (md5). 39 exact-dup groups exist; the generic
   `sierrazim Gallery/` folder re-copies photos already sorted elsewhere. **Keep the
   categorized copy, drop the generic duplicate**, so each photo retains its project/
   training context.
3. **Skip junk:** `.docx`; filenames matching `Screenshot*`; empty folders
   (`Dozer Training`, `New folder`).
4. **Optimize** each kept image with **sharp** (already a dependency):
   `rotate()` (auto-orient from EXIF) → `resize({ width: 2000, height: 2000, fit: inside,
   withoutEnlargement: true })` → `.jpeg({ quality: 80, mozjpeg: true })` → EXIF stripped
   by re-encode. Deterministic output filename: `<category>/<source-folder-slug>-NN.jpg`.
5. **Videos** (`.mp4`) are copied as-is (sharp can't transcode) into
   `public/media/video/`; their size is flagged in the run log.
6. **Emit `media-manifest.json`** — one entry per output asset (schema below), with
   category/target/order pre-filled from the source folder, and `alt`/`caption` seeded
   from a folder→label table. This file is then **hand-tuned** (covers chosen, precise
   alt text for viewed images, ordering) before seeding.

The script is **re-runnable** and idempotent for a given archive; regenerating overwrites
`public/media/**` and the manifest's auto fields (a `// hand-tuned` marker or a separate
override file preserves manual edits — see Risks).

### 2. `src/content/media-manifest.json` — the mapping (data)

The single source of image→placement truth. Illustrative schema:

```jsonc
{
  "media": [
    {
      "file": "programme/light-vehicle-01.jpg",   // path under public/media
      "alt": "Trainee driving a light vehicle through the defensive-driving course",
      "caption": "Light vehicle defensive driving",
      "source": "Light Vehicle Training/IMG-...jpg" // provenance, for auditing
    }
    // ...one per optimized asset
  ],
  "assignments": {
    "programmes":   { "light-vehicle-defensive-driving": { "cover": "programme/light-vehicle-01.jpg", "gallery": ["..."] } },
    "sectors":      { "transport-and-fleets": { "image": "sector/transport-01.jpg" } },
    "caseStudies":  { "mantrac": { "cover": "case-studies/mantrac-01.jpg", "gallery": ["..."], "realPhotos": true } },
    "gallery":      [ { "file": "gallery/bam-natull-01.jpg", "caption": "...", "order": 10 } ],
    "galleryVideos":[ { "file": "video/testimony-01.mp4", "poster": "video/testimony-01-poster.jpg", "caption": "Client testimonial" } ],
    "leadership":   { "Stephen Mafunga": "team/ceo.jpg", "Anastasia R. Zayat": "team/managing-director.jpg" },
    "pages": {
      "home":        { "heroImage": "...", "whyUsImage": "...", "socialImage": "..." },
      "about-page":  { "heroImage": "...", "storyImage": "..." },
      "services-page":  { "heroImage": "..." },
      "portfolio-page": { "heroImage": "..." },
      "gallery-page":   { "heroImage": "..." },
      "sectors-page":   { "heroImage": "..." },
      "contact-page":   { "heroImage": "..." }
    }
  }
}
```

Every image slot in the schema is covered: programme `image`, sector `image`, case-study
`image` + `gallery[]`, gallery `image`/`poster`, `site.leadership[].photo`, and the
global hero/story/why-us/social images.

### 3. `scripts/seed.ts` — rewritten, manifest-driven

Keeps the current clear-then-rebuild flow, but:

- **Uploads** every `manifest.media[]` file to the `media` collection (→ Blob), building
  a `file → mediaId` map. (Replaces "upload everything in `public/gallery`".)
- **Resolves all image references through the manifest**, never through hardcoded
  filenames. The current `img("instructor-truck-course.jpg")`-style calls are removed;
  a `ref(path)` helper looks up `file → mediaId`.
- **Content copy** (titles, summaries, features, FAQs, site text) still comes from
  `src/content/*.json`, but those JSON files **no longer carry image filenames** — image
  wiring moves entirely to the manifest. Case-study JSON keeps `client/summary/overview/
  delivered/outcomes/...`; its `image`, `gallery`, and `realPhotos` come from the
  manifest at seed time.

## Content mapping (concrete)

| Archive source | Target | Notes |
|---|---|---|
| Light Vehicle Training | programme `light-vehicle-defensive-driving` | cover + gallery |
| Heavy Duty Training (+ heavy-truck shots) | programme `heavy-vehicle-defensive-driving` | |
| Simulator Training | programme `simulator-training` | |
| Classroom / Oral Coaching / On-the-Job | programme `theory-and-classroom-training` | |
| Excavator / Grader / FEL / ADT | programme `surface-mobile-equipment-training` | heavy mobile equipment |
| Tractor Training | programme `agriculture-equipment-training` | |
| (assessment / certification shots) | programme `pre-employment-screening` | no dedicated folder; use certification/assessment photos |
| representative shots | sectors `mining` / `agriculture` / `transport-and-fleets` | one image each |
| Mantrac | case study `mantrac` | real cover + gallery, `realPhotos: true` |
| Sierra Rutile launch (+ same-date `Sierrazim Team` shots) | case study `sierra-rutile` | real cover + gallery, `realPhotos: true` |
| DADTCO Mozambique (loose files) | case study `dadtco-mozambique` | real cover + gallery, `realPhotos: true` |
| `frontier-buses`, `miro-forestry`, `sierra-tropical` | case studies (unchanged copy) | **no archive photos** → assign a topically-related real photo (transport / forestry / agriculture) as cover so the site is fully real; keep `realPhotos: false` (photo isn't from that engagement) and leave `gallery` empty |
| Bam Natull, Marie Stopes, Côte d'Ivoire, Sembehun opening, Mano ceremony | **Gallery** | real projects, no written copy → not case studies |
| Students Gallery, sierrazim Gallery, Certification/Certificates | **Gallery** (general) | after dedupe |
| **Web Selection Photos** (client's own picks) | prioritized for **home hero / featured / page heroes** | |
| Sierrazim Team | `site.leadership[].photo` (CEO, MD) + About hero/story + Gallery | |
| Testimony (7 `.mp4`) | **Gallery** video items | poster frame generated; size flagged |

## Optimization settings

- Long edge ≤ **2000 px**, `fit: inside`, no enlargement.
- **mozjpeg**, quality **80**. EXIF stripped. Auto-orient first.
- Expected: ~150–250 KB per image (down from 2–7 MB). Full optimized image set well
  under ~60 MB; videos (~80 MB total) dominate Blob usage and are flagged.

## Execution safety

- The seed **clears the content collections, then rebuilds** them against the **live
  Neon DB + Vercel Blob** (`.env` has `DATABASE_URI`, `BLOB_READ_WRITE_TOKEN`). It is
  idempotent but **destructive and outward-facing**.
- Everything (prepare script, manifest, seed rewrite) is built and reviewed **before** any
  run. The seed is run **only with explicit user go-ahead**.
- Run command (unchanged): `set -a; . ./.env; set +a; npx tsx scripts/seed.ts`.

## Verification

1. `npm run lint` and `npm run build` clean.
2. Manifest schema check: every schema image slot has an assignment (or an intentional
   "keep default"); every `manifest.media[].file` exists on disk; no dangling refs.
3. Dry review of `public/media/**` sample outputs (orientation, crop, quality).
4. After the seeded run: `npm run dev`, spot-check home, `/services/*`, `/portfolio/*`,
   `/gallery`, `/about` render real photos; check a few Blob URLs resolve.

## Risks / open questions

- **Manifest regeneration vs hand edits.** Re-running `prepare.mjs` must not clobber
  manual cover/alt choices. Mitigation: keep auto-generated fields and hand-tuned
  overrides separable (either a `overrides` block merged on top, or commit the tuned
  manifest and have `prepare` only fill blanks). Decide during planning.
- **Alt text at scale.** Precise alt text only for images actually viewed (covers, heroes,
  featured); the long-tail gallery uses accurate folder-derived captions
  (e.g. "Excavator operator training"). Acceptable for `broad & organized`.
- **Video weight.** 10 `.mp4` (~110 MB pre-deduped) with no transcode path. Option to
  defer videos to a follow-up if Blob bandwidth is a concern.
- **Gaps.** `frontier-buses`, `miro-forestry`, `sierra-tropical`, and
  `pre-employment-screening` have no dedicated archive folder; covered by related real
  photos or left on current imagery, flagged in the manifest.
