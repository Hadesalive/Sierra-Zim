import Image from "next/image";
import Link from "next/link";
import {
  PhoneCallIcon,
  EnvelopeSimpleIcon,
  MapPinLineIcon,
  ClockIcon,
} from "@phosphor-icons/react/dist/ssr";
import { mainNav } from "@/lib/site";
import { getProgrammes, getSite } from "@/lib/content";

/**
 * v2 "safety-yard" footer — dark forest columns and a mono bottom bar. The big
 * amber call-to-action now lives as its own page section (CtaBand), so the
 * footer is chrome only.
 */
export async function SiteFooter() {
  // Async server component — evaluated on the server when the layout renders,
  // so this never ships a client/server clock mismatch. (Routes are prerendered
  // at build, so the copyright year refreshes with each deploy.)
  const year = new Date().getFullYear();
  const [programmes, site] = await Promise.all([getProgrammes(), getSite()]);

  return (
    <footer className="mt-auto bg-forest-950 text-white">
      <div className="mx-auto w-full max-w-[90rem] px-6 pt-20 sm:px-14">
        <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3.5">
              <Image
                src="/brand/logo.png"
                alt=""
                width={58}
                height={48}
                className="h-12 w-auto"
              />
              <span className="font-display text-[28px] font-extrabold uppercase leading-[0.95]">
                SierraZim
                <br />
                <span className="text-sm font-semibold tracking-[0.18em] text-white/60">
                  Training Academy
                </span>
              </span>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/70">
              {site.legalName} — driver and operator training, assessment and
              certification. {site.address.full}.
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-safety-400">
              Explore
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-display text-[19px] font-semibold uppercase tracking-[0.05em] text-white/85 transition-colors hover:text-safety-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Programmes */}
          <nav aria-label="Programmes">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-safety-400">
              Training
            </p>
            <ul className="mt-5 flex flex-col gap-2.5 text-sm">
              {programmes.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/services/${p.slug}`}
                    className="text-white/80 transition-colors hover:text-safety-400"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-safety-400">
              Contact
            </p>
            <ul className="mt-5 flex flex-col gap-3.5 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPinLineIcon
                  weight="bold"
                  className="mt-0.5 size-4 shrink-0 text-safety-400"
                />
                <span>{site.address.full}</span>
              </li>
              {site.phones.map((p, i) => (
                <li key={p} className="flex items-center gap-3">
                  <PhoneCallIcon
                    weight="bold"
                    className="size-4 shrink-0 text-safety-400"
                  />
                  <a
                    href={`tel:${site.phonesE164[i]}`}
                    className="hover:text-safety-400"
                  >
                    {p}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <EnvelopeSimpleIcon
                  weight="bold"
                  className="size-4 shrink-0 text-safety-400"
                />
                <a href={`mailto:${site.email}`} className="hover:text-safety-400">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon
                  weight="bold"
                  className="mt-0.5 size-4 shrink-0 text-safety-400"
                />
                <span>{site.hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/15">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-2 px-6 py-5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-14">
          <p>
            © {year} {site.legalName}
          </p>
          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
