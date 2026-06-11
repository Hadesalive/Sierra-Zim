import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ServiceLedger } from "@/components/sections/service-ledger";
import { CertificationPath } from "@/components/sections/certification-path";
import { getPages } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { servicesHero } = await getPages();
  return {
    title: "Training Programmes",
    description: servicesHero.metaDescription,
    alternates: { canonical: "/services" },
    openGraph: {
      title: "Training Programmes · SierraZim",
      images: [
        {
          url: "/gallery/truck-cone-course.jpg",
          alt: "Operator training course set out with cones on a red-earth field",
        },
      ],
    },
  };
}

export default async function ServicesPage() {
  const { servicesHero } = await getPages();
  return (
    <>
      <PageHeader
        index="01"
        eyebrow={servicesHero.eyebrow}
        title={servicesHero.title}
        intro={servicesHero.intro}
        image="/gallery/truck-cone-course.jpg"
        imageAlt="Operator training course laid out with safety cones"
      />

      <Container className="py-16 lg:py-20">
        <ServiceLedger withPromo />
      </Container>

      <CertificationPath />
    </>
  );
}
