import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";

/** Floating WhatsApp button — WhatsApp is the dominant channel in Sierra Leone,
 *  so keep a prefilled chat one tap away on every page. */
export function WhatsAppFab({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SierraZim on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 sm:px-5"
    >
      <WhatsappLogoIcon weight="fill" className="size-6" />
      <span className="hidden text-sm sm:inline">WhatsApp us</span>
    </a>
  );
}
