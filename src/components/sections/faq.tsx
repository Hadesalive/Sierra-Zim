import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";

type FaqItem = { q: string; a: string };

export function Faq({
  tone = "white",
  faqs,
}: {
  tone?: "white" | "tint";
  faqs: FaqItem[];
}) {
  return (
    <section
      aria-labelledby="faq-heading"
      className={tone === "tint" ? "border-y border-line bg-paper-2" : "bg-paper"}
    >
      <Container className="py-16 lg:py-24">
        <p className="label-mono text-safety-600">FAQ</p>
        <h2
          id="faq-heading"
          className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl"
        >
          Questions employers ask us.
        </h2>

        <div className="mt-12 border-t border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-lg font-bold text-ink sm:text-xl">
                  {f.q}
                </span>
                <span className="mt-1 shrink-0 text-safety-600 transition-transform duration-200 group-open:rotate-45">
                  <PlusIcon weight="bold" className="size-5" />
                </span>
              </summary>
              <p className="max-w-2xl pb-7 leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
