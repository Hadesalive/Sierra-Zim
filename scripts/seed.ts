/* eslint-disable @typescript-eslint/no-explicit-any -- one-off migration over
   arbitrary, untyped Keystatic JSON; `any` is appropriate for the source shapes. */
import fs from "fs";
import path from "path";

import { getPayload } from "payload";

import config from "../src/payload.config";

/**
 * One-time migration: src/content/*.json (Keystatic) → Payload (Neon + Blob).
 * Idempotent — clears the content collections first, so it can be re-run safely.
 * Run: set -a; . ./.env; set +a; npx tsx scripts/seed.ts
 */
const ROOT = process.cwd();
const contentDir = (p: string) => path.join(ROOT, "src/content", p);
const readJSON = (p: string) => JSON.parse(fs.readFileSync(p, "utf8"));

const entries = (dir: string): { slug: string; data: any }[] =>
  fs
    .readdirSync(contentDir(dir))
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({
      slug: f.replace(/\.json$/, ""),
      data: readJSON(path.join(contentDir(dir), f)),
    }));

const run = async () => {
  const payload = await getPayload({ config });

  // 0. Clear content collections for a clean re-seed.
  const toClear = [
    "gallery",
    "case-studies",
    "sectors",
    "programmes",
    "clients",
    "value-props",
    "faqs",
    "media",
  ] as const;
  for (const collection of toClear) {
    await payload.delete({ collection, where: { id: { exists: true } } });
  }
  console.log("• cleared content collections");

  // 1. Upload every image in /public/gallery to media (→ Vercel Blob).
  const galleryDir = path.join(ROOT, "public/gallery");
  const files = fs
    .readdirSync(galleryDir)
    .filter((f) => /\.(jpe?g|png|webp|gif|mp4)$/i.test(f));
  const mediaId: Record<string, number> = {};
  for (const file of files) {
    const doc = await payload.create({
      collection: "media",
      data: { alt: file.replace(/\.[^.]+$/, "").replace(/-/g, " ") },
      filePath: path.join(galleryDir, file),
    });
    mediaId[file] = doc.id as number;
  }
  const img = (file?: string | null) =>
    file && mediaId[file] ? mediaId[file] : undefined;
  console.log(`• uploaded ${files.length} media to Blob`);

  // 2. Clients + Programmes (needed as relationship targets) + ValueProps + Faqs.
  const clientId: Record<string, number> = {};
  for (const { slug, data } of entries("clients")) {
    const doc = await payload.create({
      collection: "clients",
      data: {
        slug,
        name: data.name,
        sector: data.sector,
        context: data.context,
        order: data.order ?? 0,
      },
    });
    clientId[slug] = doc.id as number;
  }

  const programmeId: Record<string, number> = {};
  for (const { slug, data } of entries("programmes")) {
    const doc = await payload.create({
      collection: "programmes",
      data: {
        slug,
        title: data.title,
        short: data.short,
        description: data.description,
        features: (data.features ?? []).map((feature: string) => ({ feature })),
        image: img(data.image),
        imageAlt: data.imageAlt,
        audience: data.audience,
        format: data.format,
        certification: data.certification,
        order: data.order ?? 0,
      },
    });
    programmeId[slug] = doc.id as number;
  }

  for (const { slug, data } of entries("value-props")) {
    await payload.create({
      collection: "value-props",
      data: { slug, title: data.title, description: data.description, order: data.order ?? 0 },
    });
  }

  for (const { data } of entries("faqs")) {
    await payload.create({
      collection: "faqs",
      data: { question: data.question, answer: data.answer, order: data.order ?? 0 },
    });
  }
  console.log("• seeded clients, programmes, value-props, faqs");

  // 3. Sectors (resolve programme + client relationships by slug).
  for (const { slug, data } of entries("sectors")) {
    await payload.create({
      collection: "sectors",
      data: {
        slug,
        name: data.name,
        title: data.title,
        intro: data.intro,
        metaDescription: data.metaDescription,
        image: img(data.image),
        imageAlt: data.imageAlt,
        programmes: (data.programmes ?? [])
          .map((s: string) => programmeId[s])
          .filter(Boolean),
        clients: (data.clients ?? []).map((s: string) => clientId[s]).filter(Boolean),
        order: data.order ?? 0,
      },
    });
  }

  // 4. Case studies (resolve services + cover + gallery images).
  for (const { slug, data } of entries("case-studies")) {
    await payload.create({
      collection: "case-studies",
      data: {
        slug,
        client: data.client,
        sector: data.sector,
        location: data.location,
        year: data.year,
        title: data.title,
        summary: data.summary,
        overview: data.overview,
        delivered: (data.delivered ?? []).map((item: string) => ({ item })),
        outcomes: (data.outcomes ?? []).map((item: string) => ({ item })),
        services: (data.services ?? [])
          .map((s: string) => programmeId[s])
          .filter(Boolean),
        image: img(data.image),
        imageAlt: data.imageAlt,
        gallery: (data.gallery ?? []).map((g: any) => ({
          image: img(g.image),
          alt: g.alt,
        })),
        realPhotos: Boolean(data.realPhotos),
        featured: Boolean(data.featured),
        order: data.order ?? 0,
      },
    });
  }
  console.log("• seeded sectors, case-studies");

  // 5. Gallery (image / video conditional).
  for (const { data } of entries("gallery")) {
    const m = data.media ?? {};
    const isVideo = m.discriminant === "video";
    await payload.create({
      collection: "gallery",
      data: {
        caption: data.caption,
        alt: data.alt,
        mediaType: isVideo ? "video" : "image",
        image: isVideo ? undefined : img(m.value?.image),
        provider: isVideo ? m.value?.provider : undefined,
        videoSrc: isVideo ? m.value?.src : undefined,
        poster: isVideo ? img(m.value?.poster) : undefined,
        width: isVideo ? m.value?.width ?? 1280 : undefined,
        height: isVideo ? m.value?.height ?? 720 : undefined,
        order: data.order ?? 0,
      },
    });
  }
  console.log("• seeded gallery");

  // 6. Globals (transform the two string-array fields into Payload's array shape).
  await payload.updateGlobal({ slug: "site", data: readJSON(contentDir("site.json")) });

  const home = readJSON(contentDir("home.json"));
  await payload.updateGlobal({
    slug: "home",
    data: {
      ...home,
      statementPartners: (home.statementPartners ?? []).map((partner: string) => ({
        partner,
      })),
    },
  });

  const pages = readJSON(contentDir("pages.json"));
  await payload.updateGlobal({
    slug: "pages",
    data: {
      ...pages,
      about: {
        ...pages.about,
        storyBlocks: (pages.about.storyBlocks ?? []).map((text: string) => ({ text })),
      },
    },
  });
  console.log("• seeded globals: site, home, pages");

  console.log("\n✓ SEED COMPLETE");
  process.exit(0);
};

run().catch((e) => {
  console.error("\n✗ SEED FAILED:", e);
  process.exit(1);
});
