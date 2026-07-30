import type { Metadata } from "next";
import { ogBase } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { GalleryExplorer } from "@/components/gallery-explorer";
import { getGallery, getGalleryPage, getSite } from "@/lib/content";
import { splitAccentHeading } from "@/lib/site";

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

export default async function GalleryPage() {
  const [gallery, hero, site] = await Promise.all([
    getGallery(),
    getGalleryPage(),
    getSite(),
  ]);

  const [heroLine1, heroLine2] = hero.title
    ? splitAccentHeading(hero.title)
    : ["The yard,", "captured."];

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow || "On the ground — no stock photos"}
        title={
          <>
            {heroLine1}
            <br />
            <span className="text-safety-400">{heroLine2}</span>
          </>
        }
        intro={
          hero.intro ||
          "Real vehicles, real ground and real candidates — from cone courses and heavy haulage to classroom briefings and certified graduates."
        }
      />

      <section className="bg-paper">
        <div aria-hidden className="hazard h-3.5" />
        <GalleryExplorer items={gallery} />
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
