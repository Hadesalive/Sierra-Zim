import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "ghost";

const base =
  "group inline-flex items-center gap-2.5 font-mono text-[0.78rem] uppercase tracking-[0.16em] transition-colors duration-200";

const variants: Record<Variant, string> = {
  primary:
    "bg-safety-500 px-6 py-3.5 text-ink hover:bg-safety-400 border border-ink/10",
  dark: "bg-forest-800 px-6 py-3.5 text-paper hover:bg-forest-700",
  ghost:
    "px-1 py-1.5 text-ink underline decoration-line-strong decoration-2 underline-offset-[6px] hover:decoration-safety-500",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  withArrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  withArrow?: boolean;
}) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const content = (
    <>
      <span>{children}</span>
      {withArrow && (
        <ArrowUpRightIcon
          weight="bold"
          className="size-[1.05em] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} className={cn(base, variants[variant], className)}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {content}
    </Link>
  );
}
