import Link from "next/link";
import {
  ArrowRightIcon,
  PhoneCallIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { SiteSettings } from "@/lib/content";

/**
 * Closing CTA band — a full amber field topped with an ink hazard stripe, a big
 * condensed headline and up to two square actions. Defaults match the home page;
 * other pages pass their own headline / actions.
 */
export function CtaBand({
  site,
  titleTop = "Get your fleet",
  titleBottom = "certified.",
  intro,
  primaryLabel = "Book a programme",
  primaryHref = "/contact",
  secondary = "phone",
}: {
  site: SiteSettings;
  titleTop?: string;
  titleBottom?: string;
  intro?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondary?: "phone" | "whatsapp" | "none";
}) {
  return (
    <section className="relative overflow-hidden bg-safety-500 text-ink">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-3.5"
        style={{
          background:
            "repeating-linear-gradient(-45deg, #14201a 0 18px, #f0c000 18px 36px)",
        }}
      />
      <div className="mx-auto flex w-full max-w-[90rem] flex-wrap items-center justify-between gap-10 px-6 py-24 sm:px-14">
        <div>
          <h2 className="font-display text-[clamp(48px,6vw,104px)] font-extrabold uppercase leading-[0.88]">
            {titleTop}
            <br />
            {titleBottom}
          </h2>
          {intro && (
            <p className="mt-6 max-w-[480px] text-[17px] leading-[1.6] text-ink/75">
              {intro}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3.5">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center gap-3 bg-ink px-10 py-5 font-display text-[22px] font-extrabold uppercase tracking-[0.06em] text-white transition-colors hover:bg-forest-950"
          >
            {primaryLabel}
            <ArrowRightIcon weight="bold" className="size-[18px]" />
          </Link>
          {secondary === "phone" && (
            <a
              href={`tel:${site.phonesE164[0]}`}
              className="inline-flex items-center justify-center gap-3 border-[3px] border-ink px-10 py-[17px] font-display text-[22px] font-extrabold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-ink/[0.08]"
            >
              <PhoneCallIcon weight="fill" className="size-5" />
              {site.phones[0]}
            </a>
          )}
          {secondary === "whatsapp" && (
            <a
              href={site.whatsappHref}
              rel="noopener"
              className="inline-flex items-center justify-center gap-3 border-[3px] border-ink px-10 py-[17px] font-display text-[22px] font-extrabold uppercase tracking-[0.06em] text-ink transition-colors hover:bg-ink/[0.08]"
            >
              <WhatsappLogoIcon weight="fill" className="size-5" />
              WhatsApp us
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
