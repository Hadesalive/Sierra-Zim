"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon } from "@phosphor-icons/react/dist/ssr";
import type { GalleryVideoItem } from "@/lib/site";

/**
 * A gallery video. Self-hosted MP4s use the native <video> player. YouTube/Vimeo
 * use a lightweight click-to-play facade (poster only) so the heavy third-party
 * iframe is never loaded until the visitor actually presses play.
 */
export function GalleryVideo({ item }: { item: GalleryVideoItem }) {
  const [playing, setPlaying] = useState(false);

  if (item.provider === "file") {
    return (
      <video
        controls
        preload="metadata"
        poster={item.poster}
        playsInline
        aria-label={item.alt}
        className="absolute inset-0 h-full w-full bg-ink object-cover"
      >
        <source src={item.src} type="video/mp4" />
      </video>
    );
  }

  const embedSrc =
    item.provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${item.src}?autoplay=1&rel=0&modestbranding=1`
      : `https://player.vimeo.com/video/${item.src}?autoplay=1`;

  if (playing) {
    return (
      <iframe
        src={embedSrc}
        title={item.alt}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${item.alt}`}
      className="group/v absolute inset-0 h-full w-full cursor-pointer"
    >
      <Image
        src={item.poster}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover/v:scale-[1.04]"
      />
      <span className="absolute inset-0 bg-ink/25 transition-colors group-hover/v:bg-ink/15" />
      <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-safety-500 text-ink shadow-lg transition-transform group-hover/v:scale-110">
        <PlayIcon weight="fill" className="size-7 translate-x-0.5" />
      </span>
    </button>
  );
}
