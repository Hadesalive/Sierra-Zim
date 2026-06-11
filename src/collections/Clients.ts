import type { CollectionConfig } from "payload";

import { orderField, slugField } from "../fields/shared";

export const Clients: CollectionConfig = {
  slug: "clients",
  labels: { singular: "Client", plural: "Clients & partners" },
  access: { read: () => true },
  admin: { useAsTitle: "name", defaultColumns: ["name", "sector", "order"], group: "Content" },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    slugField("name"),
    { name: "sector", type: "text" },
    { name: "context", type: "textarea", label: "One-line context" },
    orderField,
  ],
};
