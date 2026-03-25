"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Benefit = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type Props = {
  benefits: Benefit[];
};

export default function BenefitsCarousel({ benefits }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 1 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Navigation arrows positioned absolutely */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 pointer-events-none">
        <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px] flex items-center justify-between">
          <button
            onClick={scrollPrev}
            aria-label="Předchozí"
            disabled={!canScrollPrev}
            className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-[10px] border border-[#b1b3b6] bg-[#f0eff0] text-[#302e2f] shadow-md transition-all hover:border-[#7960a9] hover:text-[#7960a9] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Další"
            disabled={!canScrollNext}
            className="pointer-events-auto flex items-center justify-center w-12 h-12 rounded-[10px] border border-[#b1b3b6] bg-[#f0eff0] text-[#302e2f] shadow-md transition-all hover:border-[#7960a9] hover:text-[#7960a9] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      </div>

      {/* Carousel container */}
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div
          ref={emblaRef}
          className="overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)",
          }}
        >
          <div className="flex gap-[16px] lg:gap-[32px]">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="min-w-0 shrink-0 grow-0 basis-[280px] lg:basis-[400px]"
              >
                <div className="relative bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden p-[33px] flex flex-col items-center text-center gap-[20px] h-full">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-[64px] h-[64px] rounded-[10px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4]">
                    <benefit.icon className="size-[32px] text-[#f0eff0]" />
                  </div>

                  {/* Title */}
                  <h3 className="font-clash font-bold text-[24px] text-[#302e2f] leading-[32px]">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="font-clash font-medium text-[15px] text-[#302e2f] leading-[26px]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
