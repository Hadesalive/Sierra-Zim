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

/** A sidebar slug field that auto-fills from `source` when left blank, and
 *  auto-suffixes (-2, -3, …) to stay unique when two items slugify the same. */
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
      async ({ value, data, req, originalDoc, collection }) => {
        const base =
          (value && String(value)) ||
          (data?.[source] ? slugify(String(data[source])) : "");
        if (!base || !collection) return value;
        let candidate = base;
        let n = 2;
        // Bump the suffix until the slug is unique (excluding this same doc).
        while (
          (
            await req.payload.count({
              collection: collection.slug,
              where: {
                slug: { equals: candidate },
                ...(originalDoc?.id ? { id: { not_equals: originalDoc.id } } : {}),
              },
            })
          ).totalDocs > 0
        ) {
          candidate = `${base}-${n++}`;
        }
        return candidate;
      },
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

/** A hero / social image upload (resolves to a Blob URL on the frontend). */
export const heroImageField = (label = "Hero / social image"): Field => ({
  name: "heroImage",
  type: "upload",
  relationTo: "media",
  label,
});

/** Fields shared by the four index-page globals (Services / Portfolio / Gallery /
 *  Sectors), grouped into tabs by section. Tabs are unnamed, so the stored data
 *  stays flat (eyebrow, title, intro, heroImage, metaDescription) — UI only. */
export const indexPageFields = (): Field[] => [
  {
    type: "tabs",
    tabs: [
      {
        label: "Hero",
        fields: [
          { name: "eyebrow", type: "text" },
          { name: "title", type: "text" },
          { name: "intro", type: "textarea" },
          heroImageField(),
        ],
      },
      {
        label: "SEO",
        fields: [
          { name: "metaDescription", type: "textarea", label: "Meta description" },
        ],
      },
    ],
  },
];
