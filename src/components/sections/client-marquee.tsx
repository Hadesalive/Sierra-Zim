import { Container } from "@/components/ui/container";
import { clients } from "@/lib/site";

/**
 * "Who we train for" — a static, honest strip of real client names (no infinite
 * marquee). The names are the proof; the sector note adds specificity.
 */
export function ClientMarquee() {
  return (
    <section
      aria-label="Organisations we have trained for"
      className="border-b border-line bg-forest-950 text-paper"
    >
      <Container className="flex flex-col gap-5 py-7 lg:flex-row lg:items-center lg:gap-10">
        <span className="label-mono shrink-0 text-paper/55">Who we train for</span>
        <ul className="flex flex-wrap items-baseline gap-x-7 gap-y-3">
          {clients.map((c) => (
            <li key={c.name} className="flex items-baseline gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-paper/90">
                {c.name}
              </span>
              {c.note && (
                <span className="label-mono text-[0.6rem] text-safety-400/90">
                  {c.note}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
