import registry from "@/content/certificates.json";

/**
 * Certificate registry — the source of truth for /verify.
 *
 * Every certificate SierraZim issues gets an entry in
 * `src/content/certificates.json` with a random, non-sequential code
 * (e.g. SZ-26-7BWU82). The code is printed on the certificate and encoded in
 * its QR, which opens `/verify/<code>`. Codes are random so the register can't
 * be walked by guessing the next number.
 *
 * To revoke a certificate, set `"status": "revoked"` on its entry; the verify
 * page will then show it as revoked rather than valid.
 */
export type Certificate = {
  code: string;
  name: string;
  course: string;
  /** ISO date, YYYY-MM-DD */
  issued: string;
  status?: "valid" | "revoked";
  sourceFile?: string;
};

export const CERTIFICATES = registry as Certificate[];

/** Normalise user input: uppercase, strip spaces, tolerate missing dashes. */
export function normaliseCode(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const m = raw.match(/^SZ(\d{2})([A-Z0-9]{6})$/);
  return m ? `SZ-${m[1]}-${m[2]}` : input.trim().toUpperCase();
}

export function getCertificate(code: string): Certificate | undefined {
  const c = normaliseCode(decodeURIComponent(code));
  return CERTIFICATES.find((x) => x.code === c);
}

export function formatIssued(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
