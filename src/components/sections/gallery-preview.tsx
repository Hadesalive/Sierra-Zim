import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getGallery, getHome } from "@/lib/content";
import { sectionToneClass, type SectionTone } from "@/lib/section";
import { cn } from "@/lib/utils";

// Bento spans applied to the first few gallery items, by index.
const spans = ["sm:col-span-2 sm:row-span-2", "sm:col-span-2", "", ""];

export async function GalleryPreview({ tone = "tint" }: { tone?: SectionTone }) {
  const [home, allGallery] = await Promise.all([getHome(), getGallery()]);
  const tiles = allGallery.filter((g) => g.type !== "video").slice(0, 4);

  return (
    <section className={cn("border-b border-line", sectionToneClass[tone])}>
      <Container className="py-16 lg:py-24">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Eyebrow index="06">{home.galleryEyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl">
              {home.galleryHeading}
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
          {tiles.map((t, i) => (
            <figure
              key={t.src}
              className={`group relative overflow-hidden border border-ink/15 ${spans[i] ?? ""}`}
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
