import type { CollectionConfig } from "payload";

import { orderField, slugField } from "../fields/shared";

export const Programmes: CollectionConfig = {
  slug: "programmes",
  labels: { singular: "Programme", plural: "Programmes" },
  access: { read: () => true },
  admin: { useAsTitle: "title", defaultColumns: ["title", "slug", "order"], group: "Content" },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", required: true },
    slugField("title"),
    { name: "short", type: "textarea", label: "Short description" },
    { name: "description", type: "textarea", label: "Full description" },
    {
      name: "features",
      type: "array",
      label: "What it covers",
      labels: { singular: "Feature", plural: "Features" },
      fields: [{ name: "feature", type: "text" }],
    },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "imageAlt", type: "text", label: "Image alt text" },
    { name: "audience", type: "textarea", label: "Who it's for" },
    { name: "format", type: "textarea" },
    { name: "certification", type: "textarea", label: "What you get" },
    orderField,
  ],
};
