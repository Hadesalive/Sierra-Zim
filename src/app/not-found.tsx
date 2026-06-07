import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4]" aria-hidden />
      <Container className="relative flex min-h-[60vh] flex-col items-start justify-center py-24">
        <p className="label-mono text-safety-600">Error / 404</p>
        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-ink sm:text-7xl">
          This road isn&apos;t on the map.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
          The page you were looking for doesn&apos;t exist or has moved. Let&apos;s
          get you back on course.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <ButtonLink href="/" variant="primary">
            Back to home
          </ButtonLink>
          <ButtonLink href="/services" variant="ghost">
            View programmes
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
