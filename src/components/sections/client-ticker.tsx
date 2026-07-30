import type { ClientItem } from "@/lib/content";

/**
 * "Trained for" ticker — a fixed amber plate and an infinitely scrolling
 * marquee of real client names + sector tags. Pure CSS (duplicated track
 * translated 0 → -50%); pauses on hover and stops under reduced-motion.
 */
export function ClientTicker({
  clients,
  label,
}: {
  clients: ClientItem[];
  /** Home global `clientsLabel`; falls back to the plate's original copy. */
  label?: string;
}) {
  if (clients.length === 0) return null;
  // Duplicate the list so the -50% translate loops seamlessly.
  const track = [...clients, ...clients];

  return (
    <section
      aria-label="Organisations we have trained for"
      className="flex items-center overflow-hidden border-t border-white/15 bg-forest-975"
    >
      <div className="z-[1] shrink-0 bg-safety-500 px-6 py-4 font-display text-base font-extrabold uppercase tracking-[0.1em] text-ink">
        {label || "Trained for"}
      </div>
      <div className="flex-1 overflow-hidden">
        <ul className="ticker-track flex items-center gap-14 px-7 py-4">
          {track.map((c, i) => (
            <li
              key={`${c.slug || c.name}-${i}`}
              aria-hidden={i >= clients.length}
              className="flex items-baseline gap-2.5 whitespace-nowrap"
            >
              <span className="font-display text-[22px] font-bold uppercase tracking-[0.04em] text-white/90">
                {c.name}
              </span>
              {c.note && (
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-safety-400">
                  {c.note}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
