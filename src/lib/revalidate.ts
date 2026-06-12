import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/**
 * Bust the Next.js Full Route Cache for the whole public site.
 *
 * Content here is cross-cutting (one programme can appear on the home page, the
 * services index, its own page, plus sector and case-study pages) and edits are
 * occasional, so a full-site revalidation is the simplest way to guarantee every
 * page is consistent and updates instantly after a publish.
 *
 * `revalidatePath` only works inside a Next request (Route Handler / Server
 * Action). Payload's admin mutations run through the (payload) API route
 * handlers, so it works there. When the same hooks run outside Next (e.g. the
 * seed script), the dynamic import / call is wrapped so it's a no-op.
 */
const revalidateSite = async (): Promise<void> => {
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");
  } catch {
    // Not in a Next request context (CLI / seed) — nothing to revalidate.
  }
};

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await revalidateSite();
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await revalidateSite();
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await revalidateSite();
  return doc;
};
