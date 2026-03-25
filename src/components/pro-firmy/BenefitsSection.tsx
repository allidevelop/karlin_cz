"use client";

import {
  Clock,
  BadgePercent,
  Shield,
  UserCheck,
  Award,
  Users,
  Handshake,
} from "lucide-react";
import BenefitCard from "./BenefitCard";
import BenefitsCarousel from "./BenefitsCarousel";

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
  const benefitsRow1 = [
    {
      icon: Clock,
      title: flexibleSlotsTitle,
      description: flexibleSlotsDesc,
    },
    {
      icon: BadgePercent,
      title: goodPricesTitle,
      description: goodPricesDesc,
    },
    {
      icon: Shield,
      title: premiumCareTitle,
      description: premiumCareDesc,
    },
    {
      icon: UserCheck,
      title: personalManagerTitle,
      description: personalManagerDesc,
    },
  ];

  const benefitsRow2 = [
    {
      icon: Award,
      title: verifiedQualityTitle,
      description: verifiedQualityDesc,
    },
    {
      icon: Users,
      title: individualApproachTitle,
      description: individualApproachDesc,
    },
    {
      icon: Handshake,
      title: reliablePartnerTitle,
      description: reliablePartnerDesc,
    },
  ];

  return (
    <section className="pt-[25px]">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        {/* py-20 wrapper matching Figma */}
        <div className="py-[80px]">
          <div className="flex flex-col gap-[64px]">
            {/* Heading */}
            <div className="flex flex-col items-center gap-[24px] text-center">
              <h2 className="font-clash font-bold text-[36px] lg:text-[48px] text-[#302e2f] leading-[40px] lg:leading-[48px]">
                {whyUsTitle}
              </h2>
              <p className="font-clash font-medium text-[19px] lg:text-[20px] text-[#302e2f] leading-[28px] max-w-[768px]">
                {whyUsSubtitle}
              </p>
            </div>

            {/* Row 1 — 4 smaller benefit cards (2x2 on mobile, 4-col on desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] lg:gap-[32px]">
              {benefitsRow1.map((benefit) => (
                <BenefitCard
                  key={benefit.title}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 — 3 larger benefit cards (horizontal carousel with gradient fade) */}
        <div className="pb-[80px]">
          <BenefitsCarousel benefits={benefitsRow2} />
        </div>
      </div>
    </section>
  );
}
