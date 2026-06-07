import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  ChatCircleDotsIcon,
} from "@phosphor-icons/react/dist/ssr";
import { services } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ServiceLedger({
  className,
  withPromo = true,
}: {
  className?: string;
  withPromo?: boolean;
}) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {services.map((service, i) => {
        const Icon = service.icon;
        return (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/40 via-ink/0 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-2.5 py-1 label-mono text-ink backdrop-blur">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-forest-700 text-paper shadow-lg ring-1 ring-paper/20">
                <Icon weight="bold" className="size-5" />
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <h3 className="font-display text-xl font-bold leading-tight text-ink">
                {service.title}
              </h3>
              <p className="mt-2.5 flex-1 text-[0.92rem] leading-relaxed text-ink-soft">
                {service.short}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest-700 transition-colors group-hover:text-forest-600">
                View programme
                <ArrowUpRightIcon
                  weight="bold"
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
          </Link>
        );
      })}

      {withPromo && (
        <Link
          href="/contact"
          className="group flex flex-col justify-between gap-8 rounded-2xl bg-forest-950 p-7 text-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 lg:col-span-2 lg:flex-row lg:items-end lg:justify-between"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-safety-500 text-ink">
            <ChatCircleDotsIcon weight="bold" className="size-6" />
          </span>
          <div>
            <p className="label-mono text-safety-400">Not sure which programme?</p>
            <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-paper">
              Tell us your fleet and we&apos;ll build the training plan.
            </h3>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-paper transition-colors group-hover:text-safety-400">
              Talk to us
              <ArrowUpRightIcon
                weight="bold"
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </Link>
      )}
    </div>
  );
}
