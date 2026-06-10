import {
  ChalkboardTeacherIcon,
  SteeringWheelIcon,
  GaugeIcon,
  CertificateIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getHome } from "@/lib/content";
import { sectionToneClass, type SectionTone } from "@/lib/section";
import { cn } from "@/lib/utils";

// Icons stay in code, applied to the CMS steps by position.
const stepIcons = [
  ChalkboardTeacherIcon,
  SteeringWheelIcon,
  GaugeIcon,
  CertificateIcon,
];

export async function CertificationPath({ tone = "tint" }: { tone?: SectionTone }) {
  const home = await getHome();
  return (
    <section className={cn("border-y border-line", sectionToneClass[tone])}>
      <Container className="py-16 lg:py-24">
        <div className="max-w-3xl">
          <Eyebrow index="03">{home.certPathEyebrow}</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl">
            {home.certPathHeading}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            {home.certPathIntro}
          </p>
        </div>

        <div className="relative mt-14">
          <div
            className="rule-road pointer-events-none absolute left-0 right-0 top-7 hidden lg:block"
            aria-hidden
          />
          <ol className="grid gap-px border-t border-l border-line lg:grid-cols-4 lg:gap-0 lg:border-0">
            {home.certPathSteps.map((step, i) => {
              const Icon = stepIcons[i] ?? CertificateIcon;
              return (
                <li
                  key={step.title}
                  className="relative border-b border-r border-line bg-paper-2 p-7 lg:border-0 lg:bg-transparent lg:p-0 lg:pr-8"
                >
                  <div className="flex items-center justify-center bg-safety-500 text-ink lg:size-14">
                    <div className="flex items-center gap-3 px-3 py-2 lg:flex-col lg:gap-0 lg:px-0 lg:py-0">
                      <span className="font-display text-lg font-bold lg:hidden">
                        0{i + 1}
                      </span>
                      <Icon weight="bold" className="size-6" />
                    </div>
                  </div>
                  <span className="label-mono mt-5 hidden text-safety-600 lg:block">
                    Step 0{i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
