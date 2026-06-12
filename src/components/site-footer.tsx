import Link from "next/link";
import {
  PhoneCallIcon,
  EnvelopeSimpleIcon,
  MapPinLineIcon,
  ClockIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { mainNav } from "@/lib/site";
import { getProgrammes, getSite } from "@/lib/content";

export async function SiteFooter() {
  const year = 2026;
  const [programmes, site] = await Promise.all([getProgrammes(), getSite()]);

  return (
    <footer className="mt-auto bg-forest-950 text-paper">
      {/* Call-to-action band */}
      <Container className="border-b border-paper/10 py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="label-mono text-safety-400">Ready when you are</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-paper sm:text-5xl">
              Train your drivers and operators to a standard you can certify.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-3 bg-safety-500 px-7 py-4 font-mono text-[0.78rem] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-safety-400"
          >
            Book a programme
            <ArrowUpRightIcon weight="bold" className="size-4" />
          </Link>
        </div>
      </Container>

      {/* Main footer */}
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-tight text-paper">
            SierraZim
          </p>
          <p className="label-mono mt-1 text-paper/60">Training Academy</p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/70">
            {site.legalName} — {site.tagline.toLowerCase()}. Defensive driving,
            heavy-vehicle, surface mobile equipment and agriculture operator
            training, assessment and certification.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="label-mono text-paper/50">Explore</p>
          <ul className="mt-5 space-y-3">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-paper/80 transition-colors hover:text-safety-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/sectors"
                className="text-sm text-paper/80 transition-colors hover:text-safety-400"
              >
                Sectors
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Programmes">
          <p className="label-mono text-paper/50">Programmes</p>
          <ul className="mt-5 space-y-3">
            {programmes.slice(0, 5).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-sm text-paper/80 transition-colors hover:text-safety-400"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="label-mono text-paper/50">Contact</p>
          <ul className="mt-5 space-y-4 text-sm text-paper/80">
            <li className="flex items-start gap-3">
              <MapPinLineIcon weight="bold" className="mt-0.5 size-4 shrink-0 text-safety-400" />
              <span>{site.address.full}</span>
            </li>
            {site.phones.map((p, i) => (
              <li key={p} className="flex items-center gap-3">
                <PhoneCallIcon weight="bold" className="size-4 shrink-0 text-safety-400" />
                <a href={`tel:${site.phonesE164[i]}`} className="hover:text-safety-400">
                  {p}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3">
              <EnvelopeSimpleIcon weight="bold" className="size-4 shrink-0 text-safety-400" />
              <a href={`mailto:${site.email}`} className="hover:text-safety-400">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <ClockIcon weight="bold" className="mt-0.5 size-4 shrink-0 text-safety-400" />
              <span>{site.hours}</span>
            </li>
          </ul>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-paper/10">
        <Container className="flex flex-col gap-3 py-6 text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono">
            © {year} {site.legalName}
          </p>
          <p className="label-mono">{site.tagline}</p>
        </Container>
      </div>
    </footer>
  );
}
