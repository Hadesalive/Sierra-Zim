import type { Metadata } from "next";
import { ogBase } from "@/lib/metadata";
import {
  PhoneCallIcon,
  EnvelopeSimpleIcon,
  MapPinLineIcon,
  ClockIcon,
  WhatsappLogoIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/contact-form";
import { getSite, getProgrammes, getContactPage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const [site, contact] = await Promise.all([getSite(), getContactPage()]);
  return {
    title: "Contact",
    description:
      contact.metaDescription ||
      `Enrol your drivers and operators with ${site.name} in ${site.address.city}, ${site.address.country}. Call ${site.phones[0]}, email ${site.email}, or send an enquiry.`,
    alternates: { canonical: "/contact" },
    openGraph: {
      ...ogBase("/contact"),
      title: `Contact · ${site.shortName}`,
      images: contact.heroImage
        ? [{ url: contact.heroImage, alt: "Contact SierraZim Training Academy" }]
        : undefined,
    },
  };
}

export default async function ContactPage() {
  const [site, programmes, contact] = await Promise.all([
    getSite(),
    getProgrammes(),
    getContactPage(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={contact.heroEyebrow || "Contact — reply within one business day"}
        title={
          <>
            Get your fleet
            <br />
            <span className="text-safety-400">certified.</span>
          </>
        }
        intro={
          contact.heroIntro ||
          "Tell us about your drivers, operators and equipment, and we'll put together the right training and certification plan."
        }
      />

      <section className="bg-paper text-ink">
        <div aria-hidden className="hazard h-3.5" />
        <div className="mx-auto grid w-full max-w-[90rem] gap-14 px-6 py-20 sm:px-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Channels */}
          <div>
            <h2 className="font-display text-fluid-9 font-extrabold uppercase leading-[0.9]">
              {contact.detailsHeading || "Talk to the academy."}
            </h2>
            <p className="mt-5 text-[16.5px] leading-[1.6] text-ink-soft">
              WhatsApp is fastest — most of our clients book that way.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={site.whatsappHref}
                rel="noopener"
                className="flex items-center gap-4 bg-forest-950 px-6 py-5 text-white transition-colors hover:bg-forest-900"
              >
                <WhatsappLogoIcon weight="fill" className="size-7 shrink-0 text-safety-400" />
                <span className="flex-1">
                  <span className="block font-display text-[22px] font-extrabold uppercase leading-none tracking-[0.04em]">
                    WhatsApp us
                  </span>
                  <span className="mt-1.5 block font-mono text-[11px] tracking-[0.16em] text-white/65">
                    {site.phones[0]}
                  </span>
                </span>
                <ArrowUpRightIcon weight="bold" className="size-[18px] text-safety-400" />
              </a>

              <a
                href={`tel:${site.phonesE164[0]}`}
                className="flex items-center gap-4 border-[3px] border-ink px-6 py-4 transition-colors hover:bg-paper-2"
              >
                <PhoneCallIcon weight="fill" className="size-6 shrink-0 text-forest-700" />
                <span>
                  <span className="block font-display text-[22px] font-extrabold uppercase leading-none tracking-[0.04em]">
                    Call us
                  </span>
                  <span className="mt-1.5 block font-mono text-[11px] tracking-[0.16em] text-ink-soft">
                    {site.phones.join(" · ")}
                  </span>
                </span>
              </a>

              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-4 border-[3px] border-ink px-6 py-4 transition-colors hover:bg-paper-2"
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

            <div className="mt-9 flex flex-col gap-3.5 border-t-2 border-dashed border-line-strong pt-6 text-[14.5px] text-ink">
              <span className="flex items-start gap-3">
                <MapPinLineIcon weight="bold" className="mt-0.5 size-4 shrink-0 text-safety-600" />
                {site.address.full}
              </span>
              <span className="flex items-start gap-3">
                <ClockIcon weight="bold" className="mt-0.5 size-4 shrink-0 text-safety-600" />
                {site.hours}
              </span>
            </div>
          </div>

          {/* Enquiry docket */}
          <ContactForm site={site} programmes={programmes.map((p) => p.title)} />
        </div>
      </section>
    </>
  );
}
