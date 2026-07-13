import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ogBase } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import {
  getCaseStudies,
  getSectors,
  getSite,
  getPortfolioPage,
} from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const portfolioHero = await getPortfolioPage();
  return {
    title: "Portfolio",
    description: portfolioHero.metaDescription,
    alternates: { canonical: "/portfolio" },
    openGraph: {
      ...ogBase("/portfolio"),
      title: "Portfolio · SierraZim",
      images: portfolioHero.image
        ? [{ url: portfolioHero.image, alt: portfolioHero.title }]
        : undefined,
    },
  };
}

const SHELL = "mx-auto w-full max-w-[90rem] px-6 sm:px-14";

export default async function PortfolioPage() {
  const [caseStudies, sectors, site, hero] = await Promise.all([
    getCaseStudies(),
    getSectors(),
    getSite(),
    getPortfolioPage(),
  ]);
  const featured = caseStudies.find((c) => c.featured) ?? caseStudies[0];
  if (!featured) notFound();

  const clientCount = caseStudies.length;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow || "Portfolio — programmes delivered"}
        title={
          <>
            The field
            <br />
            <span className="stroke-white">record.</span>
          </>
        }
        intro={
          hero.intro ||
          "From cross-border driver training to mine-site operator certification and youth apprenticeships — the work behind the certificates."
        }
      />

      {/* Featured record */}
      <section className="bg-forest-975 text-white">
        <div
          aria-hidden
          className="hazard h-3.5"
          style={{ "--hz": "#031b0b" } as React.CSSProperties}
        />
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[420px] overflow-hidden border-white/20 lg:min-h-[560px] lg:border-r">
            <Image
              src={featured.image || "/gallery/dadtco-graduates.jpg"}
              alt={featured.imageAlt || `${featured.client} programme`}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(3,27,11,0.9) 5%, rgba(3,27,11,0.15) 45%, rgba(3,27,11,0.3))",
              }}
            />
            <span className="absolute left-0 top-0 bg-safety-500 px-4.5 py-2.5 font-display text-base font-extrabold uppercase tracking-[0.12em] text-ink">
              Field record Nº 001
            </span>
            <div className="absolute inset-x-0 bottom-0 p-9 sm:p-10">
              <p className="stroke-white-thin font-display text-fluid-4 font-extrabold uppercase leading-[0.85] tracking-[0.02em]">
                {featured.location}
              </p>
              <p className="mt-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/80">
                Trainees certified at completion — {featured.client}, {featured.year}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center px-6 py-16 sm:px-14 lg:py-16">
            <p className="mb-4.5 font-mono text-[12px] uppercase tracking-[0.24em] text-safety-400">
              Cross-border delivery — {featured.year}
            </p>
            <h2 className="font-display text-fluid-7 font-extrabold uppercase leading-[0.9]">
              {featured.title}
            </h2>
            <p className="mt-6 text-[16.5px] leading-[1.65] text-white/80">
              {featured.summary}
            </p>
            <dl className="mt-7 border-t border-white/25">
              <div className="grid grid-cols-[110px_1fr] gap-6 border-b border-white/15 py-3.5 sm:grid-cols-[150px_1fr]">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/55">
                  Delivered
                </dt>
                <dd className="text-[14.5px] leading-[1.6] text-white/85">
                  {featured.delivered.join(" · ")}
                </dd>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-6 border-b border-white/15 py-3.5 sm:grid-cols-[150px_1fr]">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/55">
                  Outcome
                </dt>
                <dd className="text-[14.5px] leading-[1.6] text-safety-400">
                  {featured.outcomes[0]}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* All records */}
      <section className="bg-paper text-ink">
        <div className={`${SHELL} py-24`}>
          <div className="mb-12 flex flex-wrap items-baseline gap-x-6 gap-y-3">
            <h2 className="font-display text-fluid-5 font-extrabold uppercase leading-[0.9]">
              All records
            </h2>
            <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-safety-600">
              {clientCount} clients · three countries · ongoing
            </p>
          </div>
          <div className="border-t-[3px] border-ink">
            {caseStudies.map((c, i) => (
              <Link
                key={c.slug}
                href={`/portfolio/${c.slug}`}
                className="group grid grid-cols-[52px_1fr_auto] items-center gap-4 border-b border-line-strong py-6 transition-colors hover:bg-paper-2 lg:grid-cols-[80px_0.8fr_150px_1.3fr_48px] lg:gap-8"
              >
                <span className="self-start font-mono text-[12px] uppercase tracking-[0.2em] text-safety-600 lg:self-center">
                  {`Nº ${String(i + 1).padStart(3, "0")}`}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[26px] font-extrabold uppercase leading-none tracking-[0.02em] sm:text-[32px]">
                    {c.client}
                  </h3>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    {c.sector}
                    <span className="lg:hidden">
                      {" · "}
                      {c.location}
                      {c.year && ` · ${c.year}`}
                    </span>
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.5] text-ink-soft lg:hidden">
                    {c.summary}
                  </p>
                </div>
                <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-soft lg:block">
                  {c.location}
                  {c.year && ` · ${c.year}`}
                </span>
                <p className="hidden text-[15px] leading-[1.55] text-ink-soft lg:block">
                  {c.summary}
                </p>
                <ArrowUpRightIcon
                  weight="bold"
                  className="size-5 justify-self-end text-ink transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-safety-600"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      {sectors.length > 0 && (
        <section className="border-t border-line-strong bg-paper-2 text-ink">
          <div className={`${SHELL} py-24`}>
            <div className="mb-12 flex flex-wrap items-baseline gap-x-6 gap-y-3">
              <h2 className="font-display text-fluid-5 font-extrabold uppercase leading-[0.9]">
                Built for the work
                <br />
                each sector does.
              </h2>
              <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-safety-600">
                Sectors
              </p>
            </div>
            <div className="grid gap-1 md:grid-cols-3">
              {sectors.slice(0, 3).map((sec) => (
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
                    <h3 className="font-display text-[27px] font-extrabold uppercase leading-none tracking-[0.01em]">
                      {sec.title}
                    </h3>
                    <p className="text-[14.5px] leading-[1.6] text-white/75">
                      {sec.intro}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        site={site}
        titleTop="Your fleet could be"
        titleBottom="the next record."
        secondary="none"
      />
    </>
  );
}
