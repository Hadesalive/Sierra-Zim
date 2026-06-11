import config from "@payload-config";
import { getPayload } from "payload";

/**
 * Local Payload client for server-side reads (RSC / build).
 * getPayload caches a single instance per config, so this is cheap to call.
 */
export const payload = () => getPayload({ config });
