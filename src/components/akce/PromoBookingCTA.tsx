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
  externalBookingUrl?: string | null;
}

export default function PromoBookingCTA({
  promotionId,
  promoCode,
  discount,
  cmsBookWithPromoButton,
  altegioServiceId,
  serviceName,
  servicePrice,
  externalBookingUrl,
}: PromoBookingCTAProps) {
  const t = useTranslations();
  const router = useRouter();
  const store = useBookingStore();

  const buttonLabel = cmsBookWithPromoButton || t("promotions.bookWithPromo");
  const buttonClass = "flex items-center justify-center gap-[12px] bg-[#f0eff0] text-[#7960a9] font-clash font-bold text-[16.7px] leading-[28px] rounded-[16px] px-[32px] py-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] hover:bg-white transition-colors w-full";

  // External URL — open in new tab
  if (externalBookingUrl) {
    return (
      <a
        href={externalBookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
      >
        <ArrowRight className="size-[24px]" />
        <span>{buttonLabel}</span>
      </a>
    );
  }

  const handleClick = () => {
    if (altegioServiceId && serviceName && servicePrice != null) {
      store.setDirectPromoBooking(
        altegioServiceId,
        serviceName,
        servicePrice,
        promotionId,
        promoCode ?? ""
      );
      router.push("/rezervace/kontakt");
    } else {
      store.setPromotion(promotionId, promoCode ?? "", "fixed", discount);
      router.push("/rezervace/vozidlo");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={buttonClass}
    >
      <ArrowRight className="size-[24px]" />
      <span>{buttonLabel}</span>
    </button>
  );
}
