import { QuotesIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { getHome } from "@/lib/content";

export async function StatementBand() {
  const home = await getHome();
  return (
    <section className="relative overflow-hidden bg-forest-950 text-paper">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" aria-hidden />
      <Container className="relative py-20 lg:py-28">
        <QuotesIcon weight="fill" className="size-12 text-safety-400" aria-hidden />
        <p className="mt-6 max-w-4xl font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-paper sm:text-4xl lg:text-[3.25rem]">
          {home.statementQuote}
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-paper/15 pt-8">
          <span className="label-mono text-paper/50">{home.statementPartnersLabel}</span>
          {home.statementPartners.map((p) => (
            <span
              key={p}
              className="font-display text-lg font-bold tracking-tight text-paper/90"
            >
              {p}
            </span>
          ))}
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-y-10 border-t border-paper/15 pt-12 lg:grid-cols-4">
          {home.stats.map((s, i) => (
            <div
              key={s.label}
              className={i !== 0 ? "lg:border-l lg:border-paper/15 lg:pl-8" : "lg:pr-8"}
            >
              <dt className="font-display text-5xl font-extrabold tracking-tight text-safety-400 lg:text-6xl">
                {s.value}
              </dt>
              <dd className="label-mono mt-3 text-paper/70">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
