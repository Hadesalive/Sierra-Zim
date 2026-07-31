import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import type { HomeContent } from "@/lib/content";

type FaqItem = { q: string; a: string };

/**
 * FAQ — a ledger of native <details> rows (same interaction pattern as the
 * programmes accordion): a numeral, the question, a rotating plus, and the
 * answer beneath. Copy comes from the FAQs collection; heading from the Home
 * global (faqEyebrow / faqHeading — shared across pages, not page-specific).
 */
export function Faq({
  faqs,
  eyebrow,
  heading,
}: {
  faqs: FaqItem[];
  eyebrow: HomeContent["faqEyebrow"];
  heading: HomeContent["faqHeading"];
}) {
  if (faqs.length === 0) return null;

  return (
    <section className="border-t border-line-strong bg-paper-2 text-ink">
      <div className="mx-auto w-full max-w-[90rem] px-6 py-16 sm:px-14 sm:py-20 lg:py-28">
        <div className="mb-14 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <h2 className="font-display text-fluid-5 font-extrabold uppercase leading-[0.9]">
            {heading || "Questions employers ask us."}
          </h2>
          <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-safety-600">
            {eyebrow || "FAQ"}
          </p>
        </div>

        <div className="border-t-[3px] border-ink">
          {faqs.map((f, i) => (
            <details key={f.q} className="prog-row border-b border-line-strong">
              <summary className="grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-5 py-6 sm:gap-8">
                <span className="w-9 font-display text-[28px] font-bold text-line-strong sm:w-[90px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="acc-title font-display text-[19px] font-extrabold uppercase leading-[1.15] tracking-[0.005em] text-ink transition-colors sm:text-[22px]">
                  {f.q}
                </span>
                <span className="acc-plus flex size-11 shrink-0 items-center justify-center border-2 border-ink text-ink">
                  <PlusIcon weight="bold" className="size-[18px]" />
                </span>
              </summary>
              <div className="pb-8 pl-0 sm:pl-[122px]">
                <p className="max-w-[620px] text-[16px] leading-[1.65] text-ink-soft">
                  {f.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
