import type { CollectionConfig } from "payload";

import { orderField, slugField } from "../fields/shared";

export const Sectors: CollectionConfig = {
  slug: "sectors",
  labels: { singular: "Sector", plural: "Sectors" },
  access: { read: () => true },
  admin: { useAsTitle: "name", defaultColumns: ["name", "slug", "order"], group: "Content" },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    slugField("name"),
    { name: "title", type: "text" },
    { name: "intro", type: "textarea" },
    { name: "metaDescription", type: "textarea", label: "Meta description" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "imageAlt", type: "text", label: "Image alt" },
    {
      name: "programmes",
      type: "relationship",
      relationTo: "programmes",
      hasMany: true,
    },
    {
      name: "clients",
      type: "relationship",
      relationTo: "clients",
      hasMany: true,
    },
    orderField,
  ],
};
