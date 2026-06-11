import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckIcon,
  ArrowUpRightIcon,
  MapPinIcon,
  BuildingsIcon,
  CalendarBlankIcon,
  TargetIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd } from "@/lib/structured-data";
import { getCaseStudies, getCaseStudy, getProgrammes } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.client} — Case Study`,
    description: study.summary,
    alternates: { canonical: `/portfolio/${study.slug}` },
    openGraph: {
      title: `${study.client} · Case Study`,
      description: study.summary,
      images: [{ url: study.image, alt: study.imageAlt }],
    },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const [allCases, allProgrammes] = await Promise.all([
    getCaseStudies(),
    getProgrammes(),
  ]);
  const related = allCases.filter((c) => c.slug !== slug).slice(0, 3);
  const involvedServices = study.serviceSlugs
    .map((sl) => allProgrammes.find((p) => p.slug === sl))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Portfolio", path: "/portfolio" },
          { name: study.client, path: `/portfolio/${study.slug}` },
        ])}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-forest-950 text-paper">
        <div className="absolute inset-0 -z-10">
          <Image
            src={study.image}
            alt={study.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-forest-950 via-forest-950/70 to-forest-950/35" />
          <div className="absolute inset-0 bg-linear-to-r from-forest-950/80 via-forest-950/25 to-transparent" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-safety-500" aria-hidden />

        <Container className="relative flex min-h-[60svh] flex-col justify-end py-14 lg:min-h-[560px] lg:py-20">
          <nav className="label-mono flex items-center gap-2 text-paper/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-paper">Home</Link>
            <span>/</span>
            <Link href="/portfolio" className="hover:text-paper">Portfolio</Link>
            <span>/</span>
            <span className="text-safety-400">{study.client}</span>
          </nav>

          <div className="label-mono mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-paper/80">
            <span className="text-safety-400">{study.sector}</span>
            <span className="flex items-center gap-1.5">
              <MapPinIcon weight="bold" className="size-3.5" />
              {study.location}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarBlankIcon weight="bold" className="size-3.5" />
              {study.year}
            </span>
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-[2.4rem] font-extrabold leading-[0.98] tracking-tight text-paper sm:text-6xl">
            {study.client}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85">
            {study.title}
          </p>
        </Container>
      </section>

      {/* Body */}
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16 lg:py-24">
        <div>
          <Eyebrow index="01">Overview</Eyebrow>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            {study.overview}
          </p>

          {/* Delivered */}
          <h2 className="mt-12 font-display text-2xl font-bold text-ink">
            What we delivered
          </h2>
          <ul className="mt-6 grid gap-px border-t border-l border-line sm:grid-cols-2">
            {study.delivered.map((d) => (
              <li
                key={d}
                className="flex items-start gap-3 border-b border-r border-line bg-paper p-5"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center bg-safety-500 text-ink">
                  <CheckIcon weight="bold" className="size-3.5" />
                </span>
                <span className="leading-snug text-ink">{d}</span>
              </li>
            ))}
          </ul>

          {/* Outcomes */}
          <h2 className="mt-12 flex items-center gap-3 font-display text-2xl font-bold text-ink">
            <TargetIcon weight="bold" className="size-6 text-forest-700" />
            Outcomes
          </h2>
          <ul className="mt-6 space-y-3">
            {study.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3 text-ink-soft">
                <span className="mt-2 size-1.5 shrink-0 bg-safety-500" />
                <span className="leading-relaxed">{o}</span>
              </li>
            ))}
          </ul>

          {/* Gallery */}
          {study.gallery && study.gallery.length > 0 && (
            <div className="mt-14">
              <Eyebrow>From the programme</Eyebrow>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {study.gallery.map((g) => (
                  <figure
                    key={g.src}
                    className="relative aspect-[4/3] overflow-hidden border border-ink/15"
                  >
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 45vw"
                      className="object-cover"
                    />
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Aside */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-line bg-paper-2 p-7">
            <span className="label-mono text-ink-soft">Engagement</span>
            <dl className="mt-6 space-y-5 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                <dt className="flex items-center gap-2 text-ink-soft">
                  <BuildingsIcon weight="bold" className="size-4 text-safety-600" />
                  Client
                </dt>
                <dd className="text-right font-medium text-ink">{study.client}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                <dt className="text-ink-soft">Sector</dt>
                <dd className="text-right font-medium text-ink">{study.sector}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                <dt className="text-ink-soft">Location</dt>
                <dd className="text-right font-medium text-ink">{study.location}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-soft">Year</dt>
                <dd className="text-right font-medium text-ink">{study.year}</dd>
              </div>
            </dl>

            {involvedServices.length > 0 && (
              <div className="mt-7 border-t border-line pt-6">
                <span className="label-mono text-ink-soft">Programmes involved</span>
                <ul className="mt-4 space-y-2">
                  {involvedServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group flex items-center justify-between gap-3 text-sm text-ink hover:text-safety-600"
                      >
                        {s.title}
                        <ArrowUpRightIcon
                          weight="bold"
                          className="size-3.5 shrink-0 text-safety-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-7">
              <ButtonLink href="/contact" variant="dark" className="w-full justify-center">
                Start your programme
              </ButtonLink>
            </div>
          </div>
        </aside>
      </Container>

      {/* Related */}
      <section className="border-t border-line bg-paper-2">
        <Container className="py-16 lg:py-20">
          <Eyebrow>More case studies</Eyebrow>
          <div className="mt-8 grid border-t border-l border-line sm:grid-cols-3">
            {related.map((c) => (
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
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-6">
                  <p className="label-mono text-safety-600">{c.sector}</p>
                  <h3 className="mt-3 font-display text-xl font-bold text-ink">
                    {c.client}
                  </h3>
                  <span className="label-mono mt-5 flex items-center gap-2 text-ink group-hover:text-safety-600">
                    Read
                    <ArrowUpRightIcon weight="bold" className="size-3.5" />
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
