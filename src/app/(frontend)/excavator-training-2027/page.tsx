import type { Metadata } from "next";
import {
  CalendarBlankIcon,
  UsersThreeIcon,
  CheckIcon,
  WhatsappLogoIcon,
  PhoneCallIcon,
  EnvelopeSimpleIcon,
  MapPinLineIcon,
  ArrowUpRightIcon,
  InfoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { JsonLd } from "@/components/json-ld";
import { ogBase } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import { getSite } from "@/lib/content";

/**
 * Campaign landing page for the 2027 Excavator Operator Training intake.
 * The URL is printed as a QR code on the GIF/flyer advert — do not rename
 * this route. Copy mirrors "Sierrazim Excavator Training Opening 2027 Advert".
 */

const PATH = "/excavator-training-2027";
const TITLE = "Excavator Operator Training Programme 2027";
const HERO_IMAGE =
  "https://3aftwwyeuptofh2b.public.blob.vercel-storage.com/surface-mobile-equipment-training-06.jpg";
const HERO_ALT =
  "Trainee operating a Volvo tracked excavator from the cab on a red-earth worksite";
const DESCRIPTION =
  "Enrolment open for SierraZim's 2027 Excavator Operator Training in Makeni, Sierra Leone. Two batches — 11–31 January and 8–28 February 2027 — 20 candidates each. US$800 or Le 20,000 per person.";

const BATCHES = [
  { name: "First batch", dates: "11 January – 31 January 2027", start: "2027-01-11", end: "2027-01-31" },
  { name: "Second batch", dates: "8 February – 28 February 2027", start: "2027-02-08", end: "2027-02-28" },
];

const INCLUDES = [
  "Excavator controls and operating principles",
  "Pre-start inspection and machine checks",
  "Safe excavator operation",
  "Excavation and trenching techniques",
  "Loading and material handling",
  "Backfilling and site preparation",
  "Workplace and site safety",
  "Hazard identification and risk awareness",
  "Basic machine care and daily maintenance",
  "Practical excavator operation",
  "Competency assessment",
  "Training completion and certification",
];

const WHO = [
  "Beginners interested in becoming excavator operators",
  "Existing operators seeking skills improvement",
  "Construction workers",
  "Mining and quarry workers",
  "Young people seeking employment opportunities",
  "Anyone interested in a career in heavy equipment operation",
];

function waLink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: PATH },
    openGraph: {
      ...ogBase(PATH),
      title: `${TITLE} · ${site.shortName}`,
      description: DESCRIPTION,
      images: [{ url: HERO_IMAGE, alt: HERO_ALT }],
    },
  };
}

export default async function ExcavatorTraining2027Page() {
  const site = await getSite();
  const applyText = (batch?: string) =>
    `Hello SierraZim, I'd like to apply for the 2027 Excavator Operator Training Programme${
      batch ? ` (${batch}: ${BATCHES.find((b) => b.name === batch)?.dates})` : ""
    }.`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: TITLE,
          description: DESCRIPTION,
          url: `${SITE_URL}${PATH}`,
          provider: { "@type": "Organization", name: site.name, sameAs: SITE_URL },
          hasCourseInstance: BATCHES.map((b) => ({
            "@type": "CourseInstance",
            name: b.name,
            courseMode: "onsite",
            startDate: b.start,
            endDate: b.end,
            location: {
              "@type": "Place",
              name: site.name,
              address: site.address.full,
            },
            offers: {
              "@type": "Offer",
              price: "800",
              priceCurrency: "USD",
              availability: "https://schema.org/LimitedAvailability",
            },
          })),
        }}
      />

      <PageHero
        eyebrow="Enrolment now open — limited spaces"
        title={
          <>
            Excavator
            <br />
            operator
            <br />
            <span className="text-safety-400">training 2027.</span>
          </>
        }
        intro="Do you want to become a competent and professional excavator operator? We're accepting applications for practical and theoretical training for people seeking work in the mining, construction, agriculture and earthmoving industries."
        image={HERO_IMAGE}
        imageAlt={HERO_ALT}
        captionLeft={`${site.address.city}, Sierra Leone`}
        captionRight="20 candidates per batch"
      />

      {/* Batches + apply */}
      <section className="bg-paper text-ink">
        <Container className="py-16 lg:py-24">
          <Eyebrow index="01">Two training batches</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl">
            Pick your batch.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {BATCHES.map((b) => (
              <div key={b.name} className="flex flex-col border-[3px] border-ink bg-paper">
                <div className="flex items-center gap-3 bg-forest-950 px-6 py-4 text-paper">
                  <CalendarBlankIcon weight="bold" className="size-5 text-safety-400" />
                  <span className="label-mono">{b.name}</span>
                </div>
                <div className="flex flex-1 flex-col gap-5 p-6">
                  <p className="font-display text-3xl font-extrabold uppercase leading-none">
                    {b.dates}
                  </p>
                  <p className="flex items-center gap-2 text-ink-soft">
                    <UsersThreeIcon weight="fill" className="size-5 text-safety-600" />
                    <span className="font-semibold text-ink">20 candidates only</span>
                  </p>
                  <a
                    href={waLink(site.whatsapp, applyText(b.name))}
                    rel="noopener"
                    className="mt-auto flex items-center justify-center gap-2 bg-safety-500 px-5 py-3.5 font-mono text-[0.78rem] uppercase tracking-[0.16em] text-ink transition-colors hover:bg-safety-400"
                  >
                    <WhatsappLogoIcon weight="fill" className="size-5" />
                    Apply for {b.name.toLowerCase()}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Fees */}
      <section className="bg-forest-950 text-paper">
        <div aria-hidden className="hazard h-3.5" />
        <Container className="grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-24">
          <div>
            <Eyebrow index="02" tone="paper">Fees</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl">
              Training &amp; <span className="text-safety-400">certification.</span>
            </h2>
            <p className="mt-6 flex items-start gap-3 text-paper/80">
              <InfoIcon weight="bold" className="mt-0.5 size-5 shrink-0 text-safety-400" />
              The application fee is payable at registration.
            </p>
          </div>

          <dl className="border-t border-paper/20">
            <div className="flex items-baseline justify-between gap-6 border-b border-paper/20 py-5">
              <dt className="label-mono text-paper/70">Application form</dt>
              <dd className="font-display text-2xl font-extrabold">Le 600</dd>
            </div>
            <div className="flex items-baseline justify-between gap-6 border-b border-paper/20 py-5">
              <dt className="label-mono text-paper/70">Student ID</dt>
              <dd className="text-right font-semibold">Included in registration</dd>
            </div>
            <div className="py-5">
              <dt className="label-mono text-paper/70">Training &amp; certification</dt>
              <dd className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <span className="bg-safety-500 px-4 py-4 text-center text-ink">
                  <span className="block font-display text-3xl font-extrabold leading-none sm:text-4xl">
                    US$800
                  </span>
                  <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.16em]">
                    per person
                  </span>
                </span>
                <span className="label-mono text-paper/70">or</span>
                <span className="bg-safety-500 px-4 py-4 text-center text-ink">
                  <span className="block font-display text-3xl font-extrabold leading-none sm:text-4xl">
                    Le 20,000
                  </span>
                  <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.16em]">
                    per person
                  </span>
                </span>
              </dd>
            </div>
          </dl>
        </Container>
      </section>

      {/* Includes + who */}
      <section className="bg-paper text-ink">
        <Container className="grid gap-14 py-16 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16 lg:py-24">
          <div>
            <Eyebrow index="03">Training includes</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl">
              Theory, practice, certification.
            </h2>
            <ul className="mt-10 grid gap-px border-t border-l border-line sm:grid-cols-2">
              {INCLUDES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-r border-line bg-paper p-5"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center bg-safety-500 text-ink">
                    <CheckIcon weight="bold" className="size-3.5" />
                  </span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:pt-[4.5rem]">
            <div className="border border-line bg-paper-2 p-7">
              <span className="label-mono text-ink">Who can apply?</span>
              <ul className="mt-5 space-y-3.5">
                {WHO.map((w) => (
                  <li key={w} className="flex items-start gap-3 leading-snug">
                    <CheckIcon weight="bold" className="mt-0.5 size-4 shrink-0 text-forest-700" />
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-5 text-sm italic leading-relaxed text-ink-soft">
                Previous excavator operating experience is an advantage but is not
                required for beginners.
              </p>
            </div>
          </aside>
        </Container>
      </section>

      {/* Apply / contact */}
      <section className="border-t border-line bg-paper-2 text-ink">
        <Container className="grid gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div>
            <Eyebrow index="04">Secure your place today</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold uppercase leading-[0.95] sm:text-5xl">
              Apply now —<br />
              <span className="text-safety-600">limited spaces.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              With only 20 candidates per batch, spaces are limited. Message us on
              WhatsApp, call, or email to reserve your place.
            </p>
            <p className="mt-8 flex items-start gap-3 text-ink">
              <MapPinLineIcon weight="bold" className="mt-0.5 size-5 shrink-0 text-safety-600" />
              <span>
                <span className="block font-semibold">Training location</span>
                SierraZim Training Academy, Makeni, Bombali District, Sierra Leone
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={waLink(site.whatsapp, applyText())}
              rel="noopener"
              className="flex items-center gap-4 bg-forest-950 px-6 py-5 text-white transition-colors hover:bg-forest-900"
            >
              <WhatsappLogoIcon weight="fill" className="size-7 shrink-0 text-safety-400" />
              <span className="flex-1">
                <span className="block font-display text-[22px] font-extrabold uppercase leading-none tracking-[0.04em]">
                  Apply on WhatsApp
                </span>
                <span className="mt-1.5 block font-mono text-[11px] tracking-[0.16em] text-white/65">
                  {site.phones[0]}
                </span>
              </span>
              <ArrowUpRightIcon weight="bold" className="size-[18px] text-safety-400" />
            </a>
            <a
              href={`tel:${site.phonesE164[0]}`}
              className="flex items-center gap-4 border-[3px] border-ink bg-paper px-6 py-4 transition-colors hover:bg-paper-3"
            >
              <PhoneCallIcon weight="fill" className="size-6 shrink-0 text-forest-700" />
              <span>
                <span className="block font-display text-[22px] font-extrabold uppercase leading-none tracking-[0.04em]">
                  Call us
                </span>
                <span className="mt-1.5 block font-mono text-[11px] tracking-[0.16em] text-ink-soft">
                  {site.phones[0]}
                </span>
              </span>
            </a>
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("Application: 2027 Excavator Operator Training")}`}
              className="flex items-center gap-4 border-[3px] border-ink bg-paper px-6 py-4 transition-colors hover:bg-paper-3"
            >
              <EnvelopeSimpleIcon weight="bold" className="size-6 shrink-0 text-forest-700" />
              <span>
                <span className="block font-display text-[22px] font-extrabold uppercase leading-none tracking-[0.04em]">
                  Email us
                </span>
                <span className="mt-1.5 block font-mono text-[11px] tracking-[0.16em] text-ink-soft">
                  {site.email}
                </span>
              </span>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
