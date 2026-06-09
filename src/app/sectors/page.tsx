import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { sectors } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sectors we train",
  description:
    "Operator and driver training and certification for mining, agriculture & agribusiness, and transport & fleets across Sierra Leone and the region.",
  alternates: { canonical: "/sectors" },
  openGraph: {
    title: "Sectors we train · SierraZim",
    description:
      "Training and certification shaped around the equipment and conditions each sector works in.",
    images: [
      {
        url: "/gallery/instructor-truck-course.jpg",
        alt: "SierraZim instructor leading a training course on a field ground",
      },
    ],
  },
};

export default function SectorsPage() {
  return (
    <>
      <PageHeader
        index="01"
        eyebrow="Sectors"
        title="Built for the work each sector does."
        intro="From mines to fleets to farms, our programmes are shaped around the equipment and conditions each sector works in — with certification that holds up on the ground."
        image="/gallery/instructor-truck-course.jpg"
        imageAlt="SierraZim instructor leading a training course on a field ground"
      />

      <Container className="py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-3">
          {sectors.map((s) => (
            <Link
              key={s.slug}
              href={`/sectors/${s.slug}`}
              className="group flex flex-col overflow-hidden border border-line bg-paper transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h2 className="font-display text-2xl font-bold text-ink">
                  {s.name}
                </h2>
                <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-ink-soft">
                  {s.intro}
                </p>
                <span className="label-mono mt-6 flex items-center gap-2 text-ink group-hover:text-safety-600">
                  Explore
                  <ArrowUpRightIcon weight="bold" className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
