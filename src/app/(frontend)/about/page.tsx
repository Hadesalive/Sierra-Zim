import type { Metadata } from "next";
import Image from "next/image";
import { UserIcon } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { StatsBand } from "@/components/sections/stats-band";
import { WhyUs } from "@/components/sections/why-us";
import { CertificationPath } from "@/components/sections/certification-path";
import { getClients, getSite, getPages } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const pages = await getPages();
  return {
    title: "About",
    description: pages.about.metaDescription,
    alternates: { canonical: "/about" },
    openGraph: {
      title: "About · SierraZim",
      images: [
        {
          url: "/gallery/heavy-truck-side.jpg",
          alt: "A heavy haulage truck on a SierraZim field training ground",
        },
      ],
    },
  };
}

export default async function AboutPage() {
  const [clients, site, pages] = await Promise.all([
    getClients(),
    getSite(),
    getPages(),
  ]);
  const about = pages.about;
  return (
    <>
      <PageHeader
        index="01"
        eyebrow={about.heroEyebrow}
        title={
          <>
            {about.heroTitleLine1}
            <br />
            {about.heroTitleLine2}
          </>
        }
        intro={about.heroIntro}
        image="/gallery/heavy-truck-side.jpg"
        imageAlt="Heavy haulage truck on a SierraZim field training ground"
      />

      {/* Story */}
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24">
        <div>
          <Eyebrow index="02">{about.storyEyebrow}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-[2.75rem]">
            {about.storyHeading}
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
            {about.storyBlocks.map((b, i) => (
              <p key={i}>{b}</p>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] border border-ink/15">
            <Image
              src="/gallery/ceo-onsite-equipment.jpg"
              alt="SierraZim team on site with a client at a processing plant"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-ink/80 px-4 py-2.5">
              <span className="label-mono text-paper">{about.storyImageCaption}</span>
            </div>
          </div>
        </div>
      </Container>

      <StatsBand />

      {/* Leadership */}
      <section className="border-y border-line bg-paper-2">
        <Container className="py-16 lg:py-24">
          <Eyebrow index="03">{about.leadershipEyebrow}</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl">
            {about.leadershipHeading}
          </h2>
          <div className="mt-12 grid border-t border-l border-line sm:grid-cols-2">
            {site.leadership.map((person) => (
              <div
                key={person.name}
                className="flex items-center gap-5 border-b border-r border-line bg-paper p-8"
              >
                <div className="flex size-16 shrink-0 items-center justify-center bg-forest-800 text-paper">
                  <UserIcon weight="light" className="size-8" />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-ink">
                    {person.name}
                  </p>
                  <p className="label-mono mt-1 text-safety-600">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Where we work */}
      <Container className="py-16 lg:py-24">
        <Eyebrow index="04">{about.locationsEyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl">
          {about.locationsHeading}
        </h2>
        <div className="mt-12 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
          {about.locations.map((loc, i) => (
            <div
              key={loc.place}
              className="border-b border-r border-line bg-paper p-7"
            >
              <span className="label-mono text-safety-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-6 font-display text-2xl font-bold text-ink">
                {loc.place}
              </p>
              <p className="mt-2 text-sm text-ink-soft">{loc.note}</p>
            </div>
          ))}
        </div>

        {/* Clients */}
        <div className="mt-16">
          <Eyebrow>{about.clientsHeading}</Eyebrow>
          <div className="mt-8 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
            {clients.map((c) => (
              <div
                key={c.name}
                className="border-b border-r border-line bg-paper px-6 py-7"
              >
                <p className="font-display text-lg font-bold tracking-tight text-ink">
                  {c.name}
                </p>
                {c.note && (
                  <p className="label-mono mt-1.5 text-ink-soft">{c.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>

      <WhyUs tone="tint" />
      <CertificationPath tone="white" />
    </>
  );
}
