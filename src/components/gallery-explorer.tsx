"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MagnifyingGlassPlusIcon } from "@phosphor-icons/react/dist/ssr";
import { GalleryVideo } from "@/components/gallery-video";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import type { GalleryCategory, GalleryImage, GalleryItem } from "@/lib/site";

/**
 * Client gallery: category filter tabs + a dense mosaic grid. Images open in a
 * full-screen lightbox; videos play inline (they are excluded from the lightbox
 * set). Spans are recomputed over the filtered list so the mosaic stays dense.
 */

// Filter order + human labels. Only categories that actually have items render.
const CATEGORIES: { key: GalleryCategory; label: string }[] = [
  { key: "classroom", label: "Classroom & Theory" },
  { key: "light-vehicle", label: "Light Vehicle" },
  { key: "heavy-equipment", label: "Heavy Equipment" },
  { key: "simulator", label: "Simulator" },
  { key: "certification", label: "Certification" },
  { key: "projects", label: "Projects & Events" },
  { key: "testimonials", label: "Testimonials" },
];

// Dense-mosaic span rhythm (col, row) cycled by index — feature tiles at 0 & 7.
const SPANS: [number, number][] = [
  [2, 2], [2, 1], [1, 1], [1, 1], [2, 1], [1, 1],
  [1, 1], [2, 2], [1, 1], [1, 1], [1, 1], [1, 1],
];

const isImage = (item: GalleryItem): item is GalleryImage =>
  item.type !== "video";

type Filter = GalleryCategory | "all";

export function GalleryExplorer({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Which category tabs to show, with counts, based on the full item set.
  const tabs = useMemo(() => {
    const counts = new Map<GalleryCategory, number>();
    for (const it of items) {
      if (it.category) counts.set(it.category, (counts.get(it.category) ?? 0) + 1);
    }
    const present = CATEGORIES.filter((c) => (counts.get(c.key) ?? 0) > 0).map(
      (c) => ({ key: c.key as Filter, label: c.label, count: counts.get(c.key)! }),
    );
    return [{ key: "all" as Filter, label: "All", count: items.length }, ...present];
  }, [items]);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((it) => it.category === filter)),
    [items, filter],
  );

  // The lightbox set: images from the filtered list, in display order.
  const images = useMemo(() => filtered.filter(isImage), [filtered]);

  // Map each image back to its position within `images` for the click handler.
  const imageIndex = useMemo(() => {
    const m = new Map<GalleryItem, number>();
    let n = 0;
    for (const it of filtered) if (isImage(it)) m.set(it, n++);
    return m;
  }, [filtered]);

  const selectFilter = (next: Filter) => {
    setLightboxIndex(null);
    setFilter(next);
  };

  return (
    <>
      {/* Filter tabs — horizontally scrollable on small screens, never wrapping. */}
      <div className="border-b border-line bg-paper">
        <div
          role="group"
          aria-label="Filter gallery by category"
          className="no-scrollbar mx-auto flex w-full max-w-[90rem] gap-2 overflow-x-auto px-4 py-4 sm:px-6"
        >
          {tabs.map((t) => {
            const active = filter === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => selectFilter(t.key)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "border-safety-400 bg-safety-400 text-forest-950"
                    : "border-line-strong text-forest-950/60 hover:border-forest-950/40 hover:text-forest-950"
                }`}
              >
                {t.label}
                <span className={active ? "text-forest-950/60" : "text-forest-950/35"}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dense mosaic — spans recomputed over the filtered list. */}
      <div className="grid grid-cols-2 gap-1 p-1 [grid-auto-flow:dense] [grid-auto-rows:240px] lg:grid-cols-4 lg:[grid-auto-rows:300px]">
        {filtered.map((item, i) => {
          const [col, row] = SPANS[i % SPANS.length];
          const spanCls = `${col === 2 ? "col-span-2" : ""} ${row === 2 ? "lg:row-span-2" : ""}`;
          return (
            <figure
              key={(item.type === "video" ? item.poster : item.src) || i}
              className={`gal-tile group relative m-0 overflow-hidden ${spanCls}`}
            >
              {item.type === "video" ? (
                <GalleryVideo item={item} />
              ) : (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(imageIndex.get(item) ?? 0)}
                  aria-label={`Enlarge image: ${item.alt || item.caption || "gallery image"}`}
                  className="absolute inset-0 h-full w-full cursor-zoom-in"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden
                    className="absolute right-2.5 top-2.5 flex size-9 items-center justify-center bg-safety-400 text-forest-950 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <MagnifyingGlassPlusIcon weight="bold" className="size-[18px]" />
                  </span>
                </button>
              )}
              {item.caption && (
                <figcaption className="pointer-events-none absolute bottom-0 left-0 flex items-center gap-2.5 bg-forest-950 px-3.5 py-2 text-white">
                  <span aria-hidden className="h-0.5 w-3 bg-safety-400" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                    {item.caption}
                  </span>
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {lightboxIndex !== null && images.length > 0 && (
        <GalleryLightbox
          images={images}
          index={Math.min(lightboxIndex, images.length - 1)}
          onIndex={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
