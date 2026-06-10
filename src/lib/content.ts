import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

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

export async function getSiteSettings() {
  return reader.singletons.site.read();
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
