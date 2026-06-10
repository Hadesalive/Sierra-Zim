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

export type ClientItem = { name: string; note: string; context: string };

export async function getClients(): Promise<ClientItem[]> {
  const all = await reader.collections.clients.all();
  return all
    .map((e) => ({
      name: e.entry.name,
      note: e.entry.sector,
      context: e.entry.context,
      order: e.entry.order ?? 0,
    }))
    .sort(byOrder)
    .map(({ name, note, context }) => ({ name, note, context }));
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
