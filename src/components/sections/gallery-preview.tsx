import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { sectionToneClass, type SectionTone } from "@/lib/section";
import { cn } from "@/lib/utils";

const tiles = [
  {
    src: "/gallery/dadtco-heavy-truck.jpg",
    alt: "DADTCO Mozambique heavy haulage truck on a SierraZim training ground",
    caption: "DADTCO Mozambique",
    className: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: "/gallery/graduation-certificates.jpg",
    alt: "SierraZim graduates holding their completion certificates",
    caption: "Certified graduates",
    className: "sm:col-span-2",
  },
  {
    src: "/gallery/light-vehicle-hilux.jpg",
    alt: "Light vehicle navigating a defensive-driving cone course",
    caption: "Defensive driving",
    className: "",
  },
  {
    src: "/gallery/motorbike-training-team.jpg",
    alt: "SierraZim training team on a field programme",
    caption: "On-site team",
    className: "",
  },
];

export function GalleryPreview({ tone = "tint" }: { tone?: SectionTone }) {
  return (
    <section className={cn("border-b border-line", sectionToneClass[tone])}>
      <Container className="py-16 lg:py-24">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Eyebrow index="06">On the ground</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl">
              Real vehicles. Real ground. Real results.
            </h2>
          </div>
          <Link
            href="/gallery"
            className="label-mono group flex items-center gap-2 text-ink hover:text-safety-600"
          >
            View full gallery
            <ArrowUpRightIcon
              weight="bold"
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="mt-10 grid auto-rows-[200px] grid-cols-1 gap-3 sm:grid-cols-4 sm:auto-rows-[180px] lg:auto-rows-[210px]">
          {tiles.map((t) => (
            <figure
              key={t.src}
              className={`group relative overflow-hidden border border-ink/15 ${t.className}`}
            >
              <Image
                src={t.src}
                alt={t.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-ink/80 px-3 py-2 text-paper">
                <span className="h-px w-4 bg-safety-400" />
                <span className="label-mono">{t.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
