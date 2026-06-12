import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const RATIO = 348 / 288;

export function Logo({
  height = 44,
  withWordmark = true,
  className,
  name = "SierraZim Training Academy",
}: {
  height?: number;
  withWordmark?: boolean;
  className?: string;
  name?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${name} — home`}
      className={cn("inline-flex items-center gap-3", className)}
    >
      <Image
        src="/brand/logo.png"
        alt=""
        width={Math.round(height * RATIO)}
        height={height}
        priority
        className="h-auto w-auto"
        style={{ height }}
      />
      {withWordmark && (
        <span className="hidden leading-none sm:block">
          <span className="block font-display text-[1.05rem] font-extrabold tracking-tight text-ink">
            SierraZim
          </span>
          <span className="label-mono block text-[0.6rem] text-ink-soft">
            Training Academy
          </span>
        </span>
      )}
    </Link>
  );
}
