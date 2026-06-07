import { SITE_URL, site, services, type Service } from "@/lib/site";

const ORG_ID = `${SITE_URL}/#organization`;

export function organizationLd(): Record<string, unknown> {
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
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:30",
    },
    knowsAbout: services.map((s) => s.title),
  };
}

export function serviceLd(service: Service): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.short,
    serviceType: "Vocational training and certification",
    url: `${SITE_URL}/services/${service.slug}`,
    image: `${SITE_URL}${service.image}`,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "Sierra Leone" },
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
