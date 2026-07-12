# Photo Archive Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the real 711 MB SierraZim photo archive into Payload/Blob, wired to every image slot through a data manifest, with no hardcoded filenames and everything editable in `/admin`.

**Architecture:** A `prepare.mjs` build step dedupes + optimizes the archive into a gitignored `media-staging/` and emits `src/content/media-manifest.json` (the image→placement mapping). A rewritten `scripts/seed.ts` uploads the staged media to Blob and wires every collection/global through manifest lookups — replacing today's hardcoded `img("filename.jpg")` calls. Content copy stays in `src/content/*.json`; image filenames are removed from that JSON and live only in the manifest.

**Tech Stack:** Node ESM scripts, `sharp` (already a dependency) for image optimization, `tsx` for the TypeScript Payload seed, Payload CMS 3 (Neon Postgres + Vercel Blob), npm.

## Global Constraints

- **No Payload schema migration.** Do not run `payload migrate` or edit `src/collections/*` / `src/globals/*`. The models already support cover + `gallery[]` + `realPhotos` (case studies), image/video (gallery), and `leadership[].photo`.
- **No hardcoded image filenames** in code or content JSON. All image→placement wiring lives in `src/content/media-manifest.json`.
- **No fabricated case studies.** Projects without existing written copy (Bam Natull, Marie Stopes, Côte d'Ivoire, Sembehun, Mano) go to the Gallery, not the portfolio.
- **Optimization (exact):** auto-orient (`.rotate()`), resize long edge ≤ **2000 px** (`fit: inside`, `withoutEnlargement: true`), `.jpeg({ quality: 80, mozjpeg: true })`, EXIF stripped by re-encode.
- **Optimized output → `media-staging/` (gitignored), not `public/`.** Only the manifest is committed. Re-running requires the archive present via `PHOTO_ARCHIVE_DIR`.
- **Archive path** is passed via env var `PHOTO_ARCHIVE_DIR`; the current archive is at `../Sierrazim Photo Gallery 2026` relative to the repo. Never commit the archive.
- **The seed is destructive** (clears then rebuilds content collections against the live Neon DB + Blob). Build and review everything first; run the live seed **only with explicit user go-ahead**.
- **Manifest is the shared interface** between `prepare.mjs`, `verify-manifest.mjs`, and `seed.ts`. Its schema (locked here):

```jsonc
{
  "media": [
    { "file": "programme/light-vehicle-01.jpg", "alt": "…", "caption": "…", "source": "Light Vehicle Training/IMG-….jpg", "isVideo": false }
  ],
  "assignments": {
    "programmes":   { "<slug>": { "cover": "<media.file>" } },
    "sectors":      { "<slug>": { "image": "<media.file>" } },
    "caseStudies":  { "<slug>": { "cover": "<media.file>", "gallery": ["<media.file>"], "realPhotos": true } },
    "gallery":      [ { "file": "<media.file>", "caption": "…", "alt": "…", "order": 0 } ],
    "galleryVideos":[ { "file": "<video media.file>", "poster": "<media.file|null>", "caption": "…", "order": 0 } ],
    "leadership":   { "Stephen Mafunga": "<media.file>", "Anastasia R. Zayat": "<media.file>" },
    "pages": {
      "home":          { "heroImage": "<file>", "whyUsImage": "<file>", "socialImage": "<file>" },
      "about-page":    { "heroImage": "<file>", "storyImage": "<file>" },
      "services-page": { "heroImage": "<file>" },
      "portfolio-page":{ "heroImage": "<file>" },
      "gallery-page":  { "heroImage": "<file>" },
      "sectors-page":  { "heroImage": "<file>" },
      "contact-page":  { "heroImage": "<file>" }
    }
  }
}
```

Every `assignments.*` value that is not `null` MUST reference a `media[].file` that exists. `null` means "leave the current CMS default / skip".

---

### Task 1: Folder-mapping config

**Files:**
- Create: `scripts/photos/config.mjs`

**Interfaces:**
- Produces: `ARCHIVE_ENV` (string), `SKIP_FILE(name)→bool`, `IMAGE_EXT`/`VIDEO_EXT` (RegExp), `FOLDER_MAP` (object), `LOOSE_FILE_RULES` (array), `slugify(s)→string`. Consumed by `prepare.mjs`.

- [ ] **Step 1: Write the config module**

```js
// scripts/photos/config.mjs
// Pure data + helpers describing how the archive maps into the site.
// No side effects — safe to import from anywhere.

export const ARCHIVE_ENV = "PHOTO_ARCHIVE_DIR";

export const IMAGE_EXT = /\.(jpe?g|png)$/i;
export const VIDEO_EXT = /\.mp4$/i;

/** Never migrated: Office docs, phone screenshots, dotfiles. */
export const SKIP_FILE = (name) =>
  /\.docx$/i.test(name) || /^Screenshot[_-]/i.test(name) || name.startsWith(".");

export const slugify = (s) =>
  String(s).toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");

/**
 * Source folder (exact archive folder name) → placement.
 *  - category: output subdir under media-staging/ (programme|sector|case-study|gallery|team|video)
 *  - target:   collection slug / area key the seed wires this to
 *  - label:    default caption/alt seed for images from this folder
 *  - featured: (optional) marks the client's curated web picks
 * A folder not listed falls through to the general gallery.
 *
 * NOTE: three folders need a visual confirmation during curation (Task 4) —
 * marked `// verify`. Adjust target after viewing.
 */
export const FOLDER_MAP = {
  "Light Vehicle Training":              { category: "programme", target: "light-vehicle-defensive-driving", label: "Light vehicle defensive-driving training" },
  "Heavy Duty Training":                 { category: "programme", target: "heavy-vehicle-defensive-driving", label: "Heavy vehicle defensive-driving training" }, // verify: heavy-vehicle vs surface equipment
  "Simulator Training":                  { category: "programme", target: "simulator-training", label: "Driving simulator training" },
  "Classroom Training":                  { category: "programme", target: "theory-and-classroom-training", label: "Classroom and theory training" },
  "Orial Coaching":                      { category: "programme", target: "theory-and-classroom-training", label: "Oral coaching session" },
  "On The Job Training":                 { category: "programme", target: "theory-and-classroom-training", label: "On-the-job training" },
  "Excavator Training":                  { category: "programme", target: "surface-mobile-equipment-training", label: "Excavator operator training" },
  "Grader Training":                     { category: "programme", target: "surface-mobile-equipment-training", label: "Grader operator training" },
  "FEL TRAINING":                        { category: "programme", target: "surface-mobile-equipment-training", label: "Front-end loader operator training" },
  "ADT Training":                        { category: "programme", target: "surface-mobile-equipment-training", label: "Articulated dump truck training" },
  "Tractor Training":                    { category: "programme", target: "agriculture-equipment-training", label: "Tractor and agriculture equipment training" },
  "Certification":                       { category: "programme", target: "pre-employment-screening", label: "Operator assessment and certification" }, // verify
  "Sierrazim Certification":             { category: "gallery",   target: "certification", label: "Operator certification ceremony" },
  "Sierrazim Certificates":              { category: "gallery",   target: "certification", label: "Certificates awarded to graduates" },

  "Mantrac":                             { category: "case-study", target: "mantrac", label: "Mantrac operator training" },
  "Sierrazim Launching Ceremony Rutile": { category: "case-study", target: "sierra-rutile", label: "Sierra Rutile programme launch" },

  "Bam Natull":                          { category: "gallery", target: "bam-natull", label: "BAM Natull operator training" },
  "Sembehun Official Opening":           { category: "gallery", target: "sembehun-opening", label: "Sembehun academy official opening" },
  "Sierrazim Mano Certication Ceremony": { category: "gallery", target: "mano", label: "Mano certification ceremony" },

  "Students Gallery":                    { category: "gallery", target: "students", label: "Trainees during a SierraZim programme" },
  "sierrazim Gallery":                   { category: "gallery", target: "general", label: "SierraZim training" },
  "Sierrazim Web Selection Photos":      { category: "gallery", target: "web-selection", label: "SierraZim training", featured: true },

  "Sierrazim Team":                      { category: "team",  target: "team", label: "The SierraZim team" },
  "Sierrazim Testimony":                 { category: "video", target: "testimony", label: "Client testimonial" },
};

/** Loose top-level files → placement, matched by filename. First match wins. */
export const LOOSE_FILE_RULES = [
  { test: /dadtco/i,               category: "case-study", target: "dadtco-mozambique", label: "DADTCO Mozambique training" },
  { test: /ivory|d.?ivoire|ddc/i,  category: "gallery",    target: "cote-divoire",     label: "Côte d'Ivoire training programme" },
  { test: /marie\s*stopes/i,       category: "gallery",    target: "marie-stopes",     label: "Marie Stopes driver training" },
  { test: /bam|natull/i,           category: "gallery",    target: "bam-natull",       label: "BAM Natull operator training" },
];
```

- [ ] **Step 2: Verify it imports and maps a known folder**

Run: `cd sierrazim-website && node -e "import('./scripts/photos/config.mjs').then(m=>{console.log(m.FOLDER_MAP['Mantrac'].target, m.SKIP_FILE('Screenshot_1.png'), m.slugify('Bam Natull'))})"`
Expected: `mantrac true bam-natull`

- [ ] **Step 3: Commit**

```bash
git add scripts/photos/config.mjs
git commit -m "Add archive folder-mapping config for photo migration"
```

---

### Task 2: Prepare script — dedupe, optimize, emit manifest

**Files:**
- Create: `scripts/photos/prepare.mjs`
- Modify: `.gitignore` (add `media-staging/`)

**Interfaces:**
- Consumes: everything from `config.mjs`.
- Produces: `media-staging/**` optimized files; `src/content/media-manifest.json` with `media[]` populated and `assignments` auto-filled from `FOLDER_MAP` (covers = first image per target; galleries = the rest; page/leadership assignments left `null` for Task 4).

- [ ] **Step 1: Add `media-staging/` to .gitignore**

Append to `.gitignore`:

```
# Optimized seed source for the media migration (regenerated from the archive)
media-staging/
```

- [ ] **Step 2: Write the prepare script**

```js
#!/usr/bin/env node
// scripts/photos/prepare.mjs
// Dedupe + skip junk + optimize the archive → media-staging/, then emit
// src/content/media-manifest.json (media[] + auto assignments).
//
// Run: PHOTO_ARCHIVE_DIR="/abs/path/Sierrazim Photo Gallery 2026" node scripts/photos/prepare.mjs [--dry]
//
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  ARCHIVE_ENV, SKIP_FILE, IMAGE_EXT, VIDEO_EXT, FOLDER_MAP, LOOSE_FILE_RULES, slugify,
} from "./config.mjs";

const DRY = process.argv.includes("--dry");
const ROOT = process.cwd();
const ARCHIVE = process.env[ARCHIVE_ENV];
if (!ARCHIVE || !fs.existsSync(ARCHIVE)) {
  console.error(`✗ Set ${ARCHIVE_ENV} to the archive folder. Got: ${ARCHIVE ?? "(unset)"}`);
  process.exit(1);
}
const STAGING = path.join(ROOT, "media-staging");
const MANIFEST = path.join(ROOT, "src/content/media-manifest.json");
const MAX = 2000;

// 1. Walk: top-level files + one level of subfolders.
const walk = () => {
  const items = [];
  for (const entry of fs.readdirSync(ARCHIVE, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const dir = path.join(ARCHIVE, entry.name);
      for (const f of fs.readdirSync(dir)) {
        const p = path.join(dir, f);
        if (fs.statSync(p).isFile()) items.push({ folder: entry.name, name: f, path: p });
      }
    } else if (entry.isFile()) {
      items.push({ folder: null, name: entry.name, path: path.join(ARCHIVE, entry.name) });
    }
  }
  return items;
};

// 2. Resolve an item to { category, target, label, isVideo } or null (skip).
const resolve = (item) => {
  if (SKIP_FILE(item.name)) return null;
  const isVideo = VIDEO_EXT.test(item.name);
  if (!isVideo && !IMAGE_EXT.test(item.name)) return null;
  if (item.folder && FOLDER_MAP[item.folder]) return { ...FOLDER_MAP[item.folder], isVideo };
  if (!item.folder) {
    for (const r of LOOSE_FILE_RULES) if (r.test.test(item.name)) return { ...r, isVideo };
  }
  return { category: isVideo ? "video" : "gallery", target: "general", label: "SierraZim training", isVideo };
};

// 3. Dedupe by md5; prefer the categorized copy over the generic "sierrazim Gallery" / loose one.
const dedupe = (entries) => {
  const byHash = new Map();
  for (const e of entries) {
    const h = createHash("md5").update(fs.readFileSync(e.path)).digest("hex");
    const prev = byHash.get(h);
    if (!prev) { byHash.set(h, e); continue; }
    const isGeneric = (x) => x.folder === null || /sierrazim Gallery/i.test(x.folder || "");
    if (isGeneric(prev) && !isGeneric(e)) byHash.set(h, e);
  }
  return [...byHash.values()];
};

// 4. Optimize one image → destPath. Returns { width, height }.
const optimize = async (srcPath, destPath) => {
  const img = sharp(srcPath).rotate().resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true });
  const buf = await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer({ resolveWithObject: true });
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf.data);
  return { width: buf.info.width, height: buf.info.height };
};

const run = async () => {
  const raw = walk();
  const kept = [];
  for (const item of raw) {
    const r = resolve(item);
    if (r) kept.push({ ...item, ...r });
  }
  const deduped = dedupe(kept);

  console.log(`• walked ${raw.length} files → ${kept.length} usable → ${deduped.length} after dedupe`);
  const byTarget = {};
  for (const e of deduped) byTarget[e.target] = (byTarget[e.target] || 0) + 1;
  console.log("• per target:", byTarget);
  if (DRY) { console.log("• --dry: no files written"); return; }

  // 5. Emit optimized files + media[] entries, numbered per target.
  fs.rmSync(STAGING, { recursive: true, force: true });
  const counters = {};
  const media = [];
  deduped.sort((a, b) => (a.folder || "").localeCompare(b.folder || "") || a.name.localeCompare(b.name));
  for (const e of deduped) {
    const n = (counters[e.target] = (counters[e.target] || 0) + 1);
    const base = `${e.category}/${slugify(e.target)}-${String(n).padStart(2, "0")}`;
    const source = e.folder ? `${e.folder}/${e.name}` : e.name;
    if (e.isVideo) {
      const file = `${base}.mp4`;
      fs.mkdirSync(path.dirname(path.join(STAGING, file)), { recursive: true });
      fs.copyFileSync(e.path, path.join(STAGING, file));
      media.push({ file, alt: e.label, caption: e.label, source, isVideo: true });
    } else {
      const file = `${base}.jpg`;
      await optimize(e.path, path.join(STAGING, file));
      media.push({ file, alt: e.label, caption: e.label, source, isVideo: false, category: e.category, target: e.target, featured: !!e.featured });
    }
  }

  // 6. Auto-fill assignments from the mapping. Covers = first image of each target; the rest join galleries.
  const imagesByTarget = {};
  for (const m of media.filter((x) => !x.isVideo)) (imagesByTarget[m.target] ||= []).push(m.file);

  const PROGRAMME_SLUGS = ["light-vehicle-defensive-driving","heavy-vehicle-defensive-driving","simulator-training","theory-and-classroom-training","surface-mobile-equipment-training","agriculture-equipment-training","pre-employment-screening"];
  const CASE_SLUGS = ["dadtco-mozambique","mantrac","sierra-rutile"];

  const assignments = {
    programmes: {}, sectors: {}, caseStudies: {}, gallery: [], galleryVideos: [],
    leadership: { "Stephen Mafunga": null, "Anastasia R. Zayat": null },
    pages: {
      home: { heroImage: null, whyUsImage: null, socialImage: null },
      "about-page": { heroImage: null, storyImage: null },
      "services-page": { heroImage: null }, "portfolio-page": { heroImage: null },
      "gallery-page": { heroImage: null }, "sectors-page": { heroImage: null }, "contact-page": { heroImage: null },
    },
  };
  for (const slug of PROGRAMME_SLUGS) assignments.programmes[slug] = { cover: (imagesByTarget[slug] || [])[0] || null };
  for (const slug of ["mining","agriculture","transport-and-fleets"]) assignments.sectors[slug] = { image: null };
  for (const slug of CASE_SLUGS) {
    const imgs = imagesByTarget[slug] || [];
    assignments.caseStudies[slug] = { cover: imgs[0] || null, gallery: imgs.slice(1), realPhotos: imgs.length > 0 };
  }
  // Everything with a gallery-ish target (not a programme/case-study/team) → gallery items.
  let order = 0;
  for (const m of media.filter((x) => !x.isVideo)) {
    if (PROGRAMME_SLUGS.includes(m.target) || CASE_SLUGS.includes(m.target) || m.target === "team") continue;
    assignments.gallery.push({ file: m.file, caption: m.caption, alt: m.alt, order: order++ });
  }
  for (const m of media.filter((x) => x.isVideo)) assignments.galleryVideos.push({ file: m.file, poster: null, caption: m.caption, order: order++ });

  // Strip helper fields from media[] before writing (keep file/alt/caption/source/isVideo).
  const mediaOut = media.map(({ file, alt, caption, source, isVideo }) => ({ file, alt, caption, source, isVideo }));
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify({ media: mediaOut, assignments }, null, 2) + "\n");
  console.log(`✓ wrote ${mediaOut.length} media + manifest → ${path.relative(ROOT, MANIFEST)}`);
};

run().catch((e) => { console.error("✗ prepare failed:", e); process.exit(1); });
```

- [ ] **Step 3: Dry run — verify counts before writing anything**

Run: `cd sierrazim-website && PHOTO_ARCHIVE_DIR="../Sierrazim Photo Gallery 2026" node scripts/photos/prepare.mjs --dry`
Expected: walked ~470 → usable ~452 (docx + screenshots skipped) → ~415 after dedupe (39 dup groups removed); `per target` shows non-zero counts for `mantrac`, `sierra-rutile`, `dadtco-mozambique`, each programme slug, `team`, `testimony`, `general`, etc.

- [ ] **Step 4: Full run — optimize + emit manifest**

Run: `cd sierrazim-website && PHOTO_ARCHIVE_DIR="../Sierrazim Photo Gallery 2026" node scripts/photos/prepare.mjs`
Expected: `✓ wrote N media + manifest`. `media-staging/` exists.

- [ ] **Step 5: Spot-check output size + dimensions**

Run: `cd sierrazim-website && du -sh media-staging && find media-staging -name '*.jpg' | head -1 | xargs sips -g pixelWidth -g pixelHeight`
Expected: total tens of MB (images), long edge ≤ 2000 px. Open 2–3 files to confirm correct orientation/quality.

- [ ] **Step 6: Commit (script only — staging is gitignored)**

```bash
git add scripts/photos/prepare.mjs .gitignore src/content/media-manifest.json
git commit -m "Add prepare script: dedupe, optimize, generate media manifest"
```

---

### Task 3: Manifest verifier

**Files:**
- Create: `scripts/photos/verify-manifest.mjs`

**Interfaces:**
- Consumes: `src/content/media-manifest.json`, `media-staging/**`.
- Produces: exit 0 (valid) / exit 1 (errors printed). Used as the gate after every manifest change.

- [ ] **Step 1: Write the verifier**

```js
#!/usr/bin/env node
// scripts/photos/verify-manifest.mjs
// Validates media-manifest.json: every media file exists on disk, every
// assignment reference resolves, and every schema image slot is present.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const STAGING = path.join(ROOT, "media-staging");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "src/content/media-manifest.json"), "utf8"));
const errors = [];
const warnings = [];

const files = new Set(manifest.media.map((m) => m.file));

// 1. Every media file exists on disk.
for (const m of manifest.media)
  if (!fs.existsSync(path.join(STAGING, m.file))) errors.push(`media file missing on disk: ${m.file}`);

// 2. Every non-null assignment reference resolves to a media[].file.
const check = (ref, where) => {
  if (ref == null) return;
  if (!files.has(ref)) errors.push(`${where} → unknown media file: ${ref}`);
};
const a = manifest.assignments;
for (const [slug, v] of Object.entries(a.programmes)) check(v.cover, `programmes.${slug}.cover`);
for (const [slug, v] of Object.entries(a.sectors)) check(v.image, `sectors.${slug}.image`);
for (const [slug, v] of Object.entries(a.caseStudies)) {
  check(v.cover, `caseStudies.${slug}.cover`);
  (v.gallery || []).forEach((f, i) => check(f, `caseStudies.${slug}.gallery[${i}]`));
}
a.gallery.forEach((g, i) => check(g.file, `gallery[${i}].file`));
a.galleryVideos.forEach((g, i) => { check(g.file, `galleryVideos[${i}].file`); check(g.poster, `galleryVideos[${i}].poster`); });
for (const [name, ref] of Object.entries(a.leadership)) check(ref, `leadership.${name}`);
for (const [page, slots] of Object.entries(a.pages))
  for (const [slot, ref] of Object.entries(slots)) check(ref, `pages.${page}.${slot}`);

// 3. Warn on unfilled key slots (covers, heroes, leadership) — allowed, but surfaced.
for (const [slug, v] of Object.entries(a.programmes)) if (!v.cover) warnings.push(`programme "${slug}" has no cover`);
for (const [name, ref] of Object.entries(a.leadership)) if (!ref) warnings.push(`leadership "${name}" has no photo`);
if (!a.pages.home.heroImage) warnings.push(`home hero image not set`);

warnings.forEach((w) => console.log(`⚠ ${w}`));
if (errors.length) { errors.forEach((e) => console.error(`✗ ${e}`)); process.exit(1); }
console.log(`✓ manifest valid: ${manifest.media.length} media, ${a.gallery.length} gallery, ${a.galleryVideos.length} videos`);
```

- [ ] **Step 2: Run against the generated manifest**

Run: `cd sierrazim-website && node scripts/photos/verify-manifest.mjs`
Expected: `✓ manifest valid: …` (exit 0). Warnings about unset heroes/leadership are expected at this stage (filled in Task 4).

- [ ] **Step 3: Commit**

```bash
git add scripts/photos/verify-manifest.mjs
git commit -m "Add media manifest verifier"
```

---

### Task 4: Hand-tune the manifest (curation)

This is a judgment task, not codegen. Quality bar: bespoke, real, no AI-generated look. Only edit `src/content/media-manifest.json`.

**Files:**
- Modify: `src/content/media-manifest.json`

- [ ] **Step 1: Resolve the three `// verify` folders**

View 2–3 images from each of `media-staging/programme/heavy-vehicle-defensive-driving-*`, `…/pre-employment-screening-*`, and the `Certification` set (Read the staged `.jpg` files). Confirm each folder's `target` in `config.mjs` is right; if a folder was misclassified, fix `config.mjs` and re-run `prepare.mjs` (Task 2, Steps 4–5).

- [ ] **Step 2: Choose covers + write precise alt text for headline placements**

View the staged candidates and set, in `assignments`:
- `programmes.<slug>.cover` — the single strongest shot per programme (7).
- `caseStudies.{mantrac,sierra-rutile,dadtco-mozambique}.cover` + a curated `gallery` order; set `realPhotos: true`.
- `caseStudies.{frontier-buses,miro-forestry,sierra-tropical}` — add entries with `cover` set to a topically-related real image (transport / forestry / agriculture), `gallery: []`, `realPhotos: false`.
- `sectors.{mining,agriculture,transport-and-fleets}.image`.
- `leadership."Stephen Mafunga"` → the CEO photo (`team/team-*` from `CEO Sierrazim.jpg`); `"Anastasia R. Zayat"` → `Sierrazim Managing Director.jpg`.
- `pages.home.{heroImage,whyUsImage,socialImage}` and each page `heroImage`/`storyImage` — prefer images sourced from `Sierrazim Web Selection Photos` (the client's picks) for hero slots.

For every image referenced by a headline slot, replace the folder-derived `caption`/`alt` in the matching `media[]` entry with a precise, specific description of what's actually in the frame.

- [ ] **Step 3: Trim the general gallery**

`broad & organized`: keep all usable gallery images, but remove obvious near-duplicate burst frames and any low-quality shots from `assignments.gallery`. Folder-derived captions are acceptable for the long tail.

- [ ] **Step 4: Verify**

Run: `cd sierrazim-website && node scripts/photos/verify-manifest.mjs`
Expected: `✓ manifest valid` with no `✗` errors and no warnings about unset programme covers / leadership / home hero.

- [ ] **Step 5: Commit**

```bash
git add src/content/media-manifest.json scripts/photos/config.mjs
git commit -m "Curate media manifest: covers, alt text, leadership, heroes"
```

---

### Task 5: Rewrite the seed to be manifest-driven

**Files:**
- Modify: `scripts/seed.ts` (full rewrite of the media + image-wiring paths)
- Modify: `src/content/case-studies/*.json` (remove `image`, `imageAlt`, `gallery`, `realPhotos` keys — those move to the manifest)

**Interfaces:**
- Consumes: `src/content/media-manifest.json`, `media-staging/**`, existing `src/content/*.json` copy.
- Produces: a seeded Neon DB + Blob. Adds a `--dry-run` flag that logs planned operations without writing.

- [ ] **Step 1: Strip image fields from case-study JSON**

For each `src/content/case-studies/*.json`, delete the `image`, `imageAlt`, `gallery`, and `realPhotos` keys (keep `client`, `slug`-relevant copy, `sector`, `location`, `year`, `title`, `summary`, `overview`, `delivered`, `outcomes`, `services`, `order`). Example — `mantrac.json` after edit keeps everything except those four keys.

- [ ] **Step 2: Rewrite `scripts/seed.ts`**

Replace the media-upload and image-wiring logic with manifest-driven equivalents. Full file:

```ts
/* eslint-disable @typescript-eslint/no-explicit-any -- one-off migration over
   arbitrary, untyped content JSON; `any` is appropriate for the source shapes. */
import fs from "fs";
import path from "path";

import { getPayload } from "payload";

import config from "../src/payload.config";

/**
 * Content + media migration: media-staging/** + src/content/*.json → Payload.
 * Image→placement wiring comes entirely from src/content/media-manifest.json.
 * Idempotent — clears content collections first.
 * Run: set -a; . ./.env; set +a; npx tsx scripts/seed.ts [--dry-run]
 */
const DRY = process.argv.includes("--dry-run");
const ROOT = process.cwd();
const STAGING = path.join(ROOT, "media-staging");
const contentDir = (p: string) => path.join(ROOT, "src/content", p);
const readJSON = (p: string) => JSON.parse(fs.readFileSync(p, "utf8"));
const manifest = readJSON(path.join(ROOT, "src/content/media-manifest.json"));

const entries = (dir: string): { slug: string; data: any }[] =>
  fs.readdirSync(contentDir(dir)).filter((f) => f.endsWith(".json"))
    .map((f) => ({ slug: f.replace(/\.json$/, ""), data: readJSON(path.join(contentDir(dir), f)) }));

const run = async () => {
  const payload = await getPayload({ config });

  const toClear = ["gallery","case-studies","sectors","programmes","clients","value-props","faqs","media"] as const;
  if (!DRY) {
    for (const collection of toClear) await payload.delete({ collection, where: { id: { exists: true } } });
    console.log("• cleared content collections");
  }

  // 1. Upload every manifest media file (→ Blob). Build file → mediaId.
  const mediaId: Record<string, number> = {};
  for (const m of manifest.media as any[]) {
    const filePath = path.join(STAGING, m.file);
    if (!fs.existsSync(filePath)) throw new Error(`manifest media missing on disk: ${m.file}`);
    if (DRY) { console.log(`  would upload ${m.file}`); continue; }
    const doc = await payload.create({ collection: "media", data: { alt: m.alt || m.caption || m.file }, filePath });
    mediaId[m.file] = doc.id as number;
  }
  console.log(`• ${DRY ? "would upload" : "uploaded"} ${manifest.media.length} media`);
  const ref = (file?: string | null) => (file && mediaId[file]) || undefined;

  const A = manifest.assignments;

  // 2. Clients + Programmes + ValueProps + Faqs.
  const clientId: Record<string, number> = {};
  for (const { slug, data } of entries("clients")) {
    if (DRY) continue;
    const doc = await payload.create({ collection: "clients", data: { slug, name: data.name, sector: data.sector, context: data.context, order: data.order ?? 0 } });
    clientId[slug] = doc.id as number;
  }
  const programmeId: Record<string, number> = {};
  for (const { slug, data } of entries("programmes")) {
    if (DRY) { console.log(`  programme ${slug} cover=${A.programmes[slug]?.cover}`); continue; }
    const doc = await payload.create({ collection: "programmes", data: {
      slug, title: data.title, short: data.short, description: data.description,
      features: (data.features ?? []).map((feature: string) => ({ feature })),
      image: ref(A.programmes[slug]?.cover), imageAlt: data.imageAlt ?? data.title,
      audience: data.audience, format: data.format, certification: data.certification, order: data.order ?? 0,
    } });
    programmeId[slug] = doc.id as number;
  }
  for (const { slug, data } of entries("value-props"))
    if (!DRY) await payload.create({ collection: "value-props", data: { slug, title: data.title, description: data.description, order: data.order ?? 0 } });
  for (const { data } of entries("faqs"))
    if (!DRY) await payload.create({ collection: "faqs", data: { question: data.question, answer: data.answer, order: data.order ?? 0 } });
  console.log("• seeded clients, programmes, value-props, faqs");

  // 3. Sectors.
  for (const { slug, data } of entries("sectors")) {
    if (DRY) continue;
    await payload.create({ collection: "sectors", data: {
      slug, name: data.name, title: data.title, intro: data.intro, metaDescription: data.metaDescription,
      image: ref(A.sectors[slug]?.image), imageAlt: data.imageAlt ?? data.name,
      programmes: (data.programmes ?? []).map((s: string) => programmeId[s]).filter(Boolean),
      clients: (data.clients ?? []).map((s: string) => clientId[s]).filter(Boolean), order: data.order ?? 0,
    } });
  }

  // 4. Case studies — copy from JSON, images from manifest.
  for (const { slug, data } of entries("case-studies")) {
    const cs = A.caseStudies[slug] || {};
    if (DRY) { console.log(`  case-study ${slug} cover=${cs.cover} gallery=${(cs.gallery||[]).length}`); continue; }
    await payload.create({ collection: "case-studies", data: {
      slug, client: data.client, sector: data.sector, location: data.location, year: data.year,
      title: data.title, summary: data.summary, overview: data.overview,
      delivered: (data.delivered ?? []).map((item: string) => ({ item })),
      outcomes: (data.outcomes ?? []).map((item: string) => ({ item })),
      services: (data.services ?? []).map((s: string) => programmeId[s]).filter(Boolean),
      image: ref(cs.cover), imageAlt: data.title,
      gallery: (cs.gallery ?? []).map((f: string) => ({ image: ref(f), alt: data.title })),
      realPhotos: Boolean(cs.realPhotos), featured: Boolean(data.featured), order: data.order ?? 0,
    } });
  }
  console.log("• seeded sectors, case-studies");

  // 5. Gallery — images then videos, from the manifest.
  for (const g of A.gallery as any[]) {
    if (DRY) continue;
    await payload.create({ collection: "gallery", data: { caption: g.caption, alt: g.alt ?? g.caption, mediaType: "image", image: ref(g.file), order: g.order ?? 0 } });
  }
  for (const v of A.galleryVideos as any[]) {
    if (DRY) continue;
    await payload.create({ collection: "gallery", data: {
      caption: v.caption, alt: v.caption, mediaType: "video", provider: "File", videoSrc: undefined,
      poster: ref(v.poster), width: 1280, height: 720, order: v.order ?? 0,
    } });
  }
  console.log("• seeded gallery");

  // 6. Globals — copy from JSON, images from manifest.
  const site = readJSON(contentDir("site.json"));
  const lead = A.leadership || {};
  if (!DRY) await payload.updateGlobal({ slug: "site", data: {
    ...site,
    leadership: (site.leadership ?? []).map((l: any) => ({ ...l, photo: ref(lead[l.name]) })),
  } });

  const home = readJSON(contentDir("home.json"));
  const hp = A.pages.home;
  if (!DRY) await payload.updateGlobal({ slug: "home", data: {
    ...home, heroImage: ref(hp.heroImage), whyUsImage: ref(hp.whyUsImage), socialImage: ref(hp.socialImage),
    statementPartners: (home.statementPartners ?? []).map((partner: string) => ({ partner })),
  } });

  const pages = readJSON(contentDir("pages.json"));
  const pg = A.pages;
  if (!DRY) {
    await payload.updateGlobal({ slug: "about-page", data: { ...pages.about, heroImage: ref(pg["about-page"].heroImage), storyImage: ref(pg["about-page"].storyImage), storyBlocks: (pages.about.storyBlocks ?? []).map((text: string) => ({ text })) } });
    await payload.updateGlobal({ slug: "contact-page", data: { ...pages.contact, heroImage: ref(pg["contact-page"].heroImage) } });
    await payload.updateGlobal({ slug: "services-page", data: { ...pages.servicesHero, heroImage: ref(pg["services-page"].heroImage) } });
    await payload.updateGlobal({ slug: "portfolio-page", data: { ...pages.portfolioHero, heroImage: ref(pg["portfolio-page"].heroImage) } });
    await payload.updateGlobal({ slug: "gallery-page", data: { ...pages.galleryHero, heroImage: ref(pg["gallery-page"].heroImage) } });
    await payload.updateGlobal({ slug: "sectors-page", data: { ...pages.sectorsHero, heroImage: ref(pg["sectors-page"].heroImage) } });
  }
  console.log("• seeded globals: site, home + per-page");

  console.log(`\n✓ ${DRY ? "DRY-RUN COMPLETE (no writes)" : "SEED COMPLETE"}`);
  process.exit(0);
};

run().catch((e) => { console.error("\n✗ SEED FAILED:", e); process.exit(1); });
```

- [ ] **Step 3: Lint**

Run: `cd sierrazim-website && npm run lint`
Expected: no errors.

- [ ] **Step 4: Type/build check**

Run: `cd sierrazim-website && npm run build`
Expected: build succeeds (compiles the seed's imports + the site).

- [ ] **Step 5: Dry run the seed (no DB writes)**

Run: `cd sierrazim-website && set -a; . ./.env; set +a; npx tsx scripts/seed.ts --dry-run`
Expected: logs `would upload N media`, per-programme/case-study cover lines, `DRY-RUN COMPLETE (no writes)`. No errors, no missing-file exceptions.

- [ ] **Step 6: Commit**

```bash
git add scripts/seed.ts src/content/case-studies
git commit -m "Rewrite seed to be manifest-driven; move case-study images to manifest"
```

---

### Task 6 (optional): Video poster frames

Videos are the Blob-heavy part and can be deferred. Do this only if including testimony videos now.

**Files:**
- Modify: `scripts/photos/prepare.mjs` (poster extraction)

- [ ] **Step 1: Check ffmpeg availability**

Run: `which ffmpeg`
Expected: a path. If absent, skip this task — leave `galleryVideos[].poster: null` (the gallery-video component tolerates a missing poster); revisit later.

- [ ] **Step 2: Extract a poster per video**

In `prepare.mjs`, after copying a video, add (inside the `if (e.isVideo)` branch):

```js
import { execFileSync } from "node:child_process"; // top of file
// ...after fs.copyFileSync for the video:
const posterFile = `${base}-poster.jpg`;
try {
  execFileSync("ffmpeg", ["-y", "-i", e.path, "-vf", "thumbnail,scale=1280:-1", "-frames:v", "1", path.join(STAGING, posterFile)], { stdio: "ignore" });
  media.push({ file: posterFile, alt: `${e.label} poster`, caption: e.label, source, isVideo: false, category: "video", target: e.target });
} catch { /* no poster */ }
```

Then in the `galleryVideos` auto-fill, set `poster` to the matching `-poster.jpg` file when present.

- [ ] **Step 3: Re-run prepare + verify**

Run: `cd sierrazim-website && PHOTO_ARCHIVE_DIR="../Sierrazim Photo Gallery 2026" node scripts/photos/prepare.mjs && node scripts/photos/verify-manifest.mjs`
Expected: posters generated; manifest valid.

- [ ] **Step 4: Commit**

```bash
git add scripts/photos/prepare.mjs src/content/media-manifest.json
git commit -m "Generate poster frames for testimony videos"
```

---

### Task 7: Execute the live seed + verify

**Requires explicit user go-ahead before Step 2 — this writes to the live Neon DB + Blob and clears existing content collections first.**

- [ ] **Step 1: Confirm go-ahead**

Present the dry-run summary (from Task 5 Step 5) and get explicit approval to run the destructive seed against the live database.

- [ ] **Step 2: Run the seed**

Run: `cd sierrazim-website && set -a; . ./.env; set +a; npx tsx scripts/seed.ts`
Expected: `✓ SEED COMPLETE`, no errors. Uploads all media, seeds all collections + globals.

- [ ] **Step 3: Verify in the running app**

Run: `cd sierrazim-website && npm run dev` and open the site. Spot-check that real photos render on: home (hero, why-us, work, gallery preview), `/services/<each>`, `/portfolio/<mantrac|sierra-rutile|dadtco-mozambique>`, `/gallery`, `/about` (story + leadership), `/sectors`. Confirm a few images load from Blob URLs (not 404).

- [ ] **Step 4: Commit any final content tweaks**

```bash
git add -A && git commit -m "Finalize photo migration content"
```

---

### Task 8: Docs + finish

**Files:**
- Modify: `docs/content-model.md` (note the manifest as the image source)

- [ ] **Step 1: Document the manifest workflow**

Add a short section to `docs/content-model.md`: images are prepared from the archive via `scripts/photos/prepare.mjs` → `media-staging/` + `src/content/media-manifest.json`, then seeded by `scripts/seed.ts`; after seeding, images are edited in `/admin` (the manifest is only for a fresh rebuild).

- [ ] **Step 2: Commit**

```bash
git add docs/content-model.md
git commit -m "Document manifest-driven media workflow"
```

- [ ] **Step 3: Finish the branch**

Use superpowers:finishing-a-development-branch to decide merge/PR/cleanup for `photo-archive-migration`.

---

## Self-Review

**Spec coverage:**
- Prepare/optimize/dedupe/skip → Task 2 ✓ · manifest → Task 2 + 4 ✓ · manifest-driven seed, no hardcoded filenames → Task 5 ✓ · folder→collection mapping → Task 1 + 4 ✓ · leadership photos (correction) → Task 4/5 ✓ · optimization settings → Task 2 (Global Constraints) ✓ · execution safety / destructive seed / go-ahead → Task 7 ✓ · gaps (frontier-buses etc., pre-employment-screening) → Task 4 Step 2 ✓ · videos → Task 6 (optional) ✓ · verification → Task 3 + Task 5 Steps 3–5 + Task 7 Step 3 ✓.
- Refinement vs spec: output goes to gitignored `media-staging/` instead of `public/media/` (avoids deploying unused static assets); flagged in Global Constraints. Manifest stored at `src/content/media-manifest.json` (committed).

**Placeholder scan:** No TBD/TODO. All code blocks complete. The `// verify` folder targets and Task 4 curation are genuine judgment steps with explicit procedures, not placeholders.

**Type consistency:** `manifest.media[].file` is the join key everywhere; `ref(file)` in the seed, `check(ref)` in the verifier, and `imagesByTarget` in prepare all key on the same `file` string. Assignment shape (`programmes.<slug>.cover`, `caseStudies.<slug>.{cover,gallery,realPhotos}`, `pages.<page>.<slot>`, `leadership[name]`) is identical across prepare (writes), verify (checks), and seed (reads).
