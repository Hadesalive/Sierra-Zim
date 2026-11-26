import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MagnifyingGlassIcon, QrCodeIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { ogBase } from "@/lib/metadata";
import { normaliseCode } from "@/lib/certificates";

export const metadata: Metadata = {
  title: "Verify a certificate",
  description:
    "Confirm that a SierraZim Training Academy certificate is genuine by scanning its QR code or entering its certificate number.",
  alternates: { canonical: "/verify" },
  openGraph: { ...ogBase("/verify"), title: "Verify a certificate · SierraZim" },
};

type Props = { searchParams: Promise<{ code?: string | string[] }> };

export default async function VerifyPage({ searchParams }: Props) {
  const { code } = await searchParams;
  const value = Array.isArray(code) ? code[0] : code;
  if (value && value.trim()) redirect(`/verify/${encodeURIComponent(normaliseCode(value))}`);

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4]" aria-hidden />
      <Container className="relative flex min-h-[64vh] flex-col justify-center py-24">
        <p className="label-mono text-safety-600">Certificate register</p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-7xl">
          Verify a certificate
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          Every SierraZim certificate carries a QR code and a certificate number. Scan the
          code, or type the number printed beside it, to confirm it was issued by us.
        </p>

        <form action="/verify" method="get" className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <label htmlFor="code" className="sr-only">
            Certificate number
          </label>
          <input
            id="code"
            name="code"
            required
            autoComplete="off"
            spellCheck={false}
            placeholder="SZ-26-XXXXXX"
            className="min-w-0 flex-1 border border-line-strong bg-paper px-5 py-4 font-mono text-lg uppercase tracking-[0.12em] text-ink placeholder:text-ink-soft/50 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2.5 bg-forest-800 px-7 py-4 font-mono text-[0.78rem] uppercase tracking-[0.16em] text-paper transition-colors hover:bg-forest-700"
          >
            <MagnifyingGlassIcon weight="bold" className="size-4" />
            Verify
          </button>
        </form>

        <p className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
          <QrCodeIcon className="size-4" /> The number is in the bottom corner of the certificate, under the QR code.
        </p>
      </Container>
    </section>
  );
}
