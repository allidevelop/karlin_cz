"use client";

import { LucideIcon } from "lucide-react";

type BenefitCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function BenefitCard({ icon: Icon, title, description }: BenefitCardProps) {
  return (
    <div className="group relative bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden p-[21px] lg:p-[33px] flex flex-col items-center text-center gap-[11px] lg:gap-0">
      {/* Hover glow */}
      <div className="absolute top-0 right-0 w-[96px] lg:w-[128px] h-[96px] lg:h-[128px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-full blur-[20px] opacity-0 group-hover:opacity-10 transition-opacity" />

      <div className="relative flex flex-col items-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-[48px] lg:w-[64px] h-[48px] lg:h-[64px] rounded-[10px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4]">
          <Icon className="size-[25px] lg:size-[32px] text-[#f0eff0]" />
        </div>

        {/* Title */}
        <h3 className="font-clash font-bold text-[20px] text-[#302e2f] leading-[20px] lg:leading-[28px] mt-[11px] lg:mt-[24px]">
          {title}
        </h3>

        {/* Description */}
        <p className="font-clash font-medium text-[12px] lg:text-[15px] text-[#302e2f] leading-normal lg:leading-[26px] mt-[11px] lg:mt-[12px]">
          {description}
        </p>
      </div>
    </div>
  );
}
