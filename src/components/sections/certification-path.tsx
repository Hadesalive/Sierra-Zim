import type { Icon } from "@phosphor-icons/react";
import {
  ChalkboardTeacherIcon,
  SteeringWheelIcon,
  GaugeIcon,
  CertificateIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { sectionToneClass, type SectionTone } from "@/lib/section";
import { cn } from "@/lib/utils";

type Step = { title: string; body: string; icon: Icon };

const steps: Step[] = [
  {
    title: "Classroom & theory",
    body: "Road-safety rules, regulations, pre-start checks and vehicle knowledge, taught orally and theoretically.",
    icon: ChalkboardTeacherIcon,
  },
  {
    title: "Practical training",
    body: "Hands-on vehicle control and the technical driving and operating skills for each vehicle class.",
    icon: SteeringWheelIcon,
  },
  {
    title: "Skills assessment",
    body: "Technical skills are assessed against high international standards before anyone progresses.",
    icon: GaugeIcon,
  },
  {
    title: "Certification",
    body: "Issued only when a candidate has fully completed the programme and passed theory and practical.",
    icon: CertificateIcon,
  },
];

export function CertificationPath({ tone = "tint" }: { tone?: SectionTone }) {
  return (
    <section className={cn("border-y border-line", sectionToneClass[tone])}>
      <Container className="py-16 lg:py-24">
        <div className="max-w-3xl">
          <Eyebrow index="03">The certification path</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl">
            From classroom to certificate — nothing skipped.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Every SierraZim driver and operator follows the same disciplined route.
            Certification is earned, not handed out.
          </p>
        </div>

        <div className="relative mt-14">
          {/* connector */}
          <div
            className="rule-road pointer-events-none absolute left-0 right-0 top-7 hidden lg:block"
            aria-hidden
          />
          <ol className="grid gap-px border-t border-l border-line lg:grid-cols-4 lg:gap-0 lg:border-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
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
