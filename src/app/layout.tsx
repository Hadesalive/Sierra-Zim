import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { organizationLd } from "@/lib/structured-data";
import { site, SITE_URL } from "@/lib/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.tagline}`,
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
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
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
    title: `${site.name} — ${site.tagline}`,
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${hanken.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <JsonLd data={organizationLd()} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
