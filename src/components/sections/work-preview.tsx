import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getCaseStudies } from "@/lib/content";
import { sectionToneClass, type SectionTone } from "@/lib/section";
import { cn } from "@/lib/utils";

export async function WorkPreview({ tone = "white" }: { tone?: SectionTone }) {
  const caseStudies = await getCaseStudies();
  const featured = caseStudies.find((c) => c.featured) ?? caseStudies[0];
  const others = caseStudies.filter((c) => c.slug !== featured.slug).slice(0, 2);
  const items = [featured, ...others];

  return (
    <section className={cn("border-b border-line", sectionToneClass[tone])}>
      <Container className="py-16 lg:py-24">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <Eyebrow index="05">Selected work</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl">
              Trusted to deliver, on site and across borders.
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="label-mono group flex items-center gap-2 text-ink hover:text-safety-600"
          >
            View portfolio
            <ArrowUpRightIcon
              weight="bold"
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="mt-12 grid border-t border-l border-line lg:grid-cols-3">
          {items.map((c) => (
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
                  sizes="(max-width: 1024px) 100vw, 33vw"
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
  );
}
