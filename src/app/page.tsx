import { Hero } from "@/components/sections/hero";
import { ClientMarquee } from "@/components/sections/client-marquee";
import { ServiceCarousel } from "@/components/sections/service-carousel";
import { CertificationPath } from "@/components/sections/certification-path";
import { WhyUs } from "@/components/sections/why-us";
import { StatementBand } from "@/components/sections/statement-band";
import { WorkPreview } from "@/components/sections/work-preview";
import { GalleryPreview } from "@/components/sections/gallery-preview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientMarquee />
      <ServiceCarousel />
      <CertificationPath tone="tint" />
      <WhyUs tone="white" />
      <WorkPreview tone="tint" />
      <StatementBand />
      <GalleryPreview tone="white" />
    </>
  );
}
