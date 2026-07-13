import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { JsonLd } from "@/components/json-ld";
import { organizationLd } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";
import { getSite, getProgrammes, getHome } from "@/lib/content";

// Barlow Condensed — all display / headings / nav / buttons (uppercase, tight)
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

// Barlow — body copy
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

// IBM Plex Mono — technical labels / eyebrows
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [site, home] = await Promise.all([getSite(), getHome()]);
  const titleDefault = `${site.name} — ${site.tagline}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: titleDefault,
      template: `%s · ${site.shortName}`,
    },
    description: site.description,
    applicationName: site.name,
    keywords: [
      "defensive driving training Sierra Leone",
      "heavy vehicle driver training",
      "surface mobile equipment training",
      "operator certification",
      "driver training Makeni",
      "mining operator training Sierra Leone",
      "agriculture equipment training",
      "SierraZim Training Academy",
    ],
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.legalName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: SITE_URL,
      siteName: site.name,
      title: titleDefault,
      description: site.description,
      images: home.socialImage
        ? [
            {
              url: home.socialImage,
              alt: "SierraZim instructor leading a heavy-vehicle driver training course",
            },
          ]
        : undefined,
    },
    // Only the card type here — Next derives per-page twitter title/description/
    // images from each route's openGraph (the home card comes from the root OG).
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    category: "education",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [site, programmes] = await Promise.all([getSite(), getProgrammes()]);
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${barlow.variable} ${plexMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <JsonLd data={organizationLd(site, programmes.map((p) => p.title))} />
        <SiteHeader site={site} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppFab href={site.whatsappHref} />
      </body>
    </html>
  );
}
