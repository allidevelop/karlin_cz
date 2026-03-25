"use client";

import { Building2 } from "lucide-react";

type Props = {
  text: string;
};

export default function MobileBadge({ text }: Props) {
  return (
    <div className="lg:hidden flex items-center gap-[8px] bg-[#7960a9] border border-[#7960a9] rounded-[10px] px-[25px] py-[13px]">
      <Building2 className="size-[20px] text-[#f0eff0]" />
      <span className="font-clash font-bold text-[14px] text-[#f0eff0] uppercase leading-[20px]">
        {text}
      </span>
    </div>
  );
}
