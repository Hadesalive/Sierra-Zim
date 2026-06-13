import type { Metadata } from "next";
import { ogBase } from "@/lib/metadata";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ServiceLedger } from "@/components/sections/service-ledger";
import { CertificationPath } from "@/components/sections/certification-path";
import { getServicesPage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const servicesHero = await getServicesPage();
  return {
    title: "Training Programmes",
    description: servicesHero.metaDescription,
    alternates: { canonical: "/services" },
    openGraph: {
      ...ogBase("/services"),
      title: "Training Programmes · SierraZim",
      images: servicesHero.image
        ? [{ url: servicesHero.image, alt: servicesHero.title }]
        : undefined,
    },
  };
}

export default async function ServicesPage() {
  const servicesHero = await getServicesPage();
  return (
    <>
      <PageHeader
        index="01"
        eyebrow={servicesHero.eyebrow}
        title={servicesHero.title}
        intro={servicesHero.intro}
        image={servicesHero.image}
        imageAlt="Operator training course laid out with safety cones"
      />

      <Container className="py-16 lg:py-20">
        <ServiceLedger withPromo />
      </Container>

      <CertificationPath />
    </>
  );
}
