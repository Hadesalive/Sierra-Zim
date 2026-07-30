import type { GlobalConfig } from "payload";

import { indexPageFields } from "../fields/shared";

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  label: "Services Page",
  access: { read: () => true },
  admin: { group: "Pages" },
  fields: [
    ...indexPageFields(),
    {
      name: "heroSpecs",
      type: "array",
      label: "Hero specs row (Theory / Practical / Certified)",
      maxRows: 3,
      fields: [
        { name: "accent", type: "text", label: "Word (accent)" },
        { name: "rest", type: "text", label: "Rest of line" },
      ],
    },
  ],
};
