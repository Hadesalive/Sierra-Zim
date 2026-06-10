import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import type { GalleryItem } from "@/lib/site";

/**
 * Content-access layer. Pages/components call these (at build time, in Node) to
 * read content managed in Keystatic — instead of importing from site.ts directly.
 * As collections are migrated, their getters land here.
 */
const reader = createReader(process.cwd(), keystaticConfig);

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

export async function getFaqs(): Promise<{ q: string; a: string }[]> {
  const all = await reader.collections.faqs.all();
  return all
    .map((e) => ({ q: e.entry.question, a: e.entry.answer, order: e.entry.order ?? 0 }))
    .sort(byOrder)
    .map(({ q, a }) => ({ q, a }));
}

export type ClientItem = {
  slug: string;
  name: string;
  note: string;
  context: string;
};

export async function getClients(): Promise<ClientItem[]> {
  const all = await reader.collections.clients.all();
  return all
    .map((e) => ({
      slug: e.slug,
      name: e.entry.name,
      note: e.entry.sector,
      context: e.entry.context,
      order: e.entry.order ?? 0,
    }))
    .sort(byOrder)
    .map(({ slug, name, note, context }) => ({ slug, name, note, context }));
}

export type SiteSettings = {
  name: string;
  shortName: string;
  legalName: string;
  tagline: string;
  description: string;
  email: string;
  phones: string[];
  phonesE164: string[];
  whatsapp: string;
  whatsappHref: string;
  mapsHref: string;
  address: { city: string; region: string; country: string; full: string };
  hours: string;
  leadership: { name: string; role: string }[];
};

export async function getSite(): Promise<SiteSettings> {
  const s = await reader.singletons.site.read();
  const phonePrimary = s?.phonePrimary ?? "";
  const phoneSecondary = s?.phoneSecondary ?? "";
  const city = s?.addressCity ?? "";
  const region = s?.addressRegion ?? "";
  const country = s?.addressCountry ?? "";
  const whatsapp = s?.whatsapp ?? "";
  const toE164 = (p: string) => "+" + p.replace(/[^\d]/g, "");
  return {
    name: s?.name ?? "",
    shortName: s?.shortName ?? "",
    legalName: s?.legalName ?? "",
    tagline: s?.tagline ?? "",
    description: s?.description ?? "",
    email: s?.email ?? "",
    phones: [phonePrimary, phoneSecondary],
    phonesE164: [toE164(phonePrimary), toE164(phoneSecondary)],
    whatsapp,
    whatsappHref: `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      "Hello SierraZim, I'd like to enquire about a training programme.",
    )}`,
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent([city, country].filter(Boolean).join(" ")),
    address: {
      city,
      region,
      country,
      full: [city, region, country].filter(Boolean).join(", "),
    },
    hours: s?.hours ?? "",
    leadership: [...(s?.leadership ?? [])].map((l) => ({
      name: l.name,
      role: l.role,
    })),
  };
}

export async function getHome() {
  const h = await reader.singletons.home.read();
  if (!h) throw new Error("Home content (src/content/home.json) is missing.");
  return h;
}
export type HomeContent = Awaited<ReturnType<typeof getHome>>;

export async function getPages() {
  const p = await reader.singletons.pages.read();
  if (!p) throw new Error("Pages content (src/content/pages.json) is missing.");
  return p;
}
export type PagesContent = Awaited<ReturnType<typeof getPages>>;

export async function getGallery(): Promise<GalleryItem[]> {
  const all = await reader.collections.gallery.all();
  const items = all.map((e) => {
    const order = e.entry.order ?? 0;
    const m = e.entry.media;
    let item: GalleryItem;
    if (m.discriminant === "video") {
      item = {
        type: "video",
        provider: m.value.provider,
        src: m.value.src,
        poster: img(m.value.poster),
        alt: e.entry.alt,
        caption: e.entry.caption,
        w: m.value.width ?? 1280,
        h: m.value.height ?? 720,
      };
    } else {
      item = {
        type: "image",
        src: img(m.value.image),
        alt: e.entry.alt,
        caption: e.entry.caption,
        w: m.value.width ?? 1536,
        h: m.value.height ?? 1152,
      };
    }
    return { item, order };
  });
  items.sort((a, b) => a.order - b.order);
  return items.map((x) => x.item);
}

const img = (file: string | null) => (file ? `/gallery/${file}` : "");

export type ProgrammeItem = {
  slug: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  audience: string;
  format: string;
  certification: string;
  order: number;
};

export async function getProgrammes(): Promise<ProgrammeItem[]> {
  const all = await reader.collections.programmes.all();
  return all
    .map((e) => ({
      slug: e.slug,
      title: e.entry.title,
      short: e.entry.short,
      description: e.entry.description,
      features: [...(e.entry.features ?? [])],
      image: img(e.entry.image),
      imageAlt: e.entry.imageAlt,
      audience: e.entry.audience,
      format: e.entry.format,
      certification: e.entry.certification,
      order: e.entry.order ?? 0,
    }))
    .sort(byOrder);
}

export async function getProgramme(slug: string): Promise<ProgrammeItem | null> {
  return (await getProgrammes()).find((p) => p.slug === slug) ?? null;
}

export type SectorItem = {
  slug: string;
  name: string;
  title: string;
  intro: string;
  metaDescription: string;
  image: string;
  imageAlt: string;
  programmeSlugs: string[];
  clientSlugs: string[];
  order: number;
};

export async function getSectors(): Promise<SectorItem[]> {
  const all = await reader.collections.sectors.all();
  return all
    .map((e) => ({
      slug: e.slug,
      name: e.entry.name,
      title: e.entry.title,
      intro: e.entry.intro,
      metaDescription: e.entry.metaDescription,
      image: img(e.entry.image),
      imageAlt: e.entry.imageAlt,
      programmeSlugs: [...(e.entry.programmes ?? [])].filter(
        (x): x is string => Boolean(x),
      ),
      clientSlugs: [...(e.entry.clients ?? [])].filter(
        (x): x is string => Boolean(x),
      ),
      order: e.entry.order ?? 0,
    }))
    .sort(byOrder);
}

export async function getSector(slug: string): Promise<SectorItem | null> {
  return (await getSectors()).find((s) => s.slug === slug) ?? null;
}

export type CaseStudyItem = {
  slug: string;
  client: string;
  sector: string;
  location: string;
  year: string;
  title: string;
  summary: string;
  overview: string;
  delivered: string[];
  outcomes: string[];
  serviceSlugs: string[];
  image: string;
  imageAlt: string;
  gallery: { src: string; alt: string }[];
  realPhotos: boolean;
  featured: boolean;
  order: number;
};

export async function getCaseStudies(): Promise<CaseStudyItem[]> {
  const all = await reader.collections.caseStudies.all();
  return all
    .map((e) => ({
      slug: e.slug,
      client: e.entry.client,
      sector: e.entry.sector,
      location: e.entry.location,
      year: e.entry.year,
      title: e.entry.title,
      summary: e.entry.summary,
      overview: e.entry.overview,
      delivered: [...(e.entry.delivered ?? [])],
      outcomes: [...(e.entry.outcomes ?? [])],
      serviceSlugs: [...(e.entry.services ?? [])].filter(
        (x): x is string => Boolean(x),
      ),
      image: img(e.entry.image),
      imageAlt: e.entry.imageAlt,
      gallery: [...(e.entry.gallery ?? [])].map((g) => ({
        src: img(g.image),
        alt: g.alt,
      })),
      realPhotos: e.entry.realPhotos,
      featured: e.entry.featured,
      order: e.entry.order ?? 0,
    }))
    .sort(byOrder);
}

export async function getCaseStudy(slug: string): Promise<CaseStudyItem | null> {
  return (await getCaseStudies()).find((c) => c.slug === slug) ?? null;
}

export type ValuePropItem = { slug: string; title: string; description: string };

export async function getValueProps(): Promise<ValuePropItem[]> {
  const all = await reader.collections.valueProps.all();
  return all
    .map((e) => ({
      slug: e.slug,
      title: e.entry.title,
      description: e.entry.description,
      order: e.entry.order ?? 0,
    }))
    .sort(byOrder)
    .map(({ slug, title, description }) => ({ slug, title, description }));
}
