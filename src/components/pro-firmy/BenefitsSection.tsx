"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Clock, BadgePercent, Shield, UserCheck, Award, Users, Handshake } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  whyUsTitle: string;
  whyUsSubtitle: string;
  flexibleSlotsTitle: string;
  flexibleSlotsDesc: string;
  goodPricesTitle: string;
  goodPricesDesc: string;
  premiumCareTitle: string;
  premiumCareDesc: string;
  personalManagerTitle: string;
  personalManagerDesc: string;
  verifiedQualityTitle: string;
  verifiedQualityDesc: string;
  individualApproachTitle: string;
  individualApproachDesc: string;
  reliablePartnerTitle: string;
  reliablePartnerDesc: string;
};

const arrowBtnClass =
  "flex items-center justify-center w-12 h-12 rounded-[10px] border-2 border-[#b1b3b6] bg-[#f0eff0] text-[#302e2f] transition-all hover:border-[#7960a9] hover:text-[#7960a9] hover:shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)]";

export default function BenefitsSection({
  whyUsTitle,
  whyUsSubtitle,
  flexibleSlotsTitle,
  flexibleSlotsDesc,
  goodPricesTitle,
  goodPricesDesc,
  premiumCareTitle,
  premiumCareDesc,
  personalManagerTitle,
  personalManagerDesc,
  verifiedQualityTitle,
  verifiedQualityDesc,
  individualApproachTitle,
  individualApproachDesc,
  reliablePartnerTitle,
  reliablePartnerDesc,
}: Props) {
  const benefits: { icon: LucideIcon; title: string; description: string }[] = [
    { icon: Clock, title: flexibleSlotsTitle, description: flexibleSlotsDesc },
    { icon: BadgePercent, title: goodPricesTitle, description: goodPricesDesc },
    { icon: Shield, title: premiumCareTitle, description: premiumCareDesc },
    { icon: UserCheck, title: personalManagerTitle, description: personalManagerDesc },
    { icon: Award, title: verifiedQualityTitle, description: verifiedQualityDesc },
    { icon: Users, title: individualApproachTitle, description: individualApproachDesc },
    { icon: Handshake, title: reliablePartnerTitle, description: reliablePartnerDesc },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 2 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  return (
    <section className="py-[40px] lg:py-[80px]">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        {/* Header + arrows */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[30px] gap-4">
          <div className="text-center lg:text-left">
            <h2 className="font-clash font-bold text-[36px] lg:text-[48px] text-[#302e2f] leading-[40px] lg:leading-[48px]">
              {whyUsTitle}
            </h2>
            <p className="font-clash font-medium text-[16px] lg:text-[20px] text-[#302e2f] leading-[28px] mt-3 max-w-[768px]">
              {whyUsSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 justify-center lg:justify-end">
            <button onClick={scrollPrev} aria-label="Previous" className={arrowBtnClass}>
              <ChevronLeft className="size-6" />
            </button>
            <button onClick={scrollNext} aria-label="Next" className={arrowBtnClass}>
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={emblaRef}
          className="overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)",
          }}
        >
          <div className="flex gap-4 lg:gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="min-w-0 shrink-0 grow-0 basis-[240px] sm:basis-[280px] lg:basis-[320px]"
                >
                  <div className="card-hover-tint relative bg-[#f0eff0] border border-[#b1b3b6] backdrop-blur-[2px] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden p-[21px] lg:p-[33px] flex flex-col items-center text-center h-full transition-all duration-300 hover:border-[#7960a9] hover:shadow-[0_0_30px_-5px_rgba(121,96,169,0.3)]">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-[48px] lg:w-[64px] h-[48px] lg:h-[64px] rounded-[10px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4]">
                      <Icon className="size-[25px] lg:size-[32px] text-[#f0eff0]" />
                    </div>

                    {/* Title */}
                    <h3 className="font-clash font-bold text-[18px] lg:text-[24px] text-[#302e2f] leading-[24px] lg:leading-[32px] mt-[16px] lg:mt-[24px]">
                      {benefit.title}
                    </h3>

                    {/* Description */}
                    <p className="font-clash font-medium text-[13px] lg:text-[15px] text-[#302e2f] leading-[22px] lg:leading-[26px] mt-[12px]">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
