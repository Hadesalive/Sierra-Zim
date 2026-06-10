import type { Metadata } from "next";
import {
  PhoneCallIcon,
  EnvelopeSimpleIcon,
  MapPinLineIcon,
  ClockIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ContactForm } from "@/components/contact-form";
import { getSite, getProgrammes } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: "Contact",
    description: `Enrol your drivers and operators with ${site.name} in ${site.address.city}, ${site.address.country}. Call ${site.phones[0]}, email ${site.email}, or send an enquiry.`,
    alternates: { canonical: "/contact" },
    openGraph: {
      title: `Contact · ${site.shortName}`,
      images: [
        {
          url: "/gallery/instructor-truck-course.jpg",
          alt: "A SierraZim instructor leading a training course on a field ground",
        },
      ],
    },
  };
}

export default async function ContactPage() {
  const [site, programmes] = await Promise.all([getSite(), getProgrammes()]);
  return (
    <>
      <PageHeader
        index="01"
        eyebrow="Contact"
        title="Let's get your team certified."
        intro="Tell us about your drivers, operators and equipment, and we'll put together the right training and certification plan."
        image="/gallery/classroom-briefing.jpg"
        imageAlt="Classroom briefing during a SierraZim training session"
      />

      <Container className="grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
        {/* Details */}
        <div>
          <Eyebrow index="02">Get in touch</Eyebrow>
          <h2 className="mt-5 font-display text-3xl font-bold text-ink sm:text-4xl">
            Talk to the academy.
          </h2>

          <ul className="mt-10 divide-y divide-line border-y border-line">
            {site.phones.map((p, i) => (
              <li key={p} className="flex items-center gap-4 py-5">
                <span className="flex size-11 shrink-0 items-center justify-center bg-forest-800 text-paper">
                  <PhoneCallIcon weight="bold" className="size-5" />
                </span>
                <div>
                  <p className="label-mono text-ink-soft">Call us</p>
                  <a
                    href={`tel:${site.phonesE164[i]}`}
                    className="font-display text-xl font-bold text-ink hover:text-forest-700"
                  >
                    {p}
                  </a>
                </div>
              </li>
            ))}
            <li className="flex items-center gap-4 py-5">
              <span className="flex size-11 shrink-0 items-center justify-center bg-forest-800 text-paper">
                <EnvelopeSimpleIcon weight="bold" className="size-5" />
              </span>
              <div>
                <p className="label-mono text-ink-soft">Email</p>
                <a
                  href={`mailto:${site.email}`}
                  className="font-display text-xl font-bold text-ink hover:text-forest-700"
                >
                  {site.email}
                </a>
              </div>
            </li>
            <li className="flex items-center gap-4 py-5">
              <span className="flex size-11 shrink-0 items-center justify-center bg-forest-800 text-paper">
                <MapPinLineIcon weight="bold" className="size-5" />
              </span>
              <div>
                <p className="label-mono text-ink-soft">Visit</p>
                <p className="font-display text-xl font-bold text-ink">
                  {site.address.full}
                </p>
              </div>
            </li>
            <li className="flex items-center gap-4 py-5">
              <span className="flex size-11 shrink-0 items-center justify-center bg-forest-800 text-paper">
                <ClockIcon weight="bold" className="size-5" />
              </span>
              <div>
                <p className="label-mono text-ink-soft">Opening hours</p>
                <p className="font-display text-xl font-bold text-ink">
                  {site.hours}
                </p>
              </div>
            </li>
          </ul>

          <a
            href={site.whatsappHref}
            className="group mt-8 inline-flex items-center gap-2.5 border border-forest-700 px-6 py-3.5 font-mono text-[0.78rem] uppercase tracking-[0.16em] text-forest-700 transition-colors hover:bg-forest-700 hover:text-paper"
          >
            <WhatsappLogoIcon weight="fill" className="size-4" />
            Chat on WhatsApp
          </a>

          {/* Map */}
          <div className="mt-10 border border-line">
            <iframe
              title={`Map of ${site.address.full}`}
              src="https://www.google.com/maps?q=Makeni,Sierra%20Leone&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full"
            />
          </div>
        </div>

        {/* Form */}
        <div>
          <Eyebrow index="03">Send an enquiry</Eyebrow>
          <div className="mt-5">
            <ContactForm site={site} programmes={programmes.map((p) => p.title)} />
          </div>
        </div>
      </Container>
    </>
  );
}
