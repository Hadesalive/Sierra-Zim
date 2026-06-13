import type { GlobalConfig } from "payload";

import { indexPageFields } from "../fields/shared";

export const SectorsPage: GlobalConfig = {
  slug: "sectors-page",
  label: "Sectors Page",
  access: { read: () => true },
  admin: { group: "Pages" },
  fields: indexPageFields(),
};
