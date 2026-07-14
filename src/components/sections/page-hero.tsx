import Image from "next/image";
import type { ReactNode } from "react";

type Spec = { accent: string; rest: string };

/**
 * v2 page hero — dark forest surface, mono eyebrow with amber tick, a big
 * stacked condensed headline and intro. Two shapes:
 *  - stacked (default): full-width; optional dashed-top "pipeline" spec row.
 *  - split (pass `image`): copy left, hazard-edged field photo right.
 * Entrance staggers with the `.rise` keyframe (off under reduced-motion).
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  captionLeft,
  captionRight,
  specs,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  image?: string;
  imageAlt?: string;
  captionLeft?: string;
  captionRight?: string;
  specs?: Spec[];
}) {
  const eyebrowEl = (
    <p className="rise flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.24em] text-white/65">
      <span aria-hidden className="size-2 shrink-0 bg-safety-400" />
      {eyebrow}
    </p>
  );

  // fontSize is set inline (literal clamp) rather than via a Tailwind utility:
  // Turbopack dev is unreliable at generating just-edited theme/arbitrary
  // utilities, which left heroes tiny. Inline never touches the CSS pipeline.
  const renderTitle = (fontSize: string) => (
    <h1
      className="rise font-display font-extrabold uppercase leading-[0.86] tracking-[0.005em]"
      style={{ animationDelay: "0.08s", fontSize }}
    >
      {title}
    </h1>
  );

  if (image) {
    // Split layout (About)
    return (
      <section className="bg-forest-950 overflow-hidden text-white">
        <div aria-hidden className="hazard h-3.5" />
        <div className="grid lg:min-h-[62vh] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center px-6 py-20 sm:px-14 sm:py-24">
            <div className="mb-6">{eyebrowEl}</div>
            {renderTitle("clamp(48px, 6.4vw, 104px)")}
            {intro && (
              <p
                className="rise mt-8 max-w-[520px] text-lg leading-[1.6] text-white/80"
                style={{ animationDelay: "0.16s" }}
              >
                {intro}
              </p>
            )}
          </div>
          <div className="relative min-h-[46vh] lg:min-h-0">
            <span aria-hidden className="hazard absolute inset-y-0 left-0 z-[2] w-4" />
            <Image
              src={image}
              alt={imageAlt || ""}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(4,37,15,0.55), transparent 45%)",
              }}
            />
            {(captionLeft || captionRight) && (
              <div className="absolute inset-x-0 bottom-0 left-4 flex items-baseline justify-between px-7 py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/85">
                <span>{captionLeft}</span>
                <span className="hidden sm:inline">{captionRight}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Stacked layout (Training / Work / Gallery / Contact)
  return (
    <section className="bg-forest-950 text-white">
      <div aria-hidden className="hazard h-3.5" />
      <div className="mx-auto w-full max-w-[90rem] px-6 pb-24 pt-28 sm:px-14">
        <div className="mb-6">{eyebrowEl}</div>
        {renderTitle("clamp(56px, 8vw, 132px)")}

        {specs ? (
          <div
            className="rise mt-10 flex flex-wrap items-end justify-between gap-x-12 gap-y-6"
            style={{ animationDelay: "0.16s" }}
          >
            {intro && (
              <p className="max-w-[560px] text-lg leading-[1.6] text-white/80">
                {intro}
              </p>
            )}
            <dl className="flex flex-wrap gap-x-10 gap-y-3 border-t-2 border-dashed border-white/25 pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
              {specs.map((s) => (
                <div key={s.accent} className="flex gap-2">
                  <dt className="text-safety-400">{s.accent}</dt>
                  <dd>{s.rest}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          intro && (
            <p
              className="rise mt-9 max-w-[560px] text-lg leading-[1.6] text-white/80"
              style={{ animationDelay: "0.16s" }}
            >
              {intro}
            </p>
          )
        )}
      </div>
    </section>
  );
}
