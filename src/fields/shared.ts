import type { Field } from "payload";

/** URL-safe slug from arbitrary text. */
export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

/** A sidebar slug field that auto-fills from `source` when left blank. */
export const slugField = (source = "title"): Field => ({
  name: "slug",
  type: "text",
  index: true,
  unique: true,
  admin: {
    position: "sidebar",
    description: `URL segment. Leave blank to auto-fill from "${source}".`,
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) =>
        value || (data?.[source] ? slugify(String(data[source])) : value),
    ],
  },
});

/** Manual sort order — lower numbers first. */
export const orderField: Field = {
  name: "order",
  type: "number",
  defaultValue: 0,
  admin: {
    position: "sidebar",
    step: 1,
    description: "Sort order — lower numbers appear first.",
  },
};

/** The shared shape of an index-page hero (Services / Portfolio / Gallery / Sectors). */
export const indexHeroGroup = (name: string, label: string): Field => ({
  name,
  type: "group",
  label,
  fields: [
    { name: "metaDescription", type: "textarea", label: "Meta description" },
    { name: "eyebrow", type: "text" },
    { name: "title", type: "text" },
    { name: "intro", type: "textarea" },
  ],
});
