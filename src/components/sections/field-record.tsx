import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, TruckIcon } from "@phosphor-icons/react/dist/ssr";
import type { CaseStudyItem } from "@/lib/content";

/**
 * "Field record" — the featured case study as a dark docket band: a captioned
 * field photo with an outlined place name, a cross-border route line, and a
 * label/value docket table. Content comes from the Case Studies collection.
 */
export function FieldRecord({
  caseStudy,
  homeCity,
  otherClients,
}: {
  caseStudy: CaseStudyItem;
  homeCity: string;
  otherClients: string[];
}) {
  const rows: { label: string; value: string; accent?: boolean }[] = [
    { label: "Client", value: caseStudy.client },
    { label: "Sector", value: caseStudy.sector },
    {
      label: "Scope",
      value: caseStudy.delivered.slice(0, 3).join(" · ") || caseStudy.summary,
    },
    {
      label: "Result",
      value: caseStudy.outcomes[0] || "Fleet drivers certified — theory and practical passed",
      accent: true,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-forest-975 text-white">
      <div
        aria-hidden
        className="hazard h-3.5"
        style={{ "--hz": "#031b0b" } as React.CSSProperties}
      />
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* Photo side */}
        <div className="case-hover group relative min-h-[420px] overflow-hidden border-white/20 lg:min-h-[660px] lg:border-r">
          <Image
            src={caseStudy.image || "/gallery/dadtco-sunset.jpg"}
            alt={caseStudy.imageAlt || `${caseStudy.client} field training course`}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
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
            <p className="stroke-white-thin font-display text-fluid-2 font-extrabold uppercase leading-[0.85] tracking-[0.02em]">
              {caseStudy.location}
            </p>
            <p className="mt-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/80">
              {caseStudy.client} — purpose-laid field course
            </p>
          </div>
        </div>

        {/* Docket side */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-16 lg:py-18">
          <p className="mb-4.5 font-mono text-[12px] uppercase tracking-[0.24em] text-safety-400">
            Cross-border delivery — {caseStudy.year}
          </p>
          <h2 className="font-display text-fluid-6 font-extrabold uppercase leading-[0.9]">
            {caseStudy.title || "We took the academy across borders."}
          </h2>

          {/* Route line */}
          <div className="mt-9 flex items-center gap-4 font-mono text-[12px] uppercase tracking-[0.2em] text-white/85">
            <span className="flex items-center gap-2">
              <span aria-hidden className="size-2 bg-safety-400" />
              {homeCity}, SL
            </span>
            <span
              aria-hidden
              className="relative flex-1 border-t-2 border-dashed border-white/35"
            >
              <TruckIcon
                weight="fill"
                className="absolute -right-1 -top-[9px] size-[18px] text-safety-400"
              />
            </span>
            <span className="flex items-center gap-2">
              {caseStudy.location}
              <span aria-hidden className="size-2 border-2 border-safety-400" />
            </span>
          </div>

          {/* Docket table */}
          <dl className="mt-9 flex flex-col border-t border-white/25">
            {rows.map((r) => (
              <div
                key={r.label}
                className="grid grid-cols-[110px_1fr] gap-6 border-b border-white/15 py-3.5 sm:grid-cols-[150px_1fr]"
              >
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/55">
                  {r.label}
                </dt>
                <dd
                  className={
                    r.label === "Client"
                      ? "font-display text-[21px] font-bold uppercase tracking-[0.03em]"
                      : r.accent
                        ? "text-[15px] text-safety-400"
                        : "text-[15px] text-white/85"
                  }
                >
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3.5">
            <Link
              href={`/portfolio/${caseStudy.slug}`}
              className="inline-flex items-center gap-3 bg-white px-7 py-4 font-display text-lg font-extrabold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-safety-400"
            >
              Read the case
              <ArrowRightIcon weight="bold" className="size-4" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-3 border-2 border-white/40 px-7 py-3.5 font-display text-lg font-bold uppercase tracking-[0.06em] text-white transition-colors hover:border-white hover:bg-white/[0.08]"
            >
              All work
            </Link>
          </div>

          {otherClients.length > 0 && (
            <p className="mt-11 border-t border-white/15 pt-5.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
              <span className="text-safety-400">Also on the ground — </span>
              {otherClients.join(" · ")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
