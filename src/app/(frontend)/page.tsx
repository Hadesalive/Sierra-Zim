import { HomeHero } from "@/components/sections/home-hero";
import { ClientTicker } from "@/components/sections/client-ticker";
import { ProgrammesAccordion } from "@/components/sections/programmes-accordion";
import { TheStandard } from "@/components/sections/the-standard";
import { FieldRecord } from "@/components/sections/field-record";
import { ProofRail } from "@/components/sections/proof-rail";
import { HomeQuote } from "@/components/sections/home-quote";
import { CtaBand } from "@/components/sections/cta-band";
import {
  getHome,
  getSite,
  getProgrammes,
  getClients,
  getCaseStudies,
  getGallery,
} from "@/lib/content";

/** Local field photos, always present in /public/gallery — a safe fallback for
 *  the proof rail if the CMS gallery is sparse at build time. */
const FALLBACK_PHOTOS = [
  { src: "/gallery/dadtco-heavy-cones.jpg", alt: "Heavy truck on the cones", caption: "Heavy vehicle — cones" },
  { src: "/gallery/dadtco-classroom.jpg", alt: "Classroom theory session", caption: "Theory — classroom" },
  { src: "/gallery/dadtco-pickup.jpg", alt: "Pickup on the training course", caption: "Light vehicle — yard" },
  { src: "/gallery/dadtco-graduates.jpg", alt: "Graduates with their certificates", caption: "Certified graduates" },
  { src: "/gallery/ceo-onsite-equipment.jpg", alt: "On site with heavy equipment", caption: "On site — equipment" },
  { src: "/gallery/dadtco-sunset.jpg", alt: "Field course at sunset", caption: "Field course — sunset" },
];

export default async function HomePage() {
  const [home, site, programmes, clients, caseStudies, gallery] =
    await Promise.all([
      getHome(),
      getSite(),
      getProgrammes(),
      getClients(),
      getCaseStudies(),
      getGallery(),
    ]);

  // Featured case study drives the "field record" band.
  const featured = caseStudies.find((c) => c.featured) ?? caseStudies[0];
  const otherClients = Array.from(
    new Set(
      caseStudies
        .filter((c) => featured && c.slug !== featured.slug)
        .map((c) => c.client)
        .filter(Boolean),
    ),
  ).slice(0, 5);

  // Proof-rail photos: prefer the CMS gallery, fall back to local field photos.
  const galleryPhotos = gallery
    .filter((g) => g.type === "image" && g.src)
    .map((g) => ({ src: g.src, alt: g.alt, caption: g.caption }));
  const photos = galleryPhotos.length >= 4 ? galleryPhotos.slice(0, 8) : FALLBACK_PHOTOS;

  return (
    <>
      <HomeHero home={home} site={site} programmeCount={programmes.length} />
      <ClientTicker clients={clients} />
      <ProgrammesAccordion
        programmes={programmes}
        eyebrow={home.programmesEyebrow}
        intro={home.programmesIntro}
      />
      <TheStandard steps={home.certPathSteps} />
      {featured && (
        <FieldRecord
          caseStudy={featured}
          homeCity={site.address.city}
          otherClients={otherClients}
        />
      )}
      <ProofRail photos={photos} stats={home.stats} />
      <HomeQuote
        quote={home.statementQuote}
        partnersLabel={home.statementPartnersLabel}
        partners={home.statementPartners}
      />
      <CtaBand
        site={site}
        intro="Tell us the programme, how many people and where — we reply within one business day."
      />
    </>
  );
}
