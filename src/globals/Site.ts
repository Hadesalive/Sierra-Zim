import type { GlobalConfig } from "payload";

export const Site: GlobalConfig = {
  slug: "site",
  label: "Site settings",
  access: { read: () => true },
  admin: { group: "Settings" },
  fields: [
    { name: "name", type: "text", label: "Academy name" },
    { name: "shortName", type: "text" },
    { name: "legalName", type: "text" },
    { name: "tagline", type: "text" },
    { name: "description", type: "textarea", label: "Site description (SEO / social)" },
    { name: "email", type: "text" },
    { name: "phonePrimary", type: "text" },
    { name: "phoneSecondary", type: "text" },
    {
      name: "whatsapp",
      type: "text",
      admin: { description: "Digits only, e.g. 23273077004" },
    },
    { name: "addressCity", type: "text" },
    { name: "addressRegion", type: "text" },
    { name: "addressCountry", type: "text" },
    { name: "hours", type: "text" },
    {
      name: "leadership",
      type: "array",
      fields: [
        { name: "name", type: "text" },
        { name: "role", type: "text" },
        { name: "photo", type: "upload", relationTo: "media", label: "Photo" },
      ],
    },
  ],
};
