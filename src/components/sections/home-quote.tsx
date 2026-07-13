import { QuotesIcon } from "@phosphor-icons/react/dist/ssr";

/**
 * Mission quote — an amber quote-mark tile beside a large condensed statement
 * and a mono partners line. Copy comes from the Home global (statement fields).
 */
export function HomeQuote({
  quote,
  partnersLabel,
  partners,
}: {
  quote: string;
  partnersLabel: string;
  partners: string[];
}) {
  if (!quote) return null;
  return (
    <section className="border-t border-line-strong bg-paper text-ink">
      <div className="mx-auto grid w-full max-w-[90rem] grid-cols-[auto_1fr] gap-8 px-6 py-[104px] sm:gap-12 sm:px-14">
        <span
          aria-hidden
          className="flex size-14 items-center justify-center bg-safety-500 sm:size-18"
        >
          <QuotesIcon weight="fill" className="size-7 text-ink sm:size-9" />
        </span>
        <div>
          <p className="max-w-[920px] font-display text-fluid-quote font-bold leading-[1.05]">
            {quote}
          </p>
          {partners.length > 0 && (
            <p className="mt-7 font-mono text-[11.5px] uppercase tracking-[0.2em] text-safety-600">
              {partnersLabel} {partners.join(" · ")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
