import type { GlobalConfig } from "payload";

import { indexPageFields } from "../fields/shared";

export const GalleryPage: GlobalConfig = {
  slug: "gallery-page",
  label: "Gallery Page",
  access: { read: () => true },
  admin: { group: "Pages" },
  fields: indexPageFields(),
};
