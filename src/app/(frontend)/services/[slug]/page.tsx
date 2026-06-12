import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckIcon,
  SealCheckIcon,
  ArrowUpRightIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/json-ld";
import { courseLd, breadcrumbLd } from "@/lib/structured-data";
import { getProgramme, getProgrammes, getSite } from "@/lib/content";
import { programmeIcon, ProgrammeIcon } from "@/lib/icons";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const programmes = await getProgrammes();
  return programmes.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [service, site] = await Promise.all([getProgramme(slug), getSite()]);
  if (!service) return {};
  return {
    title: service.title,
    description: service.short,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} · ${site.shortName}`,
      description: service.short,
      images: [{ url: service.image, alt: service.imageAlt }],
    },
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const [programmes, site] = await Promise.all([getProgrammes(), getSite()]);
  const service = programmes.find((p) => p.slug === slug);
  if (!service) notFound();

  const index = programmes.findIndex((p) => p.slug === slug) + 1;
  const others = programmes.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd data={courseLd(service, site)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Programmes", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-forest-950 text-paper">
        <div className="absolute inset-0 -z-10">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-forest-950 via-forest-950/70 to-forest-950/35" />
          <div className="absolute inset-0 bg-linear-to-r from-forest-950/80 via-forest-950/25 to-transparent" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-safety-500" aria-hidden />

        <Container className="relative flex min-h-[58svh] flex-col justify-end py-14 lg:min-h-[540px] lg:py-20">
          <nav className="label-mono flex items-center gap-2 text-paper/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-paper">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-paper">Programmes</Link>
            <span>/</span>
            <span className="text-safety-400">{service.title}</span>
          </nav>

          <div className="mt-8 flex items-center gap-4">
            <span className="label-mono text-safety-400">
              {String(index).padStart(2, "0")} / 07
            </span>
            <ProgrammeIcon slug={slug} weight="light" className="size-11 text-paper" />
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-[2.5rem] font-extrabold leading-[0.98] tracking-tight text-paper sm:text-6xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-paper/85">
            {service.short}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <ButtonLink href="/contact" variant="primary">
              Enrol on this programme
            </ButtonLink>
            <Link
              href="/services"
              className="label-mono py-1.5 text-paper underline decoration-paper/40 decoration-2 underline-offset-[6px] transition-colors hover:decoration-safety-400"
            >
              ← All programmes
            </Link>
          </div>
        </Container>
      </section>

      {/* Body */}
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16 lg:py-24">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink">
            About this programme
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            {service.description}
          </p>

          <h3 className="mt-12 font-display text-2xl font-bold text-ink">
            What it covers
          </h3>
          <ul className="mt-6 grid gap-px border-t border-l border-line sm:grid-cols-2">
            {service.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 border-b border-r border-line bg-paper p-5"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center bg-safety-500 text-ink">
                  <CheckIcon weight="bold" className="size-3.5" />
                </span>
                <span className="leading-snug text-ink">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Aside */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-line bg-paper-2 p-7">
            <div className="flex items-center gap-2 text-forest-700">
              <SealCheckIcon weight="fill" className="size-6 text-safety-600" />
              <span className="label-mono text-ink">Programme facts</span>
            </div>
            <dl className="mt-6 space-y-5 text-sm">
              <div className="border-b border-line pb-4">
                <dt className="label-mono text-ink-soft">Who it&rsquo;s for</dt>
                <dd className="mt-1.5 leading-snug text-ink">{service.audience}</dd>
              </div>
              <div className="border-b border-line pb-4">
                <dt className="label-mono text-ink-soft">Format</dt>
                <dd className="mt-1.5 leading-snug text-ink">{service.format}</dd>
              </div>
              <div className="border-b border-line pb-4">
                <dt className="label-mono text-ink-soft">What you get</dt>
                <dd className="mt-1.5 leading-snug text-ink">{service.certification}</dd>
              </div>
              <div>
                <dt className="label-mono text-ink-soft">Where</dt>
                <dd className="mt-1.5 leading-snug text-ink">
                  {site.address.city}, {site.address.region} — or on your site
                </dd>
              </div>
            </dl>
            <Link
              href="/contact"
              className="mt-7 flex w-full items-center justify-center gap-2 bg-forest-800 px-5 py-3.5 font-mono text-[0.74rem] uppercase tracking-[0.16em] text-paper transition-colors hover:bg-forest-700"
            >
              Request this programme
              <ArrowUpRightIcon weight="bold" className="size-3.5" />
            </Link>
          </div>
        </aside>
      </Container>

      {/* Related */}
      <section className="border-t border-line bg-paper-2">
        <Container className="py-16 lg:py-20">
          <div className="flex items-center gap-3">
            <ArrowLeftIcon weight="bold" className="size-4 text-safety-600" />
            <span className="label-mono text-ink-soft">More programmes</span>
          </div>
          <div className="mt-8 grid border-t border-l border-line sm:grid-cols-3">
            {others.map((s) => {
              const OIcon = programmeIcon(s.slug);
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex flex-col border-b border-r border-line bg-paper p-7 transition-colors hover:bg-paper-3"
                >
                  <OIcon weight="light" className="size-9 text-forest-700" />
                  <h3 className="mt-6 font-display text-xl font-bold text-ink">
                    {s.title}
                  </h3>
                  <span className="label-mono mt-5 flex items-center gap-2 text-ink group-hover:text-safety-600">
                    View
                    <ArrowUpRightIcon weight="bold" className="size-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
