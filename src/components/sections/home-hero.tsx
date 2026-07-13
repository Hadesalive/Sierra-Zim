import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import type { HomeContent, SiteSettings } from "@/lib/content";

/**
 * v2 hero — dark forest surface, stacked road-signage headline (solid / outline
 * stroke / amber), a full-bleed field photo edged with a vertical hazard stripe,
 * and a rotated "certified" stamp. Entrance staggers with the `.rise` keyframe
 * (disabled under prefers-reduced-motion).
 */
export function HomeHero({
  home,
  site,
  programmeCount,
}: {
  home: HomeContent;
  site: SiteSettings;
  programmeCount: number;
}) {
  const heroSrc = home.heroImage || "/gallery/dadtco-heavy-truck.jpg";
  const specs = [
    { value: String(programmeCount).padStart(2, "0"), label: "programmes" },
    { value: "03", label: "countries" },
    { value: "100%", label: "assessed before certified" },
  ];

  return (
    <section className="relative overflow-hidden bg-forest-950 text-white">
      <div className="grid lg:min-h-[calc(92vh-72px)] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left — copy */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-14">
          <p
            className="rise mb-7 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.24em] text-white/65"
          >
            <span aria-hidden className="size-2 shrink-0 bg-safety-400" />
            {site.address.city}, {site.address.country} — on real ground since day
            one
          </p>

          <h1
            className="rise font-display font-extrabold uppercase leading-[0.88] tracking-[0.005em]"
            style={{ animationDelay: "0.08s", fontSize: "clamp(56px, 11vw, 148px)" }}
          >
            Trained.
            <br />
            <span className="stroke-white">Tested.</span>
            <br />
            <span className="text-safety-400">Certified.</span>
          </h1>

          <p
            className="rise mt-9 max-w-[520px] text-lg leading-[1.6] text-white/80"
            style={{ animationDelay: "0.16s" }}
          >
            {home.heroSubhead}
          </p>

          <div
            className="rise mt-11 flex flex-wrap gap-3.5"
            style={{ animationDelay: "0.24s" }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-safety-500 px-8 py-[18px] font-display text-xl font-extrabold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-safety-400"
            >
              Train your team
              <ArrowRightIcon weight="bold" className="size-[18px]" />
            </Link>
            <a
              href={site.whatsappHref}
              rel="noopener"
              className="inline-flex items-center gap-3 border-2 border-white/35 px-8 py-4 font-display text-xl font-bold uppercase tracking-[0.06em] text-white transition-colors hover:border-white hover:bg-white/[0.06]"
            >
              <WhatsappLogoIcon weight="fill" className="size-5 text-safety-400" />
              WhatsApp us
            </a>
          </div>

          <dl
            className="rise mt-[3.25rem] flex flex-wrap gap-x-10 gap-y-3 border-t-2 border-dashed border-white/25 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60"
            style={{ animationDelay: "0.32s" }}
          >
            {specs.map((s) => (
              <div key={s.label} className="flex gap-2">
                <dt className="sr-only">{s.label}</dt>
                <dd className="flex gap-2">
                  <span className="text-safety-400">{s.value}</span>
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right — photo panel */}
        <div className="relative min-h-[60vh] lg:min-h-0">
          <span
            aria-hidden
            className="hazard absolute inset-y-0 left-0 z-[2] w-4"
          />
          <Image
            src={heroSrc}
            alt="SierraZim heavy-vehicle training on the field course"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(4,37,15,0.55), transparent 45%)",
            }}
          />

          {/* Rotated certified stamp */}
          <div className="absolute right-9 top-9 rotate-[7deg] border-2 border-safety-400/85 p-[5px] opacity-95">
            <div className="border border-safety-400/60 px-5 py-3 text-center text-safety-400">
              <span className="block font-mono text-[9px] uppercase tracking-[0.26em]">
                {site.shortName} · {site.address.city}
              </span>
              <span className="my-1 block font-display text-[26px] font-extrabold uppercase leading-none tracking-[0.14em]">
                Certified
              </span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.26em]">
                Theory + Practical
              </span>
            </div>
          </div>

          {/* Caption row */}
          <div className="absolute inset-x-0 bottom-0 left-4 flex items-baseline justify-between px-7 py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/85">
            <span>Field course — heavy vehicle</span>
            <span className="hidden sm:inline">08°53′N 12°03′W</span>
          </div>
        </div>
      </div>
    </section>
  );
}
