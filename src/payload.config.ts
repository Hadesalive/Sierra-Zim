import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";

import { CaseStudies } from "./collections/CaseStudies";
import { Clients } from "./collections/Clients";
import { Faqs } from "./collections/Faqs";
import { Gallery } from "./collections/Gallery";
import { Media } from "./collections/Media";
import { Programmes } from "./collections/Programmes";
import { Sectors } from "./collections/Sectors";
import { Users } from "./collections/Users";
import { ValueProps } from "./collections/ValueProps";
import { Home } from "./globals/Home";
import { Pages } from "./globals/Pages";
import { Site } from "./globals/Site";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * SierraZim CMS — Payload config.
 * Every piece of site content (except icons, which stay in code) is editable here.
 */
export default buildConfig({
  admin: {
    user: "users",
    meta: {
      titleSuffix: "· SierraZim CMS",
    },
  },
  collections: [
    Programmes,
    Sectors,
    CaseStudies,
    Clients,
    ValueProps,
    Faqs,
    Gallery,
    Media,
    Users,
  ],
  globals: [Site, Home, Pages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  plugins: [
    vercelBlobStorage({
      enabled: true,
      // Serve public Blob URLs directly (CDN-cached) instead of proxying through
      // Payload's /api/media/file route — best for a public marketing site.
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
