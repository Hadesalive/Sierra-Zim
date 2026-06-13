import type { GalleryItem } from "@/lib/site";
import { payload } from "@/lib/payload";

/**
 * Content-access layer. Pages/components call these async getters (server-side)
 * to read content managed in Payload (Neon + Vercel Blob). The return shapes are
 * kept stable so the page/component layer is unaffected by the CMS behind them.
 */

// --- small coercion helpers (Payload fields can be null) ---
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const num = (v: unknown, d = 0): number => (typeof v === "number" ? v : d);
const mediaUrl = (m: unknown): string =>
  m && typeof m === "object" && typeof (m as { url?: unknown }).url === "string"
    ? (m as { url: string }).url
    : "";
const mediaDim = (m: unknown, key: "width" | "height", d: number): number =>
  m && typeof m === "object" && typeof (m as Record<string, unknown>)[key] === "number"
    ? ((m as Record<string, number>)[key])
    : d;
const relSlug = (r: unknown): string | null =>
  r && typeof r === "object" && typeof (r as { slug?: unknown }).slug === "string"
    ? (r as { slug: string }).slug
    : null;

type Doc = Record<string, unknown>;

/** Coerce an unknown Payload field into a typed array of docs (concrete, not `any`). */
const arr = (v: unknown): Doc[] => (Array.isArray(v) ? (v as Doc[]) : []);

/** View a precisely-typed Payload global/doc through the loose Doc shape. */
const asDoc = (v: unknown): Doc => v as Doc;

async function findAll(collection: string, depth = 1): Promise<Doc[]> {
  const p = await payload();
  const res = await p.find({
    collection: collection as never,
    pagination: false,
    depth,
    sort: "order",
  });
  return res.docs as Doc[];
}

// --- FAQs ---
export async function getFaqs(): Promise<{ q: string; a: string }[]> {
  const docs = await findAll("faqs", 0);
  return docs.map((d) => ({ q: str(d.question), a: str(d.answer) }));
}

// --- Clients ---
export type ClientItem = {
  slug: string;
  name: string;
  note: string;
  context: string;
};

export async function getClients(): Promise<ClientItem[]> {
  const docs = await findAll("clients", 0);
  return docs.map((d) => ({
    slug: str(d.slug),
    name: str(d.name),
    note: str(d.sector),
    context: str(d.context),
  }));
}

// --- Site settings ---
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
  const p = await payload();
  const s = asDoc(await p.findGlobal({ slug: "site" }));
  const phonePrimary = str(s?.phonePrimary);
  const phoneSecondary = str(s?.phoneSecondary);
  const city = str(s?.addressCity);
  const region = str(s?.addressRegion);
  const country = str(s?.addressCountry);
  const whatsapp = str(s?.whatsapp);
  const toE164 = (ph: string) => "+" + ph.replace(/[^\d]/g, "");
  const phones = [phonePrimary, phoneSecondary].filter(Boolean);
  return {
    name: str(s?.name),
    shortName: str(s?.shortName),
    legalName: str(s?.legalName),
    tagline: str(s?.tagline),
    description: str(s?.description),
    email: str(s?.email),
    phones,
    phonesE164: phones.map(toE164),
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
    hours: str(s?.hours),
    leadership: arr(s?.leadership).map((l) => ({
      name: str(l.name),
      role: str(l.role),
    })),
  };
}

// --- Home page ---
export async function getHome() {
  const p = await payload();
  const h = asDoc(await p.findGlobal({ slug: "home", depth: 1 }));
  return {
    socialImage: mediaUrl(h?.socialImage),
    heroEyebrowAccent: str(h?.heroEyebrowAccent),
    heroEyebrowRest: str(h?.heroEyebrowRest),
    heroTitleLine1: str(h?.heroTitleLine1),
    heroTitleAccent: str(h?.heroTitleAccent),
    heroTitleLine2: str(h?.heroTitleLine2),
    heroSubhead: str(h?.heroSubhead),
    heroPillTitle: str(h?.heroPillTitle),
    heroPillSubtitle: str(h?.heroPillSubtitle),
    clientsLabel: str(h?.clientsLabel),
    programmesEyebrow: str(h?.programmesEyebrow),
    programmesHeading: str(h?.programmesHeading),
    programmesIntro: str(h?.programmesIntro),
    certPathEyebrow: str(h?.certPathEyebrow),
    certPathHeading: str(h?.certPathHeading),
    certPathIntro: str(h?.certPathIntro),
    certPathSteps: arr(h?.certPathSteps).map((s) => ({
      title: str(s.title),
      body: str(s.body),
    })),
    whyUsEyebrow: str(h?.whyUsEyebrow),
    whyUsHeading: str(h?.whyUsHeading),
    whyUsIntro: str(h?.whyUsIntro),
    whyUsImageCaption: str(h?.whyUsImageCaption),
    workEyebrow: str(h?.workEyebrow),
    workHeading: str(h?.workHeading),
    galleryEyebrow: str(h?.galleryEyebrow),
    galleryHeading: str(h?.galleryHeading),
    faqEyebrow: str(h?.faqEyebrow),
    faqHeading: str(h?.faqHeading),
    statementQuote: str(h?.statementQuote),
    statementPartnersLabel: str(h?.statementPartnersLabel),
    statementPartners: arr(h?.statementPartners).map((s) => str(s.partner)),
    stats: arr(h?.stats).map((s) => ({
      value: str(s.value),
      label: str(s.label),
    })),
  };
}
export type HomeContent = Awaited<ReturnType<typeof getHome>>;

// --- Index pages (Services / Portfolio / Gallery / Sectors) ---
export type IndexPage = {
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
};

async function getIndexPage(slug: string): Promise<IndexPage> {
  const p = await payload();
  const g = asDoc(await p.findGlobal({ slug: slug as never, depth: 1 }));
  return {
    metaDescription: str(g?.metaDescription),
    eyebrow: str(g?.eyebrow),
    title: str(g?.title),
    intro: str(g?.intro),
    image: mediaUrl(g?.heroImage),
  };
}

export const getServicesPage = () => getIndexPage("services-page");
export const getPortfolioPage = () => getIndexPage("portfolio-page");
export const getGalleryPage = () => getIndexPage("gallery-page");
export const getSectorsPage = () => getIndexPage("sectors-page");

// --- About page ---
export async function getAboutPage() {
  const p = await payload();
  const a = asDoc(await p.findGlobal({ slug: "about-page", depth: 1 }));
  return {
    metaDescription: str(a?.metaDescription),
    heroEyebrow: str(a?.heroEyebrow),
    heroTitleLine1: str(a?.heroTitleLine1),
    heroTitleLine2: str(a?.heroTitleLine2),
    heroIntro: str(a?.heroIntro),
    heroImage: mediaUrl(a?.heroImage),
    storyEyebrow: str(a?.storyEyebrow),
    storyHeading: str(a?.storyHeading),
    storyBlocks: arr(a?.storyBlocks).map((s) => str(s.text)),
    storyImage: mediaUrl(a?.storyImage),
    storyImageCaption: str(a?.storyImageCaption),
    leadershipEyebrow: str(a?.leadershipEyebrow),
    leadershipHeading: str(a?.leadershipHeading),
    locationsEyebrow: str(a?.locationsEyebrow),
    locationsHeading: str(a?.locationsHeading),
    locations: arr(a?.locations).map((l) => ({
      place: str(l.place),
      note: str(l.note),
    })),
    clientsHeading: str(a?.clientsHeading),
  };
}

// --- Contact page ---
export async function getContactPage() {
  const p = await payload();
  const c = asDoc(await p.findGlobal({ slug: "contact-page", depth: 1 }));
  return {
    metaDescription: str(c?.metaDescription),
    heroEyebrow: str(c?.heroEyebrow),
    heroTitle: str(c?.heroTitle),
    heroIntro: str(c?.heroIntro),
    heroImage: mediaUrl(c?.heroImage),
    detailsEyebrow: str(c?.detailsEyebrow),
    detailsHeading: str(c?.detailsHeading),
  };
}

// --- Gallery (image / video) ---
export async function getGallery(): Promise<GalleryItem[]> {
  const docs = await findAll("gallery", 1);
  return docs.map((d): GalleryItem => {
    if (d.mediaType === "video") {
      return {
        type: "video",
        provider: (d.provider ?? "youtube") as "file" | "youtube" | "vimeo",
        src: str(d.videoSrc),
        poster: mediaUrl(d.poster),
        alt: str(d.alt),
        caption: str(d.caption),
        w: num(d.width, 1280),
        h: num(d.height, 720),
      };
    }
    return {
      type: "image",
      src: mediaUrl(d.image),
      alt: str(d.alt),
      caption: str(d.caption),
      w: mediaDim(d.image, "width", 1536),
      h: mediaDim(d.image, "height", 1152),
    };
  });
}

// --- Programmes ---
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
  const docs = await findAll("programmes", 1);
  return docs.map((d) => ({
    slug: str(d.slug),
    title: str(d.title),
    short: str(d.short),
    description: str(d.description),
    features: arr(d.features).map((f) => str(f.feature)).filter(Boolean),
    image: mediaUrl(d.image),
    imageAlt: str(d.imageAlt),
    audience: str(d.audience),
    format: str(d.format),
    certification: str(d.certification),
    order: num(d.order),
  }));
}

export async function getProgramme(slug: string): Promise<ProgrammeItem | null> {
  return (await getProgrammes()).find((p) => p.slug === slug) ?? null;
}

// --- Sectors ---
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
  const docs = await findAll("sectors", 1);
  return docs.map((d) => ({
    slug: str(d.slug),
    name: str(d.name),
    title: str(d.title),
    intro: str(d.intro),
    metaDescription: str(d.metaDescription),
    image: mediaUrl(d.image),
    imageAlt: str(d.imageAlt),
    programmeSlugs: arr(d.programmes).map(relSlug).filter((x): x is string => Boolean(x)),
    clientSlugs: arr(d.clients).map(relSlug).filter((x): x is string => Boolean(x)),
    order: num(d.order),
  }));
}

export async function getSector(slug: string): Promise<SectorItem | null> {
  return (await getSectors()).find((s) => s.slug === slug) ?? null;
}

// --- Case studies ---
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
  const docs = await findAll("case-studies", 1);
  return docs.map((d) => ({
    slug: str(d.slug),
    client: str(d.client),
    sector: str(d.sector),
    location: str(d.location),
    year: str(d.year),
    title: str(d.title),
    summary: str(d.summary),
    overview: str(d.overview),
    delivered: arr(d.delivered).map((x) => str(x.item)).filter(Boolean),
    outcomes: arr(d.outcomes).map((x) => str(x.item)).filter(Boolean),
    serviceSlugs: arr(d.services).map(relSlug).filter((x): x is string => Boolean(x)),
    image: mediaUrl(d.image),
    imageAlt: str(d.imageAlt),
    gallery: arr(d.gallery).map((g) => ({ src: mediaUrl(g.image), alt: str(g.alt) })),
    realPhotos: Boolean(d.realPhotos),
    featured: Boolean(d.featured),
    order: num(d.order),
  }));
}

export async function getCaseStudy(slug: string): Promise<CaseStudyItem | null> {
  return (await getCaseStudies()).find((c) => c.slug === slug) ?? null;
}

// --- Value props ---
export type ValuePropItem = { slug: string; title: string; description: string };

export async function getValueProps(): Promise<ValuePropItem[]> {
  const docs = await findAll("value-props", 0);
  return docs.map((d) => ({
    slug: str(d.slug),
    title: str(d.title),
    description: str(d.description),
  }));
}
