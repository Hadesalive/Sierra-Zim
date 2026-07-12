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
