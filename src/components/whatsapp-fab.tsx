import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";

/** Floating WhatsApp button — WhatsApp is the dominant channel in Sierra Leone,
 *  so keep a prefilled chat one tap away on every page. Squared amber to match
 *  the v2 "safety-yard" road-signage language. */
export function WhatsAppFab({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SierraZim on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 bg-safety-500 px-4 py-3.5 font-display text-base font-extrabold uppercase tracking-[0.06em] text-ink shadow-lg ring-1 ring-black/10 transition-colors hover:bg-safety-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 sm:px-5"
    >
      <WhatsappLogoIcon weight="fill" className="size-6" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
