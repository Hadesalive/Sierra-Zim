import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { HomeContent } from "@/lib/content";

type Photo = { src: string; alt: string; caption: string };

/**
 * Proof rail — a full-bleed horizontal scroll that mixes real 4:3 field photos
 * (dark caption plate) with dark stat plates (hazard-topped, big amber numeral).
 * Photos come from the Gallery collection; stats from the Home global.
 */
export function ProofRail({
  photos,
  stats,
  heading,
  intro,
}: {
  photos: Photo[];
  stats: HomeContent["stats"];
  heading?: string;
  intro?: string;
}) {
  // Interleave photo, stat, photo, stat … then trail with the leftover photos.
  type Item =
    | { kind: "photo"; data: Photo; key: string }
    | { kind: "stat"; data: { value: string; label: string }; key: string };
  const items: Item[] = [];
  photos.forEach((p, i) => {
    items.push({ kind: "photo", data: p, key: `p${i}` });
    if (i < stats.length) items.push({ kind: "stat", data: stats[i], key: `s${i}` });
  });

  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto w-full max-w-[90rem] px-6 pb-14 pt-16 sm:px-14 sm:pt-20 lg:pt-[120px]">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
          <h2 className="font-display text-fluid-3 font-extrabold uppercase leading-[0.88]">
            {heading ? (
              <span className="stroke-green">{heading}</span>
            ) : (
              <>
                Real ground.
                <br />
                Real machines.
                <br />
                <span className="stroke-green">Real results.</span>
              </>
            )}
          </h2>
          <div className="max-w-[360px] pb-2">
            <p className="text-base leading-[1.6] text-ink-soft">
              {intro ||
                "No mock-ups, no stock photos — the yard, the machines and the people we actually train."}
            </p>
            <Link
              href="/gallery"
              className="mt-4.5 inline-flex items-center gap-2.5 border-b-[3px] border-safety-500 pb-1 font-display text-lg font-extrabold uppercase tracking-[0.08em] text-ink transition-colors hover:text-forest-700"
            >
              Full gallery
              <ArrowRightIcon weight="bold" className="size-[15px]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Full-bleed mixed rail */}
      <div className="no-scrollbar flex items-stretch gap-1 overflow-x-auto pb-1">
        {items.map((item) =>
          item.kind === "photo" ? (
            <figure
              key={item.key}
              className="relative m-0 aspect-4/3 w-[300px] flex-none overflow-hidden sm:w-[420px]"
            >
              <Image
                src={item.data.src}
                alt={item.data.alt}
                fill
                sizes="420px"
                className="object-cover"
              />
              {item.data.caption && (
                <figcaption className="absolute bottom-0 left-0 bg-forest-950 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white">
                  {item.data.caption}
                </figcaption>
              )}
            </figure>
          ) : (
            <div
              key={item.key}
              className="flex w-[260px] flex-none flex-col bg-forest-950 sm:w-[300px]"
            >
              <div aria-hidden className="hazard h-2.5" />
              <div className="flex flex-1 flex-col justify-between p-7">
                <p className="break-all font-display text-[clamp(48px,9vw,104px)] font-extrabold leading-[0.85] text-safety-400">
                  {item.data.value}
                </p>
                <p className="font-mono text-[11px] uppercase leading-[1.7] tracking-[0.16em] text-white/75">
                  {item.data.label}
                </p>
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
