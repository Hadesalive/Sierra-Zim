/* eslint-disable @typescript-eslint/no-explicit-any */
// Targeted reseed of ONLY the gallery collection from the manifest, reusing media
// already uploaded to Blob (no re-upload). Adds the new `category`. Idempotent.
// Run: set -a; . ./.env; set +a; npx tsx scripts/reseed-gallery.mts
import fs from "fs";
import path from "path";
import { getPayload } from "payload";
import config from "../src/payload.config";

const ROOT = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "src/content/media-manifest.json"), "utf8"));
const base = (f: string) => f.split("/").pop() as string;

const run = async () => {
  const payload = await getPayload({ config });
  console.log("• payload ready (schema pushed)");

  // Map existing media by filename (basename) → id + url.
  const media = await payload.find({ collection: "media", limit: 2000, depth: 0 });
  const idByName: Record<string, number> = {};
  const urlByName: Record<string, string> = {};
  const dupes: string[] = [];
  for (const d of media.docs as any[]) {
    if (idByName[d.filename] !== undefined) dupes.push(d.filename);
    idByName[d.filename] = d.id;
    urlByName[d.filename] = d.url;
  }
  console.log(`• ${media.docs.length} media docs, ${dupes.length} filename collisions`, dupes.slice(0, 5));
  const mid = (f?: string | null) => (f ? idByName[base(f)] : undefined);
  const murl = (f?: string | null) => (f ? urlByName[base(f)] : undefined);

  // Clear only the gallery collection.
  await payload.delete({ collection: "gallery", where: { id: { exists: true } } });
  console.log("• cleared gallery");

  let miss = 0;
  for (const g of manifest.assignments.gallery as any[]) {
    const image = mid(g.file);
    if (!image) { miss++; continue; }
    await payload.create({ collection: "gallery", data: { caption: g.caption, alt: g.alt ?? g.caption, mediaType: "image", category: g.category, image, order: g.order ?? 0 } });
  }
  for (const v of manifest.assignments.galleryVideos as any[]) {
    await payload.create({ collection: "gallery", data: { caption: v.caption, alt: v.caption, mediaType: "video", category: v.category ?? "testimonials", provider: "file", videoSrc: murl(v.file), poster: mid(v.poster), width: 1280, height: 720, order: v.order ?? 0 } });
  }
  const total = (await payload.count({ collection: "gallery" })).totalDocs;
  console.log(`✓ gallery reseeded: ${manifest.assignments.gallery.length - miss} images + ${manifest.assignments.galleryVideos.length} videos = ${total} docs (${miss} images skipped: media not found)`);
  process.exit(0);
};
run().catch((e) => { console.error("✗ FAILED:", e); process.exit(1); });
