import { config, fields, collection, singleton } from "@keystatic/core";

const indexHero = (label: string) =>
  fields.object(
    {
      metaDescription: fields.text({ label: "Meta description", multiline: true }),
      eyebrow: fields.text({ label: "Eyebrow" }),
      title: fields.text({ label: "Title", multiline: true }),
      intro: fields.text({ label: "Intro", multiline: true }),
    },
    { label: `${label} page hero` },
  );

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
        shortName: fields.text({ label: "Short name" }),
        legalName: fields.text({ label: "Legal name" }),
        tagline: fields.text({ label: "Tagline" }),
        description: fields.text({
          label: "Site description (SEO / social)",
          multiline: true,
        }),
        email: fields.text({ label: "Email" }),
        phonePrimary: fields.text({ label: "Phone (primary)" }),
        phoneSecondary: fields.text({ label: "Phone (secondary)" }),
        whatsapp: fields.text({
          label: "WhatsApp number",
          description: "Digits only, e.g. 23273077004",
        }),
        addressCity: fields.text({ label: "City" }),
        addressRegion: fields.text({ label: "Region" }),
        addressCountry: fields.text({ label: "Country" }),
        hours: fields.text({ label: "Opening hours" }),
        leadership: fields.array(
          fields.object({
            name: fields.text({ label: "Name" }),
            role: fields.text({ label: "Role" }),
          }),
          { label: "Leadership", itemLabel: (p) => p.fields.name.value },
        ),
      },
    }),
    home: singleton({
      label: "Home page",
      path: "src/content/home",
      format: { data: "json" },
      schema: {
        heroEyebrowAccent: fields.text({ label: "Hero eyebrow — accent word" }),
        heroEyebrowRest: fields.text({ label: "Hero eyebrow — rest" }),
        heroTitleLine1: fields.text({ label: "Hero title — line 1" }),
        heroTitleAccent: fields.text({ label: "Hero title — green word" }),
        heroTitleLine2: fields.text({ label: "Hero title — line 2" }),
        heroSubhead: fields.text({ label: "Hero subhead", multiline: true }),
        heroPillTitle: fields.text({ label: "Hero badge — title" }),
        heroPillSubtitle: fields.text({ label: "Hero badge — subtitle" }),
        clientsLabel: fields.text({ label: "Clients band label" }),
        programmesEyebrow: fields.text({ label: "Programmes — eyebrow" }),
        programmesHeading: fields.text({ label: "Programmes — heading" }),
        programmesIntro: fields.text({ label: "Programmes — intro", multiline: true }),
        certPathEyebrow: fields.text({ label: "Certification path — eyebrow" }),
        certPathHeading: fields.text({ label: "Certification path — heading" }),
        certPathIntro: fields.text({ label: "Certification path — intro", multiline: true }),
        certPathSteps: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            body: fields.text({ label: "Body", multiline: true }),
          }),
          { label: "Certification steps", itemLabel: (p) => p.fields.title.value },
        ),
        whyUsEyebrow: fields.text({ label: "Why us — eyebrow" }),
        whyUsHeading: fields.text({ label: "Why us — heading" }),
        whyUsIntro: fields.text({ label: "Why us — intro", multiline: true }),
        whyUsImageCaption: fields.text({ label: "Why us — image caption" }),
        workEyebrow: fields.text({ label: "Work — eyebrow" }),
        workHeading: fields.text({ label: "Work — heading" }),
        galleryEyebrow: fields.text({ label: "Gallery preview — eyebrow" }),
        galleryHeading: fields.text({ label: "Gallery preview — heading" }),
        faqEyebrow: fields.text({ label: "FAQ — eyebrow" }),
        faqHeading: fields.text({ label: "FAQ — heading" }),
        statementQuote: fields.text({ label: "Statement quote", multiline: true }),
        statementPartnersLabel: fields.text({ label: "Partners label" }),
        statementPartners: fields.array(fields.text({ label: "Partner" }), {
          label: "Partners",
          itemLabel: (p) => p.value,
        }),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: "Value" }),
            label: fields.text({ label: "Label" }),
          }),
          { label: "Stats", itemLabel: (p) => p.fields.value.value },
        ),
      },
    }),
    pages: singleton({
      label: "Other pages",
      path: "src/content/pages",
      format: { data: "json" },
      schema: {
        about: fields.object(
          {
            metaDescription: fields.text({ label: "Meta description", multiline: true }),
            heroEyebrow: fields.text({ label: "Hero eyebrow" }),
            heroTitleLine1: fields.text({ label: "Hero title — line 1" }),
            heroTitleLine2: fields.text({ label: "Hero title — line 2" }),
            heroIntro: fields.text({ label: "Hero intro", multiline: true }),
            storyEyebrow: fields.text({ label: "Story eyebrow" }),
            storyHeading: fields.text({ label: "Story heading" }),
            storyBlocks: fields.array(
              fields.text({ label: "Paragraph", multiline: true }),
              { label: "Story paragraphs", itemLabel: (p) => p.value.slice(0, 48) },
            ),
            storyImageCaption: fields.text({ label: "Story image caption" }),
            leadershipEyebrow: fields.text({ label: "Leadership eyebrow" }),
            leadershipHeading: fields.text({ label: "Leadership heading" }),
            locationsEyebrow: fields.text({ label: "Locations eyebrow" }),
            locationsHeading: fields.text({ label: "Locations heading" }),
            locations: fields.array(
              fields.object({
                place: fields.text({ label: "Place" }),
                note: fields.text({ label: "Note" }),
              }),
              { label: "Locations", itemLabel: (p) => p.fields.place.value },
            ),
            clientsHeading: fields.text({ label: "Clients heading" }),
          },
          { label: "About page" },
        ),
        contact: fields.object(
          {
            heroEyebrow: fields.text({ label: "Hero eyebrow" }),
            heroTitle: fields.text({ label: "Hero title" }),
            heroIntro: fields.text({ label: "Hero intro", multiline: true }),
            detailsEyebrow: fields.text({ label: "Details eyebrow" }),
            detailsHeading: fields.text({ label: "Details heading" }),
          },
          { label: "Contact page" },
        ),
        servicesHero: indexHero("Services"),
        portfolioHero: indexHero("Portfolio"),
        galleryHero: indexHero("Gallery"),
        sectorsHero: indexHero("Sectors"),
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
