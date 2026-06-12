import type { CollectionConfig } from "payload";

import { orderField, slugField } from "../fields/shared";

export const ValueProps: CollectionConfig = {
  slug: "value-props",
  labels: { singular: "Value prop", plural: "Value props (Why SierraZim)" },
  access: { read: () => true },
  admin: { useAsTitle: "title", defaultColumns: ["title", "order"], group: "Content" },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", required: true },
    slugField("title"),
    { name: "description", type: "textarea" },
    orderField,
  ],
};
