import type { GlobalConfig } from "payload";

import { indexPageFields } from "../fields/shared";

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  label: "Services Page",
  access: { read: () => true },
  admin: { group: "Pages" },
  fields: indexPageFields(),
};
