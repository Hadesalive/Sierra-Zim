import type { Metadata } from "next";
import { ogBase } from "@/lib/metadata";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { getSectors, getSite, getSectorsPage } from "@/lib/content";
import { splitAccentHeading } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const sectorsHero = await getSectorsPage();
  return {
    title: "Sectors we train",
    description: sectorsHero.metaDescription,
    alternates: { canonical: "/sectors" },
    openGraph: {
      ...ogBase("/sectors"),
      title: "Sectors we train · SierraZim",
      description: sectorsHero.intro,
      images: sectorsHero.image
        ? [{ url: sectorsHero.image, alt: sectorsHero.title }]
        : undefined,
    },
  };
}

const SHELL = "mx-auto w-full max-w-[90rem] px-6 sm:px-14";

export default async function SectorsPage() {
  const [sectors, site, hero] = await Promise.all([
    getSectors(),
    getSite(),
    getSectorsPage(),
  ]);

  const [heroLine1, heroLine2] = hero.title
    ? splitAccentHeading(hero.title)
    : ["Sectors we", "train."];

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow || "Built for the work each sector does"}
        title={
          <>
            {heroLine1}
            <br />
            <span className="text-safety-400">{heroLine2}</span>
          </>
        }
        intro={
          hero.intro ||
          "From mining and agriculture to transport and fleets — training and certification built for the work each sector actually does."
        }
      />

      <section className="bg-paper">
        <div aria-hidden className="hazard h-3.5" />
        <div className={`${SHELL} py-28`}>
          <div className="grid gap-1 md:grid-cols-3">
            {sectors.map((sec) => (
              <Link
                key={sec.slug}
                href={`/sectors/${sec.slug}`}
                className="group flex flex-col bg-forest-950 text-white"
              >
                <div className="relative aspect-16/10 overflow-hidden">
                  <Image
                    src={sec.image || "/gallery/truck-cone-course.jpg"}
                    alt={sec.imageAlt || sec.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute bottom-0 left-0 bg-safety-500 px-3.5 py-1.5 font-display text-[15px] font-extrabold uppercase tracking-[0.1em] text-ink">
                    {sec.name}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3.5 p-7 pb-8">
                  <h2 className="font-display text-[27px] font-extrabold uppercase leading-none tracking-[0.01em]">
                    {sec.title}
                  </h2>
                  <p className="text-[14.5px] leading-[1.6] text-white/75">
                    {sec.intro}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand site={site} />
    </>
  );
}
