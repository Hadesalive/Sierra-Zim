import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { caseStudies } from "@/lib/site";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Programmes SierraZim Training Academy has delivered — including cross-border driver training for DADTCO Mozambique, surface mobile equipment training for Sierra Rutile, and youth apprenticeships with Sierra Tropical, NAYCOM and UNDP.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio · SierraZim",
    images: [
      {
        url: "/gallery/dadtco-heavy-truck.jpg",
        alt: "A DADTCO haulage truck on the SierraZim training ground, Mozambique, 2018",
      },
    ],
  },
};

export default function PortfolioPage() {
  const featured = caseStudies.find((c) => c.featured) ?? caseStudies[0];
  const rest = caseStudies.filter((c) => c.slug !== featured.slug);

  return (
    <>
      <PageHeader
        index="01"
        eyebrow="Portfolio"
        title="Programmes we've delivered."
        intro="From cross-border driver training to mine-site operator certification and youth apprenticeships — a look at the work behind the certificates."
        image="/gallery/graduation-certificates.jpg"
        imageAlt="SierraZim graduates holding their completion certificates"
      />

      {/* Featured */}
      <Container className="py-16 lg:py-24">
        <Eyebrow index="02">Featured case study</Eyebrow>
        <Link
          href={`/portfolio/${featured.slug}`}
          className="group mt-8 grid overflow-hidden border border-line lg:grid-cols-2"
        >
          <div className="relative aspect-[4/3] lg:aspect-auto">
            <Image
              src={featured.image}
              alt={featured.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span className="absolute left-0 top-0 bg-safety-500 px-4 py-2 label-mono text-ink">
              {featured.year}
            </span>
          </div>
          <div className="flex flex-col justify-center bg-paper p-8 lg:p-12">
            <div className="label-mono flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-soft">
              <span className="text-safety-600">{featured.sector}</span>
              <span className="flex items-center gap-1.5">
                <MapPinIcon weight="bold" className="size-3.5" />
                {featured.location}
              </span>
            </div>
            <h3 className="mt-5 font-display text-3xl font-extrabold leading-[1.02] text-ink lg:text-4xl">
              {featured.client}
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
              {featured.summary}
            </p>
            <span className="label-mono mt-7 flex items-center gap-2 text-ink transition-colors group-hover:text-safety-600">
              Read case study
              <ArrowUpRightIcon
                weight="bold"
                className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </Link>
      </Container>

      {/* Grid */}
      <section className="border-t border-line bg-paper-2">
        <Container className="py-16 lg:py-24">
          <Eyebrow index="03">More engagements</Eyebrow>
          <div className="mt-8 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((c) => (
              <Link
                key={c.slug}
                href={`/portfolio/${c.slug}`}
                className="group flex flex-col border-b border-r border-line bg-paper"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-0 top-0 bg-ink/80 px-3 py-1.5 label-mono text-paper">
                    {c.sector}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="label-mono flex items-center gap-1.5 text-ink-soft">
                    <MapPinIcon weight="bold" className="size-3.5 text-safety-600" />
                    {c.location} · {c.year}
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-ink">
                    {c.client}
                  </h3>
                  <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
                    {c.summary}
                  </p>
                  <span className="label-mono mt-6 flex items-center gap-2 text-ink transition-colors group-hover:text-safety-600">
                    Read case study
                    <ArrowUpRightIcon
                      weight="bold"
                      className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
