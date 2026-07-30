import type { HomeContent } from "@/lib/content";

/**
 * "The standard" — the four-step certification path rendered as white cells in a
 * 3px ink grout grid, each led by a big amber numeral. Copy comes from the Home
 * global (certPathEyebrow / certPathHeading / certPathIntro / certPathSteps),
 * with the original hardcoded copy as the fallback.
 */
export function TheStandard({
  steps,
  eyebrow,
  heading,
  intro,
}: {
  steps: HomeContent["certPathSteps"];
  eyebrow?: string;
  heading?: string;
  intro?: string;
}) {
  return (
    <section className="border-t border-line-strong bg-paper-2 text-ink">
      <div className="mx-auto w-full max-w-[90rem] px-6 py-[120px] sm:px-14">
        <div className="mb-16">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
            <h2 className="font-display text-fluid-3 font-extrabold uppercase leading-[0.9]">
              {heading || "The standard"}
            </h2>
            <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-safety-600">
              {eyebrow || "No shortcuts — theory and practical, both passed"}
            </p>
          </div>
          {intro && (
            <p className="mt-6 max-w-[560px] text-[17px] leading-[1.6] text-ink-soft">
              {intro}
            </p>
          )}
        </div>

        <div className="grid gap-[3px] border-[3px] border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col gap-4.5 bg-paper px-7 pb-10 pt-8"
            >
              <span className="font-display text-[96px] font-extrabold leading-[0.85] text-safety-500">
                {i + 1}
              </span>
              <h3 className="font-display text-[30px] font-extrabold uppercase leading-none tracking-[0.01em]">
                {step.title}
              </h3>
              <p className="text-[15px] leading-[1.6] text-ink-soft">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
