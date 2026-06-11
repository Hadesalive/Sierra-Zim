import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { JsonLd } from "@/components/json-ld";
import { organizationLd } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site";
import { getSite } from "@/lib/content";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
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
      images: [
        {
          url: "/gallery/instructor-truck-course.jpg",
          width: 1024,
          height: 768,
          alt: "SierraZim instructor leading a heavy-vehicle driver training course",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description: site.description,
      images: ["/gallery/instructor-truck-course.jpg"],
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
  const site = await getSite();
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${hanken.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <JsonLd data={organizationLd(site)} />
        <SiteHeader site={site} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppFab href={site.whatsappHref} />
      </body>
    </html>
  );
}
