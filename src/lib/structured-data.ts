import { SITE_URL } from "@/lib/site";
import type { SiteSettings } from "@/lib/content";

const ORG_ID = `${SITE_URL}/#organization`;

export function organizationLd(
  site: SiteSettings,
  knowsAbout: string[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    alternateName: site.shortName,
    description: site.description,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    image: `${SITE_URL}/gallery/instructor-truck-course.jpg`,
    slogan: site.tagline,
    email: site.email,
    telephone: site.phonesE164[0],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: "SL",
    },
    areaServed: [
      { "@type": "Country", name: "Sierra Leone" },
      { "@type": "Country", name: "Mozambique" },
      { "@type": "Country", name: "Côte d'Ivoire" },
    ],
    geo: { "@type": "GeoCoordinates", latitude: 8.8817, longitude: -12.044 },
    hasMap: site.mapsHref,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:30",
    },
    knowsAbout,
  };
}

export function courseLd(
  service: {
    slug: string;
    title: string;
    short: string;
    image: string;
  },
  site: SiteSettings,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: service.title,
    description: service.short,
    url: `${SITE_URL}/services/${service.slug}`,
    image: service.image,
    provider: {
      "@type": "EducationalOrganization",
      "@id": ORG_ID,
      name: site.name,
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      courseWorkload:
        "Classroom theory, oral examination and hands-on practical assessment",
      location: {
        "@type": "Place",
        name: site.address.full,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          addressCountry: "SL",
        },
      },
    },
  };
}

export function faqLd(
  items: { q: string; a: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
