import type { CollectionConfig } from "payload";

import { orderField, slugField } from "../fields/shared";

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  labels: { singular: "Case study", plural: "Case studies" },
  access: { read: () => true },
  admin: {
    useAsTitle: "client",
    defaultColumns: ["client", "sector", "year", "featured", "order"],
    group: "Content",
  },
  defaultSort: "order",
  fields: [
    { name: "client", type: "text", required: true },
    slugField("client"),
    { name: "sector", type: "text" },
    { name: "location", type: "text" },
    { name: "year", type: "text" },
    { name: "title", type: "text" },
    { name: "summary", type: "textarea" },
    { name: "overview", type: "textarea" },
    {
      name: "delivered",
      type: "array",
      label: "What we delivered",
      fields: [{ name: "item", type: "text" }],
    },
    {
      name: "outcomes",
      type: "array",
      fields: [{ name: "item", type: "text" }],
    },
    {
      name: "services",
      type: "relationship",
      relationTo: "programmes",
      hasMany: true,
      label: "Programmes involved",
    },
    { name: "image", type: "upload", relationTo: "media", label: "Cover image" },
    { name: "imageAlt", type: "text", label: "Cover image alt" },
    {
      name: "gallery",
      type: "array",
      label: "Photo gallery",
      fields: [
        { name: "image", type: "upload", relationTo: "media" },
        { name: "alt", type: "text" },
      ],
    },
    {
      name: "realPhotos",
      type: "checkbox",
      defaultValue: false,
      label: "Has real photos from this engagement",
    },
    { name: "featured", type: "checkbox", defaultValue: false },
    orderField,
  ],
};
