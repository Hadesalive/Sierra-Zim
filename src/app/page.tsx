import { Hero } from "@/components/sections/hero";
import { ClientMarquee } from "@/components/sections/client-marquee";
import { ServiceCarousel } from "@/components/sections/service-carousel";
import { CertificationPath } from "@/components/sections/certification-path";
import { WhyUs } from "@/components/sections/why-us";
import { StatementBand } from "@/components/sections/statement-band";
import { WorkPreview } from "@/components/sections/work-preview";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { Faq } from "@/components/sections/faq";
import { JsonLd } from "@/components/json-ld";
import { faqLd } from "@/lib/structured-data";
import { getFaqs, getProgrammes } from "@/lib/content";

export default async function HomePage() {
  const [faqs, programmes] = await Promise.all([getFaqs(), getProgrammes()]);
  return (
    <>
      <JsonLd data={faqLd(faqs)} />
      <Hero />
      <ClientMarquee />
      <ServiceCarousel programmes={programmes} />
      <CertificationPath tone="tint" />
      <WhyUs tone="white" />
      <WorkPreview tone="tint" />
      <GalleryPreview tone="white" />
      <Faq tone="tint" faqs={faqs} />
      <StatementBand />
    </>
  );
}
