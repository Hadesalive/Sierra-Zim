#!/usr/bin/env node
// scripts/photos/prepare.mjs
// Dedupe + skip junk + optimize the archive → media-staging/, then emit
// src/content/media-manifest.json (media[] + auto assignments).
//
// Run: PHOTO_ARCHIVE_DIR="/abs/path/Sierrazim Photo Gallery 2026" node scripts/photos/prepare.mjs [--dry]
//
import { execFileSync } from "node:child_process";
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
      const posterFile = `${base}-poster.jpg`;
      try {
        execFileSync("ffmpeg", ["-y", "-i", e.path, "-vf", "thumbnail,scale=1280:-1", "-frames:v", "1", path.join(STAGING, posterFile)], { stdio: "ignore" });
        media.push({ file: posterFile, alt: `${e.label} — video still`, caption: e.label, source, isVideo: false, category: "video", target: e.target });
      } catch { /* no poster generated */ }
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
    if (PROGRAMME_SLUGS.includes(m.target) || CASE_SLUGS.includes(m.target) || m.target === "team" || m.category === "video") continue;
    assignments.gallery.push({ file: m.file, caption: m.caption, alt: m.alt, order: order++ });
  }
  const posterSet = new Set(media.filter((x) => !x.isVideo && x.category === "video").map((x) => x.file));
  for (const m of media.filter((x) => x.isVideo)) {
    const poster = m.file.replace(/\.mp4$/i, "-poster.jpg");
    assignments.galleryVideos.push({ file: m.file, poster: posterSet.has(poster) ? poster : null, caption: m.caption, order: order++ });
  }

  // Strip helper fields from media[] before writing (keep file/alt/caption/source/isVideo).
  const mediaOut = media.map(({ file, alt, caption, source, isVideo }) => ({ file, alt, caption, source, isVideo }));
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify({ media: mediaOut, assignments }, null, 2) + "\n");
  console.log(`✓ wrote ${mediaOut.length} media + manifest → ${path.relative(ROOT, MANIFEST)}`);
};

run().catch((e) => { console.error("✗ prepare failed:", e); process.exit(1); });
