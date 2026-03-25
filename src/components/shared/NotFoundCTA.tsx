"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * "Nenašli jste co hledáte?" CTA box that appears on Služby and Akce pages.
 * Dark box with decorative blur circles and 3 action buttons.
 */
export default function NotFoundCTA({ cmsBookNowButton, cmsCallUsButton }: { cmsBookNowButton?: string | null; cmsCallUsButton?: string | null } = {}) {
  const t = useTranslations();

  return (
    <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px] py-12">
      <div className="relative bg-[#302e2f] rounded-[24px] p-8 lg:p-[48px] overflow-hidden">
        {/* Decorative blur circles */}
        <div className="absolute -top-16 -right-16 w-[256px] h-[256px] rounded-full bg-[#f0eff0]/10 blur-[32px]" />
        <div className="absolute -bottom-16 -left-16 w-[256px] h-[256px] rounded-full bg-[#f0eff0]/10 blur-[32px]" />

        <div className="relative z-10 text-center">
          <h3 className="font-clash font-bold text-[28px] lg:text-[36px] text-white leading-[40px] mb-3">
            {t("notFoundCTA.heading")}
          </h3>
          <p className="font-clash font-medium text-[16px] lg:text-[19.2px] text-white/90 mb-8 max-w-[600px] mx-auto">
            {t("notFoundCTA.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px] pt-[16px]">
            <Link
              href="/rezervace/vozidlo"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[16px] px-[41px] py-[21px] shadow-[0px_20px_25px_-5px_rgba(121,96,169,0.4)] font-clash font-bold text-[16px] text-white hover:opacity-90 transition-opacity"
            >
              {cmsBookNowButton || t("notFoundCTA.bookNow")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="tel:+420775009033"
              className="inline-flex items-center justify-center gap-2 bg-[#302e2f] border border-[#b1b3b6] rounded-[16px] px-[41px] py-[21px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] font-clash font-bold text-[16px] text-white hover:bg-[#3a3839] transition-colors"
            >
              {cmsCallUsButton || t("notFoundCTA.callUs")}
              <Phone className="size-4" />
            </Link>
            <Link
              href="/sluzby"
              className="inline-flex items-center justify-center gap-2 bg-[#302e2f] border border-[#b1b3b6] rounded-[16px] px-[41px] py-[21px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] font-clash font-bold text-[16px] text-white hover:bg-[#3a3839] transition-colors"
            >
              {t("common.allServices")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
