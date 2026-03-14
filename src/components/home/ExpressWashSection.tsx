import Image from "next/image";
import { Car, Award, MapPin, Gift, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

type Props = {
  showLoyaltyCta?: boolean;
  showVoucherCta?: boolean;
  desktopBannerUrl?: string | null;
  mobileBannerUrl?: string | null;
  cmsStartButton?: string | null;
};

const infoCards = [
  {
    id: "parking",
    icon: Car,
    line1Key: "expressWash.cards.parking.line1",
    line2Key: "expressWash.cards.parking.line2",
    descKey: "expressWash.cards.parking.description",
    ctaKey: "expressWash.start",
  },
  {
    id: "location",
    icon: MapPin,
    line1Key: "expressWash.cards.accessibility.line1",
    line2Key: "expressWash.cards.accessibility.line2",
    descKey: "expressWash.cards.accessibility.description",
  },
  {
    id: "loyalty",
    icon: Award,
    line1Key: "expressWash.cards.loyalty.line1",
    line2Key: "expressWash.cards.loyalty.line2",
    descKey: "expressWash.cards.loyalty.description",
    ctaKey: "expressWash.start",
  },
  {
    id: "voucher",
    icon: Gift,
    line1Key: "expressWash.cards.voucher.line1",
    line2Key: "expressWash.cards.voucher.line2",
    descKey: "expressWash.cards.voucher.description",
    ctaKey: "expressWash.start",
  },
  {
    id: "coming-soon-1",
    icon: Sparkles,
    line1Key: "expressWash.cards.comingSoon1.line1",
    line2Key: "expressWash.cards.comingSoon1.line2",
    descKey: "expressWash.cards.comingSoon1.description",
  },
  {
    id: "coming-soon-2",
    icon: Sparkles,
    line1Key: "expressWash.cards.comingSoon2.line1",
    line2Key: "expressWash.cards.comingSoon2.line2",
    descKey: "expressWash.cards.comingSoon2.description",
  },
];

export default async function ExpressWashSection({ showLoyaltyCta = false, showVoucherCta = false, desktopBannerUrl, mobileBannerUrl, cmsStartButton }: Props) {
  const t = await getTranslations();
  const ctaVisibility: Record<string, boolean> = {
    loyalty: showLoyaltyCta,
    voucher: showVoucherCta,
  };
  return (
    <section className="pb-[25px]">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Left: Express banner — image */}
          <div className="w-full lg:w-[600px] shrink-0">
            {/* Desktop banner */}
            <Image
              src={desktopBannerUrl || "/images/express-banner-desktop.png"}
              alt={t("expressWash.imageAlt")}
              width={600}
              height={450}
              className="hidden lg:block w-full h-auto rounded-[10px]"
            />
            {/* Mobile banner */}
            <Image
              src={mobileBannerUrl || "/images/express-banner-mobile.png"}
              alt={t("expressWash.imageAlt")}
              width={600}
              height={450}
              className="block lg:hidden w-full h-auto rounded-[10px]"
            />
          </div>

          {/* Right: Info cards grid */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {infoCards.map((card) => (
              <div
                key={card.id}
                className="relative bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] p-[12px] lg:p-[22px] overflow-hidden flex flex-col items-center text-center"
              >
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-full blur-[20px] opacity-10" />

                {/* Icon */}
                <div className="relative w-12 h-12 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] flex items-center justify-center mb-3">
                  <card.icon className="size-5 text-[#f0eff0]" />
                </div>

                {/* Title */}
                <p className="font-clash font-bold text-[14px] lg:text-[18px] leading-[18px] lg:leading-[22.5px] text-[#302e2f] uppercase">
                  {t(card.line1Key)}
                </p>
                <p className="font-clash font-bold text-[14px] lg:text-[18px] leading-[18px] lg:leading-[22.5px] text-[#7960a9] uppercase">
                  {t(card.line2Key)}
                </p>

                {/* Description */}
                <p className="font-clash font-medium text-[11px] lg:text-[14px] leading-[16px] lg:leading-[22.75px] text-[#302e2f] mt-2 whitespace-pre-line">
                  {t(card.descKey)}
                </p>

                {/* CTA button (controlled via admin) */}
                {card.ctaKey && ctaVisibility[card.id] && (
                  <button className="mt-3 w-full bg-[#7960a9] text-[#f0eff0] font-clash font-bold text-[14px] lg:text-[16px] uppercase leading-[20px] rounded-[5px] lg:rounded-[10px] px-4 py-2 hover:opacity-90 transition-opacity">
                    {cmsStartButton || t(card.ctaKey)}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
