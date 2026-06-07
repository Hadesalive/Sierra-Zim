import { stats } from "@/lib/site";
import { Container } from "@/components/ui/container";

export function StatsBand() {
  return (
    <section className="bg-forest-950 text-paper">
      <Container className="py-14 lg:py-16">
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={
                "px-2 lg:px-8 " +
                (i !== 0 ? "lg:border-l lg:border-paper/15" : "")
              }
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
