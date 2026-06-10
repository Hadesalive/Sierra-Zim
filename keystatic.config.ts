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
        order: fields.integer({ label: "Order", defaultValue: 0 }),
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
        order: fields.integer({ label: "Order", defaultValue: 0 }),
      },
    }),
    programmes: collection({
      label: "Programmes",
      slugField: "title",
      path: "src/content/programmes/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        short: fields.text({ label: "Short description", multiline: true }),
        description: fields.text({ label: "Full description", multiline: true }),
        features: fields.array(fields.text({ label: "Feature" }), {
          label: "What it covers",
          itemLabel: (props) => props.value,
        }),
        image: fields.image({
          label: "Image",
          directory: "public/gallery",
          publicPath: "/gallery",
        }),
        imageAlt: fields.text({ label: "Image alt text" }),
        audience: fields.text({ label: "Who it's for", multiline: true }),
        format: fields.text({ label: "Format", multiline: true }),
        certification: fields.text({ label: "What you get", multiline: true }),
        order: fields.integer({ label: "Order", defaultValue: 0 }),
      },
    }),
    valueProps: collection({
      label: "Value props (Why SierraZim)",
      slugField: "title",
      path: "src/content/value-props/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({ label: "Description", multiline: true }),
        order: fields.integer({ label: "Order", defaultValue: 0 }),
      },
    }),
    sectors: collection({
      label: "Sectors",
      slugField: "name",
      path: "src/content/sectors/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        title: fields.text({ label: "Title" }),
        intro: fields.text({ label: "Intro", multiline: true }),
        metaDescription: fields.text({ label: "Meta description", multiline: true }),
        image: fields.image({
          label: "Image",
          directory: "public/gallery",
          publicPath: "/gallery",
        }),
        imageAlt: fields.text({ label: "Image alt" }),
        programmes: fields.array(
          fields.relationship({ label: "Programme", collection: "programmes" }),
          { label: "Programmes", itemLabel: (p) => p.value ?? "" },
        ),
        clients: fields.array(
          fields.relationship({ label: "Client", collection: "clients" }),
          { label: "Clients", itemLabel: (p) => p.value ?? "" },
        ),
        order: fields.integer({ label: "Order", defaultValue: 0 }),
      },
    }),
    caseStudies: collection({
      label: "Case studies",
      slugField: "client",
      path: "src/content/case-studies/*",
      format: { data: "json" },
      schema: {
        client: fields.slug({ name: { label: "Client" } }),
        sector: fields.text({ label: "Sector" }),
        location: fields.text({ label: "Location" }),
        year: fields.text({ label: "Year" }),
        title: fields.text({ label: "Title" }),
        summary: fields.text({ label: "Summary", multiline: true }),
        overview: fields.text({ label: "Overview", multiline: true }),
        delivered: fields.array(fields.text({ label: "Item" }), {
          label: "What we delivered",
          itemLabel: (p) => p.value,
        }),
        outcomes: fields.array(fields.text({ label: "Item" }), {
          label: "Outcomes",
          itemLabel: (p) => p.value,
        }),
        services: fields.array(
          fields.relationship({ label: "Programme", collection: "programmes" }),
          { label: "Programmes involved", itemLabel: (p) => p.value ?? "" },
        ),
        image: fields.image({
          label: "Cover image",
          directory: "public/gallery",
          publicPath: "/gallery",
        }),
        imageAlt: fields.text({ label: "Cover image alt" }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: "Image",
              directory: "public/gallery",
              publicPath: "/gallery",
            }),
            alt: fields.text({ label: "Alt" }),
          }),
          {
            label: "Photo gallery",
            itemLabel: (p) => p.fields.alt.value || "Photo",
          },
        ),
        realPhotos: fields.checkbox({
          label: "Has real photos from this engagement",
          defaultValue: false,
        }),
        featured: fields.checkbox({ label: "Featured", defaultValue: false }),
        order: fields.integer({ label: "Order", defaultValue: 0 }),
      },
    }),
    gallery: collection({
      label: "Gallery",
      slugField: "caption",
      path: "src/content/gallery/*",
      format: { data: "json" },
      schema: {
        caption: fields.slug({ name: { label: "Caption" } }),
        alt: fields.text({ label: "Alt text", multiline: true }),
        media: fields.conditional(
          fields.select({
            label: "Type",
            options: [
              { label: "Image", value: "image" },
              { label: "Video", value: "video" },
            ],
            defaultValue: "image",
          }),
          {
            image: fields.object({
              image: fields.image({
                label: "Image",
                directory: "public/gallery",
                publicPath: "/gallery",
              }),
              width: fields.integer({ label: "Width", defaultValue: 1536 }),
              height: fields.integer({ label: "Height", defaultValue: 1152 }),
            }),
            video: fields.object({
              provider: fields.select({
                label: "Provider",
                options: [
                  { label: "YouTube", value: "youtube" },
                  { label: "Vimeo", value: "vimeo" },
                  { label: "File (MP4)", value: "file" },
                ],
                defaultValue: "youtube",
              }),
              src: fields.text({ label: "Video ID or /path.mp4" }),
              poster: fields.image({
                label: "Poster",
                directory: "public/gallery",
                publicPath: "/gallery",
              }),
              width: fields.integer({ label: "Width", defaultValue: 1280 }),
              height: fields.integer({ label: "Height", defaultValue: 720 }),
            }),
          },
        ),
        order: fields.integer({ label: "Order", defaultValue: 0 }),
      },
    }),
  },
});
