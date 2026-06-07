import { cn } from "@/lib/utils";

/**
 * Recurring "field manual" eyebrow: a short amber tick, an optional index
 * number, and a monospace label. Used to head most sections.
 */
export function Eyebrow({
  children,
  index,
  className,
  tone = "ink",
}: {
  children: React.ReactNode;
  index?: string;
  className?: string;
  tone?: "ink" | "paper";
}) {
  return (
    <div
      className={cn(
        "label-mono flex items-center gap-3",
        tone === "paper" ? "text-paper/80" : "text-ink-soft",
        className,
      )}
    >
      <span className="h-px w-7 bg-safety-500" aria-hidden />
      {index && <span className="text-safety-600">{index}</span>}
      <span>{children}</span>
    </div>
  );
}
