import type { Metadata } from "next";
import {
  SealCheckIcon,
  WarningOctagonIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { CERTIFICATES, formatIssued, getCertificate, normaliseCode } from "@/lib/certificates";

type Params = { params: Promise<{ code: string }> };

export function generateStaticParams() {
  return CERTIFICATES.map((c) => ({ code: c.code }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { code } = await params;
  const cert = getCertificate(code);
  return {
    title: cert ? `Certificate ${cert.code}` : "Certificate not found",
    // Individual records are for whoever holds the QR — keep them out of search.
    robots: { index: false, follow: false },
  };
}

export default async function CertificatePage({ params }: Params) {
  const { code } = await params;
  const cert = getCertificate(code);
  const shown = normaliseCode(decodeURIComponent(code));

  if (!cert) {
    return (
      <Result tone="bad" icon={<XCircleIcon weight="fill" className="size-7" />} label="Not found">
        <h1 className="mt-6 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl">
          No certificate matches this number
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          We have no record of <span className="font-mono text-ink">{shown}</span>. Check the number
          for typing mistakes. If it was copied correctly, this certificate was not issued by
          SierraZim Training Academy — please contact us.
        </p>
        <Actions />
      </Result>
    );
  }

  const revoked = cert.status === "revoked";

  return (
    <Result
      tone={revoked ? "warn" : "good"}
      icon={
        revoked ? (
          <WarningOctagonIcon weight="fill" className="size-7" />
        ) : (
          <SealCheckIcon weight="fill" className="size-7" />
        )
      }
      label={revoked ? "Revoked" : "Verified · Genuine certificate"}
    >
      <p className="mt-8 label-mono text-ink-soft">This certifies that</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-7xl">
        {cert.name}
      </h1>
      <p className="mt-5 max-w-2xl text-xl leading-relaxed text-ink-soft">
        {revoked ? "was issued, but this certificate has since been revoked for" : "successfully completed"}{" "}
        <span className="font-semibold text-ink">{cert.course}</span> at SierraZim Training Academy.
      </p>

      <dl className="mt-10 grid max-w-2xl grid-cols-1 border border-line sm:grid-cols-3">
        <Field term="Certificate no." value={cert.code} mono />
        <Field term="Issued" value={formatIssued(cert.issued)} />
        <Field term="Status" value={revoked ? "Revoked" : "Valid"} />
      </dl>

      <p className="mt-6 max-w-2xl text-sm text-ink-soft">
        Make sure the name and number above match the paper certificate exactly. A mismatch means
        the document has been altered.
      </p>
      <Actions />
    </Result>
  );
}

function Result({
  tone,
  icon,
  label,
  children,
}: {
  tone: "good" | "warn" | "bad";
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  const badge = {
    good: "bg-forest-50 text-forest-800 border-forest-200",
    warn: "bg-safety-300/40 text-safety-600 border-safety-400",
    bad: "bg-flag-red/10 text-flag-red-ink border-flag-red/30",
  }[tone];
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4]" aria-hidden />
      <Container className="relative py-20 sm:py-28">
        <div className={`inline-flex items-center gap-3 border px-4 py-2.5 ${badge}`}>
          {icon}
          <span className="font-mono text-sm uppercase tracking-[0.14em]">{label}</span>
        </div>
        {children}
      </Container>
    </section>
  );
}

function Field({ term, value, mono }: { term: string; value: string; mono?: boolean }) {
  return (
    <div className="border-b border-line p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <dt className="label-mono text-ink-soft">{term}</dt>
      <dd className={`mt-2 text-lg text-ink ${mono ? "font-mono tracking-[0.08em]" : "font-semibold"}`}>
        {value}
      </dd>
    </div>
  );
}

function Actions() {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
      <ButtonLink href="/verify" variant="dark">
        Check another
      </ButtonLink>
      <ButtonLink href="/contact" variant="ghost">
        Contact SierraZim
      </ButtonLink>
    </div>
  );
}
