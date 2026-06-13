import Image from "next/image";
import { getValueProps, getHome } from "@/lib/content";
import { valuePropIcon } from "@/lib/icons";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button-link";
import { sectionToneClass, type SectionTone } from "@/lib/section";
import { cn } from "@/lib/utils";

export async function WhyUs({ tone = "white" }: { tone?: SectionTone }) {
  const [valueProps, home] = await Promise.all([getValueProps(), getHome()]);
  return (
    <section className={cn("border-b border-line", sectionToneClass[tone])}>
      <Container className="grid gap-12 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:py-24">
        {/* Left — heading */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow index="04">{home.whyUsEyebrow}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl">
            {home.whyUsHeading}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            {home.whyUsIntro}
          </p>
          <div className="mt-8">
            <ButtonLink href="/about" variant="ghost">
              More about us
            </ButtonLink>
          </div>

          <div className="relative mt-10 hidden overflow-hidden rounded-2xl shadow-lg lg:block">
            <div className="relative aspect-4/3">
              <Image
                src={home.whyUsImage || "/gallery/graduation-certificates.jpg"}
                alt="SierraZim graduates holding their completion certificates"
                fill
                sizes="40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-forest-950/60 via-transparent to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-4 font-display text-lg font-bold text-paper">
                {home.whyUsImageCaption}
              </p>
            </div>
          </div>
        </div>

        {/* Right — value list */}
        <ol className="border-t border-line">
          {valueProps.map((vp, i) => {
            const Icon = valuePropIcon(vp.slug);
            return (
              <li
                key={vp.title}
                className="flex gap-6 border-b border-line py-8 sm:gap-9"
              >
                <span className="label-mono pt-1.5 text-safety-600">
                  0{i + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold text-ink">
                    {vp.title}
                  </h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
                    {vp.description}
                  </p>
                </div>
                <Icon
                  weight="light"
                  className="hidden size-12 shrink-0 text-forest-700 sm:block"
                />
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
