import type { Metadata } from "next";
import { ogBase } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/sections/page-hero";
import { TheStandard } from "@/components/sections/the-standard";
import { CtaBand } from "@/components/sections/cta-band";
import { numberToWord, splitAccentHeading } from "@/lib/site";
import { getServicesPage, getProgrammes, getHome, getSite } from "@/lib/content";

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

const SHELL = "mx-auto w-full max-w-[90rem] px-6 sm:px-14";

const DOCKET_ROWS = [
  { label: "Who it's for", key: "audience" as const },
  { label: "Format", key: "format" as const },
  { label: "Outcome", key: "certification" as const },
];

export default async function ServicesPage() {
  const [servicesHero, programmes, home, site] = await Promise.all([
    getServicesPage(),
    getProgrammes(),
    getHome(),
    getSite(),
  ]);

  const [heroLine1, heroLine2] = servicesHero.title
    ? splitAccentHeading(servicesHero.title)
    : [`${numberToWord(programmes.length)} programmes.`, "One standard."];

  return (
    <>
      <PageHero
        eyebrow={servicesHero.eyebrow || "The programmes"}
        title={
          <>
            {heroLine1}
            <br />
            <span className="text-safety-400">{heroLine2}</span>
          </>
        }
        intro={
          servicesHero.intro ||
          "Each combines classroom theory, practical on-vehicle training and independent assessment — ending in certification you can rely on."
        }
        specs={[
          { accent: "Theory", rest: "+ oral exam" },
          { accent: "Practical", rest: "on the yard" },
          { accent: "Certified", rest: "only when both passed" },
        ]}
      />

      {/* Programme dockets */}
      <section className="bg-paper text-ink">
        {programmes.map((prog, i) => (
          <article key={prog.slug} className="border-b border-line-strong">
            <div className={`${SHELL} py-16 lg:py-18`}>
              <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <div className="relative">
                  <span
                    aria-hidden
                    className="stroke-line pointer-events-none absolute -left-1 -top-7 z-0 font-display text-[120px] font-extrabold leading-none"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative z-[1] aspect-16/11 overflow-hidden border-[3px] border-ink">
                    <Image
                      src={prog.image || "/gallery/truck-cone-course.jpg"}
                      alt={prog.imageAlt || prog.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover"
                    />
                    {prog.short && (
                      <span className="absolute bottom-0 left-0 line-clamp-1 max-w-[260px] bg-forest-950 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white">
                        {prog.short}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-fluid-8 font-extrabold uppercase leading-[0.92]">
                    {prog.title}
                  </h2>
                  <p className="mt-5 text-[16.5px] leading-[1.65] text-ink-soft">
                    {prog.description}
                  </p>
                  <dl className="mt-7 border-t border-line-strong">
                    {DOCKET_ROWS.map((row) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-[110px_1fr] gap-5 border-b border-line py-3 sm:grid-cols-[140px_1fr] sm:gap-6"
                      >
                        <dt className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-safety-600">
                          {row.label}
                        </dt>
                        <dd className="text-[14.5px] leading-[1.55] text-ink">
                          {prog[row.key]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href="/contact"
                    className="mt-7 inline-flex items-center gap-2.5 bg-ink px-6 py-3.5 font-display text-[18px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-forest-700"
                  >
                    Book this programme
                    <ArrowRightIcon weight="bold" className="size-[15px]" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <TheStandard
        steps={home.certPathSteps}
        eyebrow={home.certPathEyebrow}
        heading={home.certPathHeading}
        intro={home.certPathIntro}
      />

      <CtaBand
        site={site}
        titleTop="Not sure which"
        titleBottom="programme?"
        intro="Tell us your fleet and we'll build the training plan."
        primaryLabel="Talk to us"
        secondary="whatsapp"
      />
    </>
  );
}
