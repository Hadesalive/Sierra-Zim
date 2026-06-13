import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  SealCheckIcon,
  PhoneCallIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { getHome, getSite } from "@/lib/content";

export async function Hero() {
  const [home, site] = await Promise.all([getHome(), getSite()]);
  return (
    <section className="relative overflow-hidden bg-paper pt-14 pb-10 sm:pt-20 lg:pt-24 lg:pb-16">
      {/* subtle dot texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, #0a6322 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — copy */}
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-semibold text-ink/70">
              <span className="text-forest-700">{home.heroEyebrowAccent}</span>{" "}
              {home.heroEyebrowRest}
            </p>

            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[4.4rem]">
              {home.heroTitleLine1}
              <br />
              <span className="text-forest-700">{home.heroTitleAccent}</span>{" "}
              {home.heroTitleLine2}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg md:text-xl">
              {home.heroSubhead}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-forest-800 px-7 py-3.5 text-base font-semibold text-paper shadow-sm transition-all duration-200 hover:bg-forest-700 hover:shadow-lg"
              >
                Enrol your team
                <ArrowRightIcon
                  weight="bold"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/15 px-7 py-3.5 text-base font-semibold text-ink transition-all duration-200 hover:border-ink/30 hover:bg-ink/4"
              >
                Explore programmes
              </Link>
            </div>

            <div className="mt-7">
              <p className="mb-2.5 text-xs font-medium uppercase tracking-widest text-ink/40">
                Running a fleet?
              </p>
              <div className="flex items-center gap-4">
                <a
                  href={`tel:${site.phonesE164[0]}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 transition-colors hover:text-forest-600"
                >
                  <PhoneCallIcon weight="fill" className="size-4" />
                  {site.phones[0]}
                </a>
                <span className="h-4 w-px bg-ink/15" aria-hidden />
                <a
                  href={site.whatsappHref}
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/70 transition-colors hover:text-forest-700"
                >
                  <WhatsappLogoIcon weight="fill" className="size-4" />
                  WhatsApp us
                </a>
              </div>
            </div>
          </div>

          {/* Right — image card */}
          <div className="relative mt-2 lg:mt-0 lg:pl-6">
            <div
              className="absolute inset-0 scale-110 rounded-3xl bg-forest-600/10 blur-3xl"
              aria-hidden
            />
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={home.heroImage || "/gallery/instructor-truck-course.jpg"}
                alt="SierraZim instructor leading a heavy-vehicle defensive driving course on a field training ground"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent" />
            </div>

            {/* floating credential card */}
            <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-xl border border-line bg-paper/95 px-4 py-3 shadow-xl backdrop-blur sm:-left-5">
              <span className="flex size-10 items-center justify-center rounded-lg bg-safety-500/15 text-safety-600">
                <SealCheckIcon weight="fill" className="size-6" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-ink">{home.heroPillTitle}</p>
                <p className="text-xs text-ink/60">{home.heroPillSubtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
