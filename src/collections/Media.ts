import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  admin: { group: "Admin" },
  upload: true,
  fields: [{ name: "alt", type: "text", label: "Alt text" }],
};
