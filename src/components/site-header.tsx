"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ListIcon,
  XIcon,
  ArrowRightIcon,
  PhoneCallIcon,
  EnvelopeSimpleIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { mainNav } from "@/lib/site";
import type { SiteSettings } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * v2 "safety-yard" header — dark forest bar, condensed uppercase nav, and a
 * full-height amber CTA block on the right that swaps to the phone number on the
 * Contact page. Collapses to a full-screen dark menu below `lg`.
 */
export function SiteHeader({ site }: { site: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isContact = pathname === "/contact";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-forest-950 text-white shadow-[0_16px_30px_-20px_#000000cc]">
      <div className="flex h-[72px] items-stretch justify-between">
        {/* Logo */}
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="flex items-center gap-3.5 px-6 sm:px-7"
        >
          <Image
            src="/brand/logo.png"
            alt=""
            width={51}
            height={42}
            priority
            className="h-[42px] w-auto"
          />
          <span className="font-display text-[26px] font-extrabold uppercase leading-none tracking-[0.02em]">
            SierraZim
          </span>
        </Link>

        {/* Center nav */}
        <nav
          className="hidden items-center gap-9 px-6 lg:flex"
          aria-label="Primary"
        >
          {mainNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "font-display text-[17px] uppercase tracking-[0.08em] transition-colors",
                  active
                    ? "font-bold text-safety-400"
                    : "font-semibold text-white/75 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: amber CTA (→ phone on Contact) + mobile toggle */}
        <div className="flex items-stretch">
          {isContact ? (
            <a
              href={`tel:${site.phonesE164[0]}`}
              className="hidden items-center gap-2.5 bg-safety-500 px-8 font-display text-[18px] font-extrabold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-safety-400 sm:flex"
            >
              <PhoneCallIcon weight="fill" className="size-[18px]" />
              {site.phones[0]}
            </a>
          ) : (
            <Link
              href="/contact"
              className="hidden items-center gap-2.5 bg-safety-500 px-8 font-display text-[18px] font-extrabold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-safety-400 sm:flex"
            >
              Enrol now
              <ArrowRightIcon weight="bold" className="size-4" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex w-[72px] items-center justify-center border-l border-white/15 text-white lg:hidden"
          >
            {open ? (
              <XIcon weight="bold" className="size-6" />
            ) : (
              <ListIcon weight="bold" className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      {open && (
        <div className="fixed inset-0 top-[72px] z-40 flex flex-col overflow-y-auto bg-forest-950 lg:hidden">
          <nav className="flex flex-col px-6 py-4" aria-label="Mobile">
            {mainNav.map((item, i) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-5 border-b border-white/12 py-5"
                >
                  <span className="font-mono text-xs tracking-[0.2em] text-safety-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-display text-4xl font-extrabold uppercase tracking-[0.01em]",
                      active ? "text-safety-400" : "text-white",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto flex flex-col gap-4 px-6 pb-8 pt-6">
            <div className="flex flex-col gap-3 font-mono text-sm text-white/80">
              <a
                href={`tel:${site.phonesE164[0]}`}
                className="flex items-center gap-3 hover:text-safety-400"
              >
                <PhoneCallIcon weight="fill" className="size-4 text-safety-400" />
                {site.phones[0]}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 hover:text-safety-400"
              >
                <EnvelopeSimpleIcon weight="bold" className="size-4 text-safety-400" />
                {site.email}
              </a>
              <a
                href={site.whatsappHref}
                rel="noopener"
                className="flex items-center gap-3 hover:text-safety-400"
              >
                <WhatsappLogoIcon weight="fill" className="size-4 text-safety-400" />
                WhatsApp us
              </a>
            </div>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2.5 bg-safety-500 px-6 py-4 font-display text-xl font-extrabold uppercase tracking-[0.06em] text-ink"
            >
              Enrol now
              <ArrowRightIcon weight="bold" className="size-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
