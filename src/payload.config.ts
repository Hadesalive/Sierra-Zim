import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig, type CollectionConfig, type GlobalConfig } from "payload";
import sharp from "sharp";

import {
  revalidateAfterChange,
  revalidateAfterDelete,
  revalidateGlobal,
} from "./lib/revalidate";

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

/** Append the on-demand revalidation hooks so publishes appear on the site instantly. */
const withRevalidate = (c: CollectionConfig): CollectionConfig => ({
  ...c,
  hooks: {
    ...c.hooks,
    afterChange: [...(c.hooks?.afterChange ?? []), revalidateAfterChange],
    afterDelete: [...(c.hooks?.afterDelete ?? []), revalidateAfterDelete],
  },
});

const withGlobalRevalidate = (g: GlobalConfig): GlobalConfig => ({
  ...g,
  hooks: {
    ...g.hooks,
    afterChange: [...(g.hooks?.afterChange ?? []), revalidateGlobal],
  },
});

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
    ...[Programmes, Sectors, CaseStudies, Clients, ValueProps, Faqs, Gallery, Media].map(
      withRevalidate,
    ),
    Users,
  ],
  globals: [Site, Home, Pages].map(withGlobalRevalidate),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
      // Force TLS regardless of the connection string's query params. Neon
      // requires SSL; relying on `?sslmode=require` in the URL is fragile across
      // environments (a no-sslmode URL set in Vercel fails the build prerender
      // with "connection is insecure"). This pins it on.
      ssl: { rejectUnauthorized: false },
    },
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
