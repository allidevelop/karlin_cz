"use client";

import { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

type Props = {
  promotions: Array<{
    title: string;
    slug: string;
    description?: string | null;
    discountedPrice?: number | null;
    originalPrice?: number | null;
    badge?: string | null;
    validUntil?: string | null;
  }>;
};

const fallbackPromos = [
  {
    title: "Zimní kompletní péče",
    subtitle: "Ochrana vozu před zimou",
    description: "Kompletní mytí + ochrana laku + ošetření podvozku proti korozi",
    price: 1750,
    originalPrice: 2500,
    badge: "Nejlepší nabídka",
    validUntil: "31.3.2026",
    image: "/images/promo-winter.png",
    slug: "zimni-kompletni-pece",
  },
  {
    title: "Zimní kompletní péče",
    subtitle: "Ochrana vozu před zimou",
    description: "Kompletní mytí + ochrana laku + ošetření podvozku proti korozi",
    price: 1750,
    originalPrice: 2500,
    badge: "Premium",
    validUntil: "31.3.2026",
    image: "/images/promo-winter.png",
    slug: "zimni-kompletni-pece-2",
  },
  {
    title: "Zimní kompletní péče",
    subtitle: "Ochrana vozu před zimou",
    description: "Kompletní mytí + ochrana laku + ošetření podvozku proti korozi",
    price: 1750,
    originalPrice: 2500,
    badge: "Premium",
    validUntil: "31.3.2026",
    image: "/images/promo-winter.png",
    slug: "zimni-kompletni-pece-3",
  },
  {
    title: "Zimní kompletní péče",
    subtitle: "Ochrana vozu před zimou",
    description: "Kompletní mytí + ochrana laku + ošetření podvozku proti korozi",
    price: 1750,
    originalPrice: 2500,
    badge: "Populární",
    validUntil: "31.3.2026",
    image: "/images/promo-winter.png",
    slug: "zimni-kompletni-pece-4",
  },
];

const arrowBtnClass =
  "flex items-center justify-center w-12 h-12 rounded-[10px] border-2 border-[#b1b3b6] bg-[#f0eff0] text-[#302e2f] transition-all hover:border-[#7960a9] hover:text-[#7960a9] hover:shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)]";

export default function PromotionsSection({ promotions: _promotions }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 2 },
    },
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const promos = fallbackPromos;

  return (
    <section className="pb-[25px]">
      {/* Header inside container */}
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[30px] gap-4">
          <div>
            <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
              Exkluzivní akce
            </h2>
            <p className="font-clash font-medium text-[15.1px] lg:text-[36px] text-[#302e2f] leading-[24px] lg:leading-normal mt-1 lg:mt-0">
              Využijte naše časově omezené nabídky
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              aria-label="Předchozí"
              className={arrowBtnClass}
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Další"
              className={arrowBtnClass}
            >
              <ChevronRight className="size-6" />
            </button>
            <Link
              href="/akce"
              className="hidden lg:inline-flex items-center gap-2 bg-[#302e2f] border border-[#f0eff0] text-[#f0eff0] font-clash font-medium text-[14.6px] leading-[24px] rounded-[10px] px-6 py-3 hover:opacity-90 transition-opacity ml-2"
            >
              Všechny akce
              <ArrowRight className="size-[18px]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel breaks out to right edge */}
      <div className="pl-4 lg:pl-[max(32px,calc((100vw-1536px)/2+32px))]">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4 lg:gap-[48px]">
            {promos.map((promo, i) => (
              <div
                key={`${promo.slug}-${i}`}
                className="min-w-0 shrink-0 grow-0 basis-[348px] lg:basis-[400px]"
              >
                <div className="relative rounded-[10px] overflow-hidden border border-[#b1b3b6] bg-[#f0eff0] h-[549px]">
                  {/* Badge — Dynamic Island shape */}
                  {promo.badge && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                      <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] backdrop-blur-[7.5px] text-[#f0eff0] font-clash font-bold text-[16px] leading-[20px] rounded-b-[20px] px-6 py-3">
                        {promo.badge}
                      </span>
                    </div>
                  )}

                  {/* Top: Image */}
                  <div className="relative h-[256px] overflow-hidden">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[rgba(48,46,47,0.5)]" />
                    {/* Title overlay on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-2">
                      <h3 className="font-clash font-bold text-[26px] lg:text-[32px] text-[#f0eff0] uppercase text-center leading-[30px]">
                        {promo.title}
                      </h3>
                      <p className="font-clash font-medium text-[16px] text-[#f0eff0] text-center leading-[20px]">
                        {promo.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Content */}
                  <div className="p-6 h-[292px] flex flex-col gap-4">
                    {/* Description */}
                    <p className="font-clash font-medium text-[16px] text-[#302e2f] leading-normal line-clamp-2">
                      {promo.description}
                    </p>

                    {/* Prices */}
                    <div className="border-b border-[#f0eff0] pb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-clash font-bold text-[32px] leading-[40px] text-[#7960a9]">
                          {promo.price}
                        </span>
                        <span className="font-clash font-normal text-[18px] text-[#7960a9]">
                          Kč
                        </span>
                        <span className="font-clash font-medium text-[24px] leading-[40px] text-[#b1b3b6] line-through ml-2">
                          {promo.originalPrice}
                        </span>
                        <span className="font-clash font-normal text-[16px] text-[#b1b3b6] line-through">
                          Kč
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/akce/${promo.slug}`}
                      className="flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[14.8px] uppercase leading-[24px] rounded-[10px] px-6 py-4 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity"
                    >
                      Zobrazit detail
                    </Link>

                    {/* Validity */}
                    {promo.validUntil && (
                      <p className="font-clash font-medium text-[14px] text-[#302e2f] text-center leading-[20px]">
                        Platí do {promo.validUntil}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile "All promotions" button */}
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="lg:hidden mt-6">
          <Link
            href="/akce"
            className="flex items-center justify-center gap-2 bg-[#302e2f] text-[#f0eff0] font-clash font-medium text-[14.6px] leading-[24px] rounded-[10px] px-6 py-4 w-full hover:opacity-90 transition-opacity"
          >
            Všechny akce
            <ArrowRight className="size-[18px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
