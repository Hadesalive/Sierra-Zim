"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { ProgrammeItem } from "@/lib/content";

export function ServiceCarousel({
  programmes,
}: {
  programmes: ProgrammeItem[];
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.clientWidth + 32 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <section className="overflow-x-clip border-b border-line bg-paper py-16 lg:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <Eyebrow index="02">Programmes</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-ink sm:text-5xl">
              Training for every class of vehicle.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Seven specialised programmes — each pairing classroom theory with
              practical, on-vehicle training and ending in certification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous programmes"
              className="flex size-12 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink/40 hover:bg-ink/[0.04]"
            >
              <ArrowLeftIcon weight="bold" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next programmes"
              className="flex size-12 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink/40 hover:bg-ink/[0.04]"
            >
              <ArrowRightIcon weight="bold" className="size-5" />
            </button>
          </div>
        </div>

        {/* Rail: left edge aligns with the heading (inside the container); the
            right edge bleeds to the viewport so cards scroll all the way out. */}
        <div
          ref={scroller}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [margin-right:calc(50%_-_50vw)] lg:gap-8"
        >
          {programmes.map((service) => (
            <article
              key={service.slug}
              className="group w-[80vw] shrink-0 snap-start sm:w-[440px] lg:w-[520px]"
            >
              <Link href={`/services/${service.slug}`} className="block">
                <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 640px) 80vw, 520px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-6 text-lg leading-relaxed text-ink-soft">
                  <span className="font-semibold text-ink">{service.title}.</span>{" "}
                  {service.short}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
