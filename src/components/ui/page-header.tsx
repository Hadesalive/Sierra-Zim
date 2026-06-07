import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

export function PageHeader({
  index,
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  children,
}: {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  image: string;
  imageAlt?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-forest-950 text-paper">
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-forest-950 via-forest-950/70 to-forest-950/35" />
        <div className="absolute inset-0 bg-linear-to-r from-forest-950/80 via-forest-950/25 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-safety-500" aria-hidden />

      <Container className="relative flex min-h-[44svh] flex-col justify-end py-16 lg:min-h-[460px] lg:py-20">
        <Eyebrow index={index} tone="paper">
          {eyebrow}
        </Eyebrow>
        <h1 className="mt-6 max-w-4xl font-display text-[2.6rem] font-extrabold leading-[0.98] tracking-tight text-paper sm:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85">
            {intro}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
