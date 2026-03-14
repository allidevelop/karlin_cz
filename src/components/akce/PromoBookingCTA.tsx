"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useBookingStore } from "@/stores/booking-store";

interface PromoBookingCTAProps {
  promotionId: string;
  promoCode: string | null;
  discount: number;
  cmsBookWithPromoButton?: string | null;
  altegioServiceId?: number | null;
  serviceName?: string | null;
  servicePrice?: number | null;
}

export default function PromoBookingCTA({
  promotionId,
  promoCode,
  discount,
  cmsBookWithPromoButton,
  altegioServiceId,
  serviceName,
  servicePrice,
}: PromoBookingCTAProps) {
  const t = useTranslations();
  const router = useRouter();
  const store = useBookingStore();

  const handleClick = () => {
    if (altegioServiceId && serviceName && servicePrice != null) {
      // Direct promo booking — skip vehicle/program selection
      store.setDirectPromoBooking(
        altegioServiceId,
        serviceName,
        servicePrice,
        promotionId,
        promoCode ?? ""
      );
      router.push("/rezervace/kontakt");
    } else {
      // Standard flow — go through vehicle/program selection
      store.setPromotion(promotionId, promoCode ?? "", "fixed", discount);
      router.push("/rezervace/vozidlo");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center gap-[12px] bg-[#f0eff0] text-[#7960a9] font-clash font-bold text-[16.7px] leading-[28px] rounded-[16px] px-[32px] py-[20px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] hover:bg-white transition-colors w-full"
    >
      <ArrowRight className="size-[24px]" />
      <span>{cmsBookWithPromoButton || t("promotions.bookWithPromo")}</span>
    </button>
  );
}
