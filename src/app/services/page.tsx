import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { ServiceLedger } from "@/components/sections/service-ledger";
import { CertificationPath } from "@/components/sections/certification-path";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Training Programmes",
  description:
    "Defensive driving, heavy-vehicle, oral & theory, simulator, surface mobile equipment, agriculture equipment and pre-employment screening — explore SierraZim's seven specialised training and certification programmes.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        index="01"
        eyebrow="Programmes"
        title={
          <>
            Training and certification
            <br />
            for every class of vehicle.
          </>
        }
        intro={`${site.legalName} delivers seven specialised programmes — each combining classroom theory, practical on-vehicle training and independent assessment, ending in certification you can rely on.`}
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
