"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ListIcon,
  XIcon,
  PhoneCallIcon,
  ClockIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { mainNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility strip */}
      <div className="hidden bg-forest-900 text-paper/85 md:block">
        <Container className="flex h-9 items-center justify-between">
          <div className="label-mono flex items-center gap-6">
            <a
              href={`tel:${site.phonesE164[0]}`}
              className="flex items-center gap-2 hover:text-safety-400"
            >
              <PhoneCallIcon weight="bold" className="size-3.5 text-safety-400" />
              {site.phones[0]}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-2 hover:text-safety-400"
            >
              <EnvelopeSimpleIcon weight="bold" className="size-3.5 text-safety-400" />
              {site.email}
            </a>
          </div>
          <div className="label-mono flex items-center gap-2 text-paper/70">
            <ClockIcon weight="bold" className="size-3.5 text-safety-400" />
            {site.hours}
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "border-b border-line bg-paper/90 backdrop-blur transition-shadow",
          scrolled && "shadow-[0_1px_0_0_var(--color-line-strong)]",
        )}
      >
        <Container className="flex h-[68px] items-center justify-between gap-4">
          <Logo />

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "label-mono relative py-1 text-ink-soft transition-colors hover:text-ink",
                  isActive(item.href) && "text-ink",
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-safety-500" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="hidden bg-forest-800 px-5 py-2.5 font-mono text-[0.74rem] uppercase tracking-[0.16em] text-paper transition-colors hover:bg-forest-700 lg:inline-block"
            >
              Enrol Now
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex size-11 items-center justify-center border border-line text-ink lg:hidden"
            >
              {open ? (
                <XIcon weight="bold" className="size-5" />
              ) : (
                <ListIcon weight="bold" className="size-5" />
              )}
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 top-[68px] z-40 overflow-y-auto bg-paper lg:hidden">
          <Container className="py-8">
            <nav className="flex flex-col" aria-label="Mobile">
              {mainNav.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 border-b border-line py-5"
                >
                  <span className="label-mono text-safety-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-3xl font-bold text-ink">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-3">
              <a
                href={`tel:${site.phonesE164[0]}`}
                className="flex items-center gap-3 font-mono text-sm text-ink"
              >
                <PhoneCallIcon weight="bold" className="size-4 text-safety-600" />
                {site.phones[0]}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 font-mono text-sm text-ink"
              >
                <EnvelopeSimpleIcon weight="bold" className="size-4 text-safety-600" />
                {site.email}
              </a>
            </div>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-8 inline-block w-full bg-safety-500 px-5 py-4 text-center font-mono text-sm uppercase tracking-[0.16em] text-ink"
            >
              Enrol Now
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
