import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  // Payload imports `sharp`, which Turbopack externalizes but does NOT trace its
  // native binary (libvips .so) into the serverless function — so /admin and
  // /api 500 at runtime on Vercel ("Could not load the sharp module …"). The
  // binary IS installed (the build uses it); force-include it in the Payload
  // route functions so it's present at request time.
  outputFileTracingIncludes: {
    "/admin/**": ["./node_modules/sharp/**/*", "./node_modules/@img/**/*"],
    "/api/**": ["./node_modules/sharp/**/*", "./node_modules/@img/**/*"],
  },
};

export default withPayload(nextConfig);
