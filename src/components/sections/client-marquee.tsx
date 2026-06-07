import { AsteriskIcon } from "@phosphor-icons/react/dist/ssr";
import { clients } from "@/lib/site";

export function ClientMarquee() {
  const row = [...clients, ...clients];

  return (
    <section
      aria-label="Organisations we have trained for"
      className="border-b border-line bg-forest-950 py-5 text-paper"
    >
      <div className="flex items-center gap-6">
        <span className="label-mono shrink-0 pl-5 text-paper/50 sm:pl-8 lg:pl-12">
          Trusted on the ground by
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-10 motion-reduce:animate-none">
            {row.map((c, i) => (
              <span key={i} className="flex shrink-0 items-center gap-10">
                <span className="font-display text-lg font-bold tracking-tight text-paper/90">
                  {c.name}
                </span>
                <AsteriskIcon weight="bold" className="size-3.5 text-safety-400" />
              </span>
            ))}
          </div>
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-forest-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-forest-950 to-transparent" />
        </div>
      </div>
    </section>
  );
}
