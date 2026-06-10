import type { Metadata } from "next";
import Image from "next/image";
import { PlayIcon } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { GalleryVideo } from "@/components/gallery-video";
import { getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "See SierraZim Training Academy in action — defensive driving, heavy-vehicle and operator training on real ground, plus certified graduates from programmes including DADTCO Mozambique.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery · SierraZim",
    images: [
      {
        url: "/gallery/dadtco-sunset.jpg",
        alt: "The training truck and cone course at golden hour, DADTCO, Mozambique, 2018",
      },
    ],
  },
};

export default async function GalleryPage() {
  const gallery = await getGallery();
  return (
    <>
      <PageHeader
        index="01"
        eyebrow="Gallery"
        title="Training in the field, captured."
        intro="Real vehicles, real ground and real candidates — from cone courses and heavy haulage to classroom briefings and certified graduates."
        image="/gallery/dadtco-heavy-truck.jpg"
        imageAlt="DADTCO Mozambique heavy haulage truck on the training ground"
      />

      <Container className="py-16 lg:py-20">
        <div className="[column-fill:_balance] gap-4 sm:columns-2 lg:columns-3">
          {gallery.map((item, i) => (
            <figure
              key={item.src}
              className="group relative mb-4 break-inside-avoid overflow-hidden border border-ink/15"
            >
              {item.type === "video" ? (
                <>
                  <div
                    className="relative w-full bg-ink"
                    style={{ aspectRatio: `${item.w} / ${item.h}` }}
                  >
                    <GalleryVideo item={item} />
                  </div>
                  <figcaption className="flex items-center justify-between gap-2 bg-ink px-3 py-2.5 text-paper">
                    <span className="flex items-center gap-2">
                      <PlayIcon weight="fill" className="size-3 text-safety-400" />
                      <span className="label-mono">{item.caption}</span>
                    </span>
                    <span className="label-mono text-safety-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </figcaption>
                </>
              ) : (
                <>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.w}
                    height={item.h}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-ink/80 px-3 py-2.5 text-paper">
                    <span className="flex items-center gap-2">
                      <span className="h-px w-4 bg-safety-400" />
                      <span className="label-mono">{item.caption}</span>
                    </span>
                    <span className="label-mono text-safety-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </figcaption>
                </>
              )}
            </figure>
          ))}
        </div>
      </Container>
    </>
  );
}
