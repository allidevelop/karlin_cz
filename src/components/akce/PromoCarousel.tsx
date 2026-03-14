"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

type Promotion = {
  title: string;
  slug: string;
  description?: string | null;
  discountedPrice?: number | null;
  originalPrice?: number | null;
  badge?: string | null;
  validTo?: string | null;
  imageUrl?: string | null;
};

type Props = {
  promotions: Promotion[];
};

const formatPrice = (price: number | null | undefined, locale: string) => {
  if (price == null) return null;
  return new Intl.NumberFormat(locale).format(price);
};

const formatDate = (dateStr: string | null | undefined, locale: string) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return null;
  }
};

/** Fallback promo data when CMS returns no promotions */
const fallbackPromos: Promotion[] = [
  {
    title: "Zimní kompletní péče",
    slug: "zimni-kompletni-pece",
    description:
      "Kompletní mytí + ochrana laku + ošetření podvozku proti korozi",
    discountedPrice: 1750,
    originalPrice: 2500,
    badge: "Nejlepší nabídka",
    validTo: "2026-03-31",
    imageUrl: "/images/promo-winter.png",
  },
  {
    title: "Zimní kompletní péče",
    slug: "zimni-kompletni-pece-2",
    description:
      "Kompletní mytí + ochrana laku + ošetření podvozku proti korozi",
    discountedPrice: 1750,
    originalPrice: 2500,
    badge: "Premium",
    validTo: "2026-03-31",
    imageUrl: "/images/promo-winter-2.png",
  },
  {
    title: "Zimní kompletní péče",
    slug: "zimni-kompletni-pece-3",
    description:
      "Kompletní mytí + ochrana laku + ošetření podvozku proti korozi",
    discountedPrice: 1750,
    originalPrice: 2500,
    badge: "Premium",
    validTo: "2026-03-31",
    imageUrl: "/images/promo-winter-3.png",
  },
  {
    title: "Zimní kompletní péče",
    slug: "zimni-kompletni-pece-4",
    description:
      "Kompletní mytí + ochrana laku + ošetření podvozku proti korozi",
    discountedPrice: 1750,
    originalPrice: 2500,
    badge: "Populární",
    validTo: "2026-03-31",
    imageUrl: "/images/promo-winter-4.png",
  },
];

/* ------------------------------------------------------------------ */
/*  Single promo card                                                  */
/* ------------------------------------------------------------------ */

function PromoCard({ promo }: { promo: Promotion }) {
  const locale = useLocale();
  const discounted = formatPrice(promo.discountedPrice, locale);
  const original = formatPrice(promo.originalPrice, locale);
  const validDate = formatDate(promo.validTo, locale);
  const imageSrc = promo.imageUrl || "/images/promo-winter.png";

  return (
    <Link
      href={`/akce/${promo.slug}`}
      className="relative rounded-[10px] overflow-hidden border border-[#b1b3b6] bg-[#f0eff0] h-[549px] flex flex-col group"
    >
      {/* Badge pill — centred on top edge of image */}
      {promo.badge && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-start justify-center">
          <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] backdrop-blur-[7.5px] text-[#f0eff0] font-clash font-bold text-[18px] leading-[24px] rounded-b-full px-6 pb-3 pt-2 whitespace-nowrap">
            {promo.badge}
          </span>
        </div>
      )}

      {/* Image — 256px tall */}
      <div className="relative h-[256px] shrink-0 overflow-hidden">
        <Image
          src={imageSrc}
          alt={promo.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 348px, 400px"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[rgba(48,46,47,0.5)]" />
        {/* Title + subtitle centred at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-2">
          <h3 className="font-clash font-bold text-[26px] lg:text-[32px] text-[#f0eff0] uppercase text-center leading-[30px]">
            {promo.title}
          </h3>
        </div>
      </div>

      {/* Content — fills remaining space */}
      <div className="p-6 flex-1 flex flex-col gap-4 items-center justify-center">
        {/* Description */}
        <p className="font-clash font-medium text-[16px] text-[#302e2f] leading-normal text-center line-clamp-2 w-full">
          {promo.description}
        </p>

        {/* Prices centred with bottom divider */}
        <div className="border-b border-[#f0eff0] pb-4 w-full flex flex-col items-center gap-1">
          {discounted && (
            <div className="flex items-baseline gap-2 justify-center text-[#7960a9]">
              <span className="font-clash font-bold text-[32px] leading-[40px]">
                {discounted}
              </span>
              <span className="font-clash font-normal text-[18px] leading-[28px]">
                Kč
              </span>
            </div>
          )}
          {original && (
            <div className="flex items-baseline gap-2 justify-center text-[#b1b3b6]">
              <span className="font-clash font-medium text-[24px] leading-[40px] line-through decoration-solid">
                {original}
              </span>
              <span className="font-clash font-normal text-[16px] leading-[28px] line-through decoration-solid">
                Kč
              </span>
            </div>
          )}
        </div>

        {/* CTA button — full width purple gradient */}
        <div className="w-full bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-6 py-4 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] group-hover:opacity-90 transition-opacity">
          <span className="flex items-center justify-center font-clash font-bold text-[14.8px] text-[#f0eff0] uppercase leading-[24px]">
            Zobrazit detail
          </span>
        </div>

        {/* Validity text */}
        {validDate && (
          <p className="font-clash font-normal text-[14px] text-[#b1b3b6] text-center leading-[20px]">
            Platí do {validDate}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main carousel component                                            */
/* ------------------------------------------------------------------ */

export default function PromoCarousel({ promotions }: Props) {
  const promos = promotions.length > 0 ? promotions : fallbackPromos;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 2 },
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
    <div className="pt-[25px]">
      {/* Controls row — nav arrows + "Všechny akce" button */}
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="flex items-center justify-center lg:justify-end mb-[30px]">
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              aria-label="Předchozí"
              disabled={!canScrollPrev}
              className="flex items-center justify-center w-12 h-12 rounded-[10px] border border-[#b1b3b6] bg-[#f0eff0] text-[#302e2f] transition-all hover:border-[#7960a9] hover:text-[#7960a9] disabled:opacity-40"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Další"
              disabled={!canScrollNext}
              className="flex items-center justify-center w-12 h-12 rounded-[10px] border border-[#b1b3b6] bg-[#f0eff0] text-[#302e2f] transition-all hover:border-[#7960a9] hover:text-[#7960a9] disabled:opacity-40"
            >
              <ChevronRight className="size-6" />
            </button>
            <Link
              href="/akce"
              className="hidden lg:inline-flex items-center gap-2 bg-[#302e2f] text-[#f0eff0] font-clash font-medium text-[14.6px] leading-[24px] rounded-[10px] px-6 py-3 hover:opacity-90 transition-opacity ml-2"
            >
              Všechny akce
              <ArrowRight className="size-[18px]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel — aligned to container left, overflows right */}
      <div className="pl-4 lg:pl-[max(32px,calc((100vw-1536px)/2+32px))]">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-[24px]">
            {promos.map((promo, i) => (
              <div
                key={`${promo.slug}-${i}`}
                className="min-w-0 shrink-0 grow-0 basis-[348px] lg:basis-[400px]"
              >
                <PromoCard promo={promo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
