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
  const mediaUrlByFile: Record<string, string> = {};
  for (const m of manifest.media as any[]) {
    const filePath = path.join(STAGING, m.file);
    if (!fs.existsSync(filePath)) throw new Error(`manifest media missing on disk: ${m.file}`);
    if (DRY) { console.log(`  would upload ${m.file}`); continue; }
    const doc = await payload.create({ collection: "media", data: { alt: m.alt || m.caption || m.file }, filePath });
    mediaId[m.file] = doc.id as number;
    mediaUrlByFile[m.file] = (doc as any).url as string;
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
      caption: v.caption, alt: v.caption, mediaType: "video", provider: "file", videoSrc: mediaUrlByFile[v.file],
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
