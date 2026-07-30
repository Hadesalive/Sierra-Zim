import Image from "next/image";
import Link from "next/link";
import { PlusIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { numberToWord, splitAccentHeading } from "@/lib/site";
import type { ProgrammeItem } from "@/lib/content";

/**
 * Programmes accordion — a 3px ink-ruled ledger of native <details> rows. The
 * plus marker rotates and the title turns green on open/hover (CSS in
 * globals.css). Copy + imagery come from the Programmes collection.
 */
export function ProgrammesAccordion({
  programmes,
  eyebrow,
  heading,
  intro,
}: {
  programmes: ProgrammeItem[];
  eyebrow: string;
  /** Home global `programmesHeading`; falls back to the derived count line. */
  heading?: string;
  intro: string;
}) {
  // Never hardcode the count — it must follow the Programmes collection.
  const countLine = `${numberToWord(programmes.length)} programmes.`;
  const [headingLine1, headingLine2] = heading
    ? splitAccentHeading(heading)
    : [countLine, "One standard."];

  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto w-full max-w-[90rem] px-6 py-[120px] sm:px-14">
        <div className="mb-14 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.24em] text-safety-600">
              {eyebrow || "What we train"}
            </p>
            <h2 className="font-display text-fluid-3 font-extrabold uppercase leading-[0.9] tracking-[0.005em]">
              {headingLine1}
              <br />
              <span className="text-forest-700">{headingLine2}</span>
            </h2>
          </div>
          <p className="max-w-[380px] text-[17px] leading-[1.6] text-ink-soft">
            {intro}
          </p>
        </div>

        <div className="border-t-[3px] border-ink">
          {programmes.map((prog, i) => (
            <details
              key={prog.slug}
              className="prog-row border-b border-line-strong"
              open={i === 0}
            >
              <summary className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-5 py-6 sm:gap-8">
                <span className="w-9 font-display text-[28px] font-bold text-line-strong sm:w-[90px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="acc-title font-display text-fluid-acc font-extrabold uppercase leading-none tracking-[0.01em] text-ink transition-colors">
                  {prog.title}
                </span>
                <span className="acc-plus flex size-11 items-center justify-center border-2 border-ink text-ink">
                  <PlusIcon weight="bold" className="size-[18px]" />
                </span>
              </summary>
              <div className="grid gap-8 pb-10 pt-2 lg:grid-cols-[90px_1fr_380px]">
                <div className="hidden lg:block" aria-hidden />
                <div>
                  <p className="max-w-[620px] text-[17px] leading-[1.65] text-ink-soft">
                    {prog.description}
                  </p>
                  <Link
                    href={`/services/${prog.slug}`}
                    className="mt-6 inline-flex items-center gap-2.5 bg-ink px-6 py-3.5 font-display text-[17px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-forest-700"
                  >
                    View programme
                    <ArrowRightIcon weight="bold" className="size-[15px]" />
                  </Link>
                </div>
                <div className="relative aspect-16/10 overflow-hidden border-[3px] border-ink">
                  <Image
                    src={prog.image || "/gallery/truck-cone-course.jpg"}
                    alt={prog.imageAlt || prog.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 380px"
                    className="object-cover"
                  />
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
