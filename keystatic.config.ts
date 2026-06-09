import { config, fields, collection, singleton } from "@keystatic/core";

/**
 * SierraZim CMS — Phase 0 model (a representative slice to prove the pattern).
 * Storage is "local" for development; switch to { kind: "github", repo: "Hadesalive/Sierra-Zim" }
 * for editing in production (edits commit to the repo → Vercel rebuilds).
 *
 * The remaining collections (programmes, sectors, case studies, gallery incl. video)
 * follow the same shape and get added during the migration phase (see docs/cms-plan.md).
 */
export default config({
  storage: { kind: "local" },
  ui: {
    brand: { name: "SierraZim CMS" },
  },
  singletons: {
    site: singleton({
      label: "Site settings",
      path: "src/content/site",
      format: { data: "json" },
      schema: {
        name: fields.text({ label: "Academy name" }),
        tagline: fields.text({ label: "Tagline" }),
        email: fields.text({ label: "Email" }),
        phonePrimary: fields.text({ label: "Phone (primary)" }),
        phoneSecondary: fields.text({ label: "Phone (secondary)" }),
        whatsapp: fields.text({
          label: "WhatsApp number",
          description: "Digits only, e.g. 23273077004",
        }),
        addressFull: fields.text({ label: "Address" }),
        hours: fields.text({ label: "Opening hours" }),
      },
    }),
  },
  collections: {
    faqs: collection({
      label: "FAQs",
      slugField: "question",
      path: "src/content/faqs/*",
      format: { data: "json" },
      schema: {
        question: fields.slug({ name: { label: "Question" } }),
        answer: fields.text({ label: "Answer", multiline: true }),
      },
    }),
    clients: collection({
      label: "Clients & partners",
      slugField: "name",
      path: "src/content/clients/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        sector: fields.text({ label: "Sector" }),
        context: fields.text({ label: "One-line context", multiline: true }),
      },
    }),
  },
});
