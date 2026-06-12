import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbLd } from "@/lib/structured-data";
import { ogBase } from "@/lib/metadata";
import {
  getSectors,
  getSector,
  getProgrammes,
  getClients,
} from "@/lib/content";
import { ProgrammeIcon } from "@/lib/icons";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const sectors = await getSectors();
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const sector = await getSector(slug);
  if (!sector) return {};
  return {
    title: sector.title,
    description: sector.metaDescription,
    alternates: { canonical: `/sectors/${slug}` },
    openGraph: {
      ...ogBase(`/sectors/${slug}`),
      title: `${sector.title} · SierraZim`,
      description: sector.metaDescription,
      images: [{ url: sector.image, alt: sector.imageAlt }],
    },
  };
}

export default async function SectorPage({ params }: Params) {
  const { slug } = await params;
  const sector = await getSector(slug);
  if (!sector) notFound();

  const [allProgrammes, allClients] = await Promise.all([
    getProgrammes(),
    getClients(),
  ]);
  const programmes = sector.programmeSlugs
    .map((sl) => allProgrammes.find((p) => p.slug === sl))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const sectorClients = allClients.filter((c) =>
    sector.clientSlugs.includes(c.slug),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Sectors", path: "/sectors" },
          { name: sector.name, path: `/sectors/${slug}` },
        ])}
      />

      <PageHeader
        index="01"
        eyebrow={`Sectors · ${sector.name}`}
        title={sector.title}
        intro={sector.intro}
        image={sector.image}
        imageAlt={sector.imageAlt}
      >
        <div className="mt-8">
          <ButtonLink href="/contact" variant="primary">
            Enquire about a programme
          </ButtonLink>
        </div>
      </PageHeader>

      <Container className="py-16 lg:py-24">
        <Eyebrow index="02">Programmes</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl">
          What we run for {sector.name.toLowerCase()}.
        </h2>
        <div className="mt-10 grid border-t border-l border-line sm:grid-cols-3">
          {programmes.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex flex-col border-b border-r border-line bg-paper p-7 transition-colors hover:bg-paper-3"
              >
                <ProgrammeIcon slug={s.slug} weight="light" className="size-9 text-forest-700" />
                <h3 className="mt-6 font-display text-xl font-bold text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {s.short}
                </p>
                <span className="label-mono mt-5 flex items-center gap-2 text-ink group-hover:text-safety-600">
                  View programme
                  <ArrowUpRightIcon weight="bold" className="size-3.5" />
                </span>
              </Link>
          ))}
        </div>

        {sectorClients.length > 0 && (
          <div className="mt-16">
            <Eyebrow>Who we train for</Eyebrow>
            <div className="mt-8 grid gap-px border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
              {sectorClients.map((c) => (
                <div
                  key={c.name}
                  className="border-b border-r border-line bg-paper p-7"
                >
                  <p className="font-display text-lg font-bold tracking-tight text-ink">
                    {c.name}
                  </p>
                  {c.context && (
                    <p className="mt-1.5 text-sm text-ink-soft">{c.context}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>

      <section className="border-t border-line bg-forest-950 text-paper">
        <Container className="flex flex-col gap-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <h2 className="max-w-2xl font-display text-3xl font-extrabold leading-[1.05] text-paper sm:text-4xl">
            Training and certification for {sector.name.toLowerCase()}, on your
            site or ours.
          </h2>
          <ButtonLink href="/contact" variant="primary">
            Enquire now
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
