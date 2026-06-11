import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * SierraZim CMS — Payload config.
 * Scaffold stage: auth (users) + media (uploads → Vercel Blob) only.
 * Content collections + globals are added during the modelling phase.
 */
export default buildConfig({
  admin: {
    user: "users",
    meta: {
      titleSuffix: "· SierraZim CMS",
    },
  },
  collections: [
    {
      slug: "users",
      auth: true,
      admin: { useAsTitle: "email", group: "Admin" },
      fields: [
        { name: "name", type: "text" },
      ],
    },
    {
      slug: "media",
      access: { read: () => true },
      admin: { group: "Admin" },
      upload: true,
      fields: [
        { name: "alt", type: "text", label: "Alt text" },
      ],
    },
  ],
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
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
