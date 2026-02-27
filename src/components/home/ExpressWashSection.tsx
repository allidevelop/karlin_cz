import Image from "next/image";
import { Car, Award, MapPin, Gift, Sparkles } from "lucide-react";

type Props = {
  showLoyaltyCta?: boolean;
  showVoucherCta?: boolean;
};

const infoCards = [
  {
    id: "parking",
    icon: Car,
    titleLine1: "Parkování",
    titleLine2: "Zdarma",
    description: "Parking na celý den\n7:00 - 20:00",
    cta: "Začít",
  },
  {
    id: "location",
    icon: MapPin,
    titleLine1: "Výborná",
    titleLine2: "Dostupnost",
    description: "Najdete nás na Karlíně\nOtevřeno Po - Ne",
  },
  {
    id: "loyalty",
    icon: Award,
    titleLine1: "Věrnostní",
    titleLine2: "Program",
    description: "Získej odměnu za každé mytí",
    cta: "Začít",
  },
  {
    id: "voucher",
    icon: Gift,
    titleLine1: "Dárkový",
    titleLine2: "Voucher",
    description: "Poptávku pošlete přes formulář níže",
    cta: "Začít",
  },
  {
    id: "coming-soon-1",
    icon: Sparkles,
    titleLine1: "Již",
    titleLine2: "Brzy",
    description: "Připravujeme pro vás\nnovou službu",
  },
  {
    id: "coming-soon-2",
    icon: Sparkles,
    titleLine1: "Již",
    titleLine2: "Brzy",
    description: "Připravujeme pro vás\ndalší novinku",
  },
];

export default function ExpressWashSection({ showLoyaltyCta = false, showVoucherCta = false }: Props) {
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
              src="/images/express-banner-desktop.png"
              alt="Expresní ruční mytí aut již od 985 Kč"
              width={600}
              height={450}
              className="hidden lg:block w-full h-auto rounded-[10px]"
            />
            {/* Mobile banner */}
            <Image
              src="/images/express-banner-mobile.png"
              alt="Expresní ruční mytí aut již od 985 Kč"
              width={600}
              height={450}
              className="block lg:hidden w-full h-auto rounded-[10px]"
            />
          </div>

          {/* Right: Info cards grid */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {infoCards.map((card) => (
              <div
                key={card.titleLine1 + card.titleLine2}
                className="relative bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] p-[21px] lg:p-[22px] overflow-hidden flex flex-col items-center text-center"
              >
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-full blur-[20px] opacity-10" />

                {/* Icon */}
                <div className="relative w-12 h-12 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] flex items-center justify-center mb-3">
                  <card.icon className="size-5 text-[#f0eff0]" />
                </div>

                {/* Title */}
                <p className="font-clash font-bold text-[18px] leading-[22.5px] text-[#302e2f] uppercase">
                  {card.titleLine1}
                </p>
                <p className="font-clash font-bold text-[18px] leading-[22.5px] text-[#7960a9] uppercase">
                  {card.titleLine2}
                </p>

                {/* Description */}
                <p className="font-clash font-medium text-[14px] leading-[22.75px] text-[#302e2f] mt-2 whitespace-pre-line">
                  {card.description}
                </p>

                {/* CTA button (controlled via admin) */}
                {card.cta && ctaVisibility[card.id] && (
                  <button className="mt-3 w-full bg-[#7960a9] text-[#f0eff0] font-clash font-bold text-[14px] lg:text-[16px] uppercase leading-[20px] rounded-[5px] lg:rounded-[10px] px-4 py-2 hover:opacity-90 transition-opacity">
                    {card.cta}
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
