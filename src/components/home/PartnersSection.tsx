"use client";

import { useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Partner = {
  name: string;
  website?: string | null;
  logoUrl?: string | null;
};

type Props = {
  partners: Partner[];
  cmsTitle?: string | null;
  cmsSubtitle?: string | null;
};

const fallbackLogos = [
  "/images/partner-am-1.png",
  "/images/partner-am-2.png",
];

const arrowBtnClass =
  "flex items-center justify-center w-12 h-12 rounded-[10px] border-2 border-[#b1b3b6] bg-[#f0eff0] text-[#302e2f] transition-all hover:border-[#7960a9] hover:text-[#7960a9] hover:shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)]";

export default function PartnersSection({ partners, cmsTitle, cmsSubtitle }: Props) {
  const t = useTranslations();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 2,
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 4 },
    },
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <section id="partners" className="pt-[25px] pb-[25px]">
      {/* Header inside container */}
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 gap-4">
          <div className="text-center lg:text-left">
            <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
              {t("partners.title")}
            </h2>
            <p className="font-clash font-medium text-[15.1px] lg:text-[36px] text-[#302e2f] leading-[24px] lg:leading-normal mt-1 lg:mt-0">
              {t("partners.subtitle")}
            </p>
          </div>
          <div className="flex items-center justify-center lg:justify-end gap-2">
            <button
              onClick={scrollPrev}
              aria-label={t("partners.prevPartner")}
              className={arrowBtnClass}
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={scrollNext}
              aria-label={t("partners.nextPartner")}
              className={arrowBtnClass}
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel contained in container */}
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div
          ref={emblaRef}
          className="overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)",
          }}
        >
          <div className="flex gap-4">
            {partners.map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="min-w-0 shrink-0 grow-0 basis-[133px] lg:basis-[220px]"
              >
                <div className="rounded-[6px] border border-[#b1b3b6]/60 p-[14.5px] lg:p-6 shadow-[0px_2.4px_3.6px_-2.4px_rgba(0,0,0,0.1)] bg-[#f0eff0] flex flex-col items-center justify-center h-[97px] lg:h-[160px]">
                  <Image
                    src={partner.logoUrl || fallbackLogos[i % fallbackLogos.length]}
                    alt={partner.name}
                    width={170}
                    height={110}
                    className="object-contain max-h-[66px] lg:max-h-[110px] max-w-[103px] lg:max-w-[170px]"
                  />
                </div>
                <div className="mt-2 lg:mt-3 text-center">
                  <span className="font-clash font-bold text-[9.7px] lg:text-[16px] leading-[14.5px] lg:leading-[24px] text-[#302e2f]">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
