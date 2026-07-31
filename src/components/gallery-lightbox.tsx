"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import {
  XIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { GalleryImage } from "@/lib/site";

/**
 * Full-screen image viewer for the gallery. Only images live here (videos play
 * inline in the grid). It is a modal dialog: focus is moved in on open and
 * restored on close, body scroll is locked, Esc closes, ←/→ navigate (wrapping),
 * Tab is trapped to the controls, and clicking the dark backdrop closes.
 *
 * The parent renders this only while open, so the mount/unmount effect doubles
 * as the open/close lifecycle.
 */
export function GalleryLightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: GalleryImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const total = images.length;
  const current = images[index];

  const go = useCallback(
    (dir: 1 | -1) => onIndex((index + dir + total) % total),
    [index, total, onIndex],
  );

  // Lock scroll + manage focus for the lifetime of the open dialog.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Tab") {
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([tabindex="-1"])',
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!current) return null;

  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer — ${current.caption || current.alt || "gallery image"}`}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[100] select-none"
    >
      {/* Backdrop — clicking the dark field closes. Not tabbable. */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close image viewer"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-zoom-out bg-forest-975/97"
      />

      {/* Content overlay — transparent to clicks except the interactive children,
          so empty space falls through to the backdrop above. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col">
        {/* Top bar: counter + close */}
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <span className="pointer-events-auto font-mono text-[12px] uppercase tracking-[0.24em] text-white/70">
            {counter}
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="pointer-events-auto flex size-11 items-center justify-center border border-white/20 bg-forest-975/60 text-white transition-colors hover:border-safety-400 hover:text-safety-400"
          >
            <XIcon weight="bold" className="size-5" />
          </button>
        </div>

        {/* Middle: prev / image / next */}
        <div className="flex flex-1 items-center justify-between gap-2 px-3 sm:px-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="pointer-events-auto flex size-12 shrink-0 items-center justify-center border border-white/20 bg-forest-975/60 text-white transition-colors hover:border-safety-400 hover:text-safety-400 sm:size-14"
          >
            <CaretLeftIcon weight="bold" className="size-6" />
          </button>

          <div className="pointer-events-auto relative flex min-w-0 flex-1 items-center justify-center">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.w}
              height={current.h}
              sizes="100vw"
              priority
              className="h-auto max-h-[74vh] w-auto max-w-full object-contain"
            />
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="pointer-events-auto flex size-12 shrink-0 items-center justify-center border border-white/20 bg-forest-975/60 text-white transition-colors hover:border-safety-400 hover:text-safety-400 sm:size-14"
          >
            <CaretRightIcon weight="bold" className="size-6" />
          </button>
        </div>

        {/* Bottom: caption + alt */}
        <div className="px-5 py-5 sm:px-8 sm:py-6">
          <div className="pointer-events-auto mx-auto max-w-3xl text-center">
            {current.caption && (
              <p className="flex items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white">
                <span aria-hidden className="h-0.5 w-3 bg-safety-400" />
                {current.caption}
              </p>
            )}
            {current.alt && (
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {current.alt}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
