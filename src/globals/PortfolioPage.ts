import type { GlobalConfig } from "payload";

import { indexPageFields } from "../fields/shared";

export const PortfolioPage: GlobalConfig = {
  slug: "portfolio-page",
  label: "Portfolio Page",
  access: { read: () => true },
  admin: { group: "Pages" },
  fields: indexPageFields(),
};
