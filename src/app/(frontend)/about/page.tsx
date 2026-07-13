import type { Metadata } from "next";
import { ogBase } from "@/lib/metadata";
import Image from "next/image";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { getClients, getSite, getProgrammes, getAboutPage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  return {
    title: "About",
    description: about.metaDescription,
    alternates: { canonical: "/about" },
    openGraph: {
      ...ogBase("/about"),
      title: "About · SierraZim",
      images: about.heroImage
        ? [{ url: about.heroImage, alt: "SierraZim Training Academy" }]
        : undefined,
    },
  };
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const SHELL = "mx-auto w-full max-w-[90rem] px-6 sm:px-14";

export default async function AboutPage() {
  const [clients, site, programmes, about] = await Promise.all([
    getClients(),
    getSite(),
    getProgrammes(),
    getAboutPage(),
  ]);

  const stats = [
    { value: String(programmes.length).padStart(2, "0"), label: "programmes" },
    { value: "03", label: "countries" },
    { value: `${String(clients.length).padStart(2, "0")}+`, label: "clients & partners" },
  ];

  return (
    <>
      <PageHero
        eyebrow={about.heroEyebrow || "About Sierrazim Limited"}
        title={
          <>
            Sierra Leone roots.
            <br />
            <span className="stroke-white">Zimbabwean</span>
            <br />
            <span className="text-safety-400">Training standards.</span>
          </>
        }
        intro={about.heroIntro}
        image={about.heroImage || "/gallery/ceo-onsite-equipment.jpg"}
        imageAlt="SierraZim leadership on site with heavy equipment"
        captionLeft="On site with our clients"
        captionRight={`${site.address.city} HQ`}
      />

      {/* Story */}
      <section className="bg-paper text-ink">
        <div className={`${SHELL} py-24`}>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.24em] text-safety-600">
                {about.storyEyebrow || "Our story"}
              </p>
              <h2 className="font-display text-[clamp(40px,4.6vw,76px)] font-extrabold uppercase leading-[0.9]">
                {about.storyHeading}
              </h2>
              {about.storyImage && (
                <div className="relative mt-9 aspect-4/3 overflow-hidden border-[3px] border-ink">
                  <Image
                    src={about.storyImage}
                    alt="SierraZim instructor delivering training in the field"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center gap-6">
              {about.storyBlocks.map((b, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-[19px] leading-[1.65] text-ink"
                      : "text-[17px] leading-[1.65] text-ink-soft"
                  }
                >
                  {b}
                </p>
              ))}
              <dl className="flex flex-wrap gap-x-10 gap-y-3 border-t-2 border-dashed border-line-strong pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                {stats.map((s) => (
                  <div key={s.label} className="flex gap-2">
                    <dt className="text-safety-600">{s.value}</dt>
                    <dd>{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="border-t border-line-strong bg-paper-2 text-ink">
        <div className={`${SHELL} py-24`}>
          <div className="mb-12 flex flex-wrap items-baseline gap-x-6 gap-y-3">
            <h2 className="font-display text-[clamp(40px,4.6vw,76px)] font-extrabold uppercase leading-[0.9]">
              {about.leadershipHeading || "Leadership"}
            </h2>
            <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-safety-600">
              {about.leadershipEyebrow || "The people behind the academy"}
            </p>
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            {site.leadership.map((person) => (
              <div
                key={person.name}
                className="flex items-center gap-7 bg-forest-950 px-8 py-9 text-white sm:px-10"
              >
                <span className="relative flex size-[84px] shrink-0 items-center justify-center overflow-hidden bg-safety-500 font-display text-[34px] font-extrabold text-ink">
                  {person.photo ? (
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      sizes="84px"
                      className="object-cover"
                    />
                  ) : (
                    initials(person.name)
                  )}
                </span>
                <div>
                  <p className="font-display text-[34px] font-extrabold uppercase leading-none tracking-[0.02em]">
                    {person.name}
                  </p>
                  <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-safety-400">
                    {person.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where we work */}
      <section className="bg-forest-950 text-white">
        <div aria-hidden className="hazard h-3.5" />
        <div className={`${SHELL} py-24`}>
          <div className="mb-14 flex flex-wrap items-baseline gap-x-6 gap-y-3">
            <h2 className="font-display text-[clamp(40px,4.6vw,76px)] font-extrabold uppercase leading-[0.9]">
              On the ground,
              <br />
              <span className="stroke-white-thin">across borders.</span>
            </h2>
            <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-safety-400">
              {about.locationsEyebrow || "Where we work"}
            </p>
          </div>
          <div className="border-t border-white/25">
            {about.locations.map((loc, i) => (
              <div
                key={loc.place}
                className="grid grid-cols-[52px_1fr] items-center gap-5 border-b border-white/15 py-5 sm:grid-cols-[80px_minmax(200px,0.7fr)_1fr] sm:gap-8"
              >
                <span className="font-mono text-[12px] tracking-[0.2em] text-safety-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[28px] font-extrabold uppercase leading-none tracking-[0.02em] sm:text-[34px]">
                  {loc.place}
                </span>
                <span className="col-span-2 font-mono text-[11.5px] uppercase tracking-[0.18em] text-white/65 sm:col-span-1">
                  {loc.note}
                </span>
              </div>
            ))}
          </div>

          {clients.length > 0 && (
            <div className="mt-18">
              <p className="mb-6 font-mono text-[12px] uppercase tracking-[0.24em] text-safety-400">
                {about.clientsHeading || "Clients & partners"}
              </p>
              <div className="grid gap-px border border-white/20 bg-white/20 sm:grid-cols-2 lg:grid-cols-4">
                {clients.map((c) => (
                  <div key={c.name} className="bg-forest-950 px-6 py-6">
                    <p className="font-display text-[23px] font-bold uppercase tracking-[0.03em]">
                      {c.name}
                    </p>
                    {c.note && (
                      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                        {c.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBand site={site} />
    </>
  );
}
