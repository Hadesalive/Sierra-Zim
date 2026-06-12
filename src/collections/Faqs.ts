import type { CollectionConfig } from "payload";

import { orderField } from "../fields/shared";

export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  access: { read: () => true },
  admin: { useAsTitle: "question", defaultColumns: ["question", "order"], group: "Content" },
  defaultSort: "order",
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea" },
    orderField,
  ],
};
