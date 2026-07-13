# Content model

This is the CMS schema — what editors can change in `/admin`. It is defined in
`src/payload.config.ts` (which composes `src/collections/*` and `src/globals/*`) and
read by the frontend through `src/lib/content.ts`.

Conventions:

- **Collections** are repeatable items (many programmes, many FAQs). **Globals** are
  single documents (one Site, one Home).
- Most collections have a **`slug`** (sidebar, auto-filled from the title/name, and
  auto-suffixed `-2`, `-3`… if two items collide) and an **`order`** integer (lower =
  first). Existing URL slugs were preserved from the previous site.
- **Image** fields are uploads to the `media` collection (stored on Vercel Blob).
- **Icons are not editable** — they're mapped by slug in `src/lib/icons.ts`.

---

## Collections

### Programmes (`programmes`) — the 7 training courses
`title`, `slug`, `short`, `description`, `features[]` (list of strings), `image`,
`imageAlt`, `audience`, `format`, `certification`, `order`.
Drives `/services`, each `/services/[slug]`, the home programmes section, the sitemap
and Course JSON-LD. Icon is by slug (code).

### Sectors (`sectors`)
`name`, `slug`, `title`, `intro`, `metaDescription`, `image`, `imageAlt`,
`programmes` (relationship → Programmes, many), `clients` (relationship → Clients,
many), `order`.
Drives `/sectors` and each `/sectors/[slug]`.

### Case studies (`case-studies`)
`client`, `slug`, `sector`, `location`, `year`, `title`, `summary`, `overview`,
`delivered[]`, `outcomes[]`, `services` (relationship → Programmes, many), `image`
(cover), `imageAlt`, `gallery[]` (each: `image` + `alt`), `realPhotos` (checkbox),
`featured` (checkbox), `order`.
Drives `/portfolio` and each `/portfolio/[slug]`. The `featured` one is highlighted on
the portfolio index and home work section.

### Clients (`clients`)
`name`, `slug`, `sector`, `context`, `order`. The "who we train for" names.

### Value props (`value-props`) — "Why SierraZim"
`title`, `slug`, `description`, `order`. Icon is by slug (code).

### FAQs (`faqs`)
`question`, `answer`, `order`.

### Gallery (`gallery`) — images **and** videos
`caption`, `alt`, `order`, and a `mediaType` selector:
- **Image:** `image` (upload), and width/height come from the uploaded file.
- **Video:** `provider` (YouTube / Vimeo / File), `videoSrc` (the video id, or a
  `/path.mp4`), `poster` (upload), `width`, `height`.
The detail fields show/hide based on `mediaType`.

### Media (`media`)
Upload collection backed by Vercel Blob. Field: `alt`. Every image used anywhere
(programmes, sectors, case studies, gallery, posters) is a `media` item.

### Users (`users`)
Auth collection for admin login (`email` + `password`, plus `name`). **No users are
seeded** — the first one is created on the first visit to `/admin`.

---

## Globals

### Site settings (`site`)
`name`, `shortName`, `legalName`, `tagline`, `description` (SEO/social), `email`,
`phonePrimary`, `phoneSecondary`, `whatsapp` (digits only), `addressCity`,
`addressRegion`, `addressCountry`, `hours`, `leadership[]` (each: `name`, `role`).
`src/lib/content.ts#getSite` derives extras from these: E.164 phone links, the WhatsApp
deep link, a Google Maps link, and the full address string.

### Home page (`home`) — organised into tabs
- **Hero:** `heroEyebrowAccent`, `heroEyebrowRest`, `heroTitleLine1`,
  `heroTitleAccent`, `heroTitleLine2`, `heroSubhead`, `heroPillTitle`,
  `heroPillSubtitle`.
- **Sections:** `clientsLabel`; programmes `…Eyebrow/Heading/Intro`; certification path
  `…Eyebrow/Heading/Intro` + `certPathSteps[]` (`title`, `body`); why-us
  `…Eyebrow/Heading/Intro` + `whyUsImageCaption`; `workEyebrow/Heading`;
  `galleryEyebrow/Heading`; `faqEyebrow/Heading`.
- **Statement & stats:** `statementQuote`, `statementPartnersLabel`,
  `statementPartners[]`, `stats[]` (`value`, `label`).

### Other pages (`pages`) — tabs
- **About:** an `about` group — `metaDescription`, hero copy, `storyEyebrow/Heading`,
  `storyBlocks[]`, `storyImageCaption`, `leadershipEyebrow/Heading`,
  `locationsEyebrow/Heading`, `locations[]` (`place`, `note`), `clientsHeading`.
- **Contact:** a `contact` group — `heroEyebrow`, `heroTitle`, `heroIntro`,
  `detailsEyebrow`, `detailsHeading`.
- **Index heroes:** `servicesHero`, `portfolioHero`, `galleryHero`, `sectorsHero` —
  each with `metaDescription`, `eyebrow`, `title`, `intro` (the SEO + hero copy for the
  four index pages).

---

## Where each getter is used

`src/lib/content.ts` exposes: `getProgrammes`/`getProgramme`, `getSectors`/`getSector`,
`getCaseStudies`/`getCaseStudy`, `getClients`, `getValueProps`, `getFaqs`,
`getGallery`, `getSite`, `getHome`, `getPages`. Each returns a typed object the pages
and components consume as props.

---

## Images: the media-manifest workflow

Photos are **not** hardcoded by filename anywhere in code or content JSON. Instead:

1. **`scripts/photos/prepare.mjs`** reads the real photo archive (path via
   `PHOTO_ARCHIVE_DIR`; the archive lives outside the repo), dedupes it, skips junk,
   **optimizes** each image with `sharp` (auto-orient → long edge ≤ 2000 px → mozjpeg
   q80 → EXIF stripped), extracts a poster frame per video with `ffmpeg`, and writes the
   results to **`media-staging/`** (gitignored) plus **`src/content/media-manifest.json`**.
   `scripts/photos/config.mjs` holds the folder→placement mapping; hand-tuning (covers,
   alt text, leadership, heroes) happens in the manifest.
2. **`src/content/media-manifest.json`** is the single source of image→placement truth —
   `assignments` for programme covers, sector images, case-study cover/gallery, gallery
   images/videos, `site.leadership[].photo`, and each global's hero/story/why-us/social.
   Validate it with `node scripts/photos/verify-manifest.mjs`.
3. **`scripts/seed.ts`** uploads every `media[]` entry to Blob and wires all image slots
   via manifest lookups (no `img("file.jpg")` calls). Run with `--dry-run` first.

The seed is a full rebuild (it clears the content collections). **After it runs, Payload
+ Blob is the source of truth** and every image is editable in `/admin`; the manifest is
only needed to re-seed from scratch. Content copy still lives in `src/content/*.json` —
those files carry no image filenames.
