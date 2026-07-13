import type { Metadata } from "next";
import { ogBase } from "@/lib/metadata";
import Image from "next/image";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { GalleryVideo } from "@/components/gallery-video";
import { getGallery, getGalleryPage, getSite } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const galleryHero = await getGalleryPage();
  return {
    title: "Gallery",
    description: galleryHero.metaDescription,
    alternates: { canonical: "/gallery" },
    openGraph: {
      ...ogBase("/gallery"),
      title: "Gallery · SierraZim",
      images: galleryHero.image
        ? [{ url: galleryHero.image, alt: galleryHero.title }]
        : undefined,
    },
  };
}

// Dense-mosaic span rhythm (col, row) cycled by index — feature tiles at 0 & 7.
const SPANS: [number, number][] = [
  [2, 2], [2, 1], [1, 1], [1, 1], [2, 1], [1, 1],
  [1, 1], [2, 2], [1, 1], [1, 1], [1, 1], [1, 1],
];

export default async function GalleryPage() {
  const [gallery, hero, site] = await Promise.all([
    getGallery(),
    getGalleryPage(),
    getSite(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow || "On the ground — no stock photos"}
        title={
          <>
            The yard,
            <br />
            <span className="text-safety-400">captured.</span>
          </>
        }
        intro={
          hero.intro ||
          "Real vehicles, real ground and real candidates — from cone courses and heavy haulage to classroom briefings and certified graduates."
        }
      />

      <section className="bg-paper">
        <div aria-hidden className="hazard h-3.5" />
        <div className="grid grid-cols-2 gap-1 p-1 [grid-auto-flow:dense] [grid-auto-rows:240px] lg:grid-cols-4 lg:[grid-auto-rows:300px]">
          {gallery.map((item, i) => {
            const [col, row] = SPANS[i % SPANS.length];
            const spanCls = `${col === 2 ? "col-span-2" : ""} ${row === 2 ? "lg:row-span-2" : ""}`;
            return (
              <figure
                key={item.src || i}
                className={`gal-tile group relative m-0 overflow-hidden ${spanCls}`}
              >
                {item.type === "video" ? (
                  <GalleryVideo item={item} />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
                {item.caption && (
                  <figcaption className="pointer-events-none absolute bottom-0 left-0 flex items-center gap-2.5 bg-forest-950 px-3.5 py-2 text-white">
                    <span aria-hidden className="h-0.5 w-3 bg-safety-400" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                      {item.caption}
                    </span>
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </section>

      <CtaBand
        site={site}
        titleTop="Put your team"
        titleBottom="in the picture."
        secondary="none"
      />
    </>
  );
}
