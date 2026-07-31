import Image from "next/image";
import { ValuePropIcon } from "@/lib/icons";
import type { HomeContent, ValuePropItem } from "@/lib/content";

/**
 * "Why us" — a dark grout-line grid mixing one field photo with up to three
 * value-prop tiles (icon + index + title + description). Copy comes from the
 * Home global (whyUs* fields); the value props themselves from the Value
 * Props collection.
 */
export function WhyUs({
  home,
  valueProps,
}: {
  home: HomeContent;
  valueProps: ValuePropItem[];
}) {
  if (valueProps.length === 0) return null;

  return (
    <section className="bg-forest-950 text-white">
      <div aria-hidden className="hazard h-3.5" />
      <div className="mx-auto w-full max-w-[90rem] px-6 py-16 sm:px-14 sm:py-20 lg:py-[120px]">
        <div className="mb-14 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.24em] text-safety-400">
              <span aria-hidden className="size-2 shrink-0 bg-safety-400" />
              {home.whyUsEyebrow || "Why SierraZim"}
            </p>
            <h2 className="font-display text-fluid-3 font-extrabold uppercase leading-[0.9]">
              {home.whyUsHeading ||
                "Training built for the work, not the certificate alone."}
            </h2>
          </div>
          <p className="max-w-[420px] text-[17px] leading-[1.6] text-white/75">
            {home.whyUsIntro ||
              "We train the way the job is actually done — on real vehicles and equipment, to standards employers can rely on."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative aspect-4/3 min-h-[240px] overflow-hidden bg-forest-950 sm:col-span-2 lg:col-span-1 lg:aspect-auto">
            <Image
              src={home.whyUsImage || "/gallery/dadtco-graduates.jpg"}
              alt="Certified graduates on completion"
              fill
              sizes="(max-width: 1024px) 100vw, 25vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(4,37,15,0.75), transparent 55%)",
              }}
            />
            {home.whyUsImageCaption && (
              <p className="absolute inset-x-0 bottom-0 p-6 font-mono text-[11px] uppercase tracking-[0.18em] text-white">
                {home.whyUsImageCaption}
              </p>
            )}
          </div>

          {valueProps.slice(0, 3).map((vp, i) => (
            <div
              key={vp.slug || vp.title}
              className="flex flex-col gap-5 bg-forest-950 p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-safety-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ValuePropIcon
                  slug={vp.slug}
                  weight="light"
                  className="size-8 text-safety-400"
                />
              </div>
              <div>
                <h3 className="font-display text-[24px] font-extrabold uppercase leading-[0.95] tracking-[0.01em]">
                  {vp.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-white/70">
                  {vp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
