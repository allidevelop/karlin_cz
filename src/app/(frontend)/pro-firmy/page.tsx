import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  BadgePercent,
  Shield,
  UserCheck,
  Award,
  Users,
  Handshake,
  ArrowRight,
  Building2,
} from "lucide-react";
import SharedBottomSections from "@/components/shared/SharedBottomSections";
import { LowerWaveDecoration } from "@/components/home/WaveDecorations";

export const metadata: Metadata = {
  title: "Pro firmy",
  description:
    "Profesionální péče o firemní flotilu. Individuální přístup, objemové slevy a flexibilní fakturace pro firemní klienty.",
};

/* ────────────────────────────────────────────
   Benefits data — first row (4 cards, small)
   ──────────────────────────────────────────── */
const benefitsRow1 = [
  {
    icon: Clock,
    title: "Flexibilní časové sloty",
    description: "Speciální termíny pro firemní vozidla mimo špičku",
  },
  {
    icon: BadgePercent,
    title: "Výhodné ceny",
    description: "Speciální slevy pro pravidelné zákazníky a větší flotily",
  },
  {
    icon: Shield,
    title: "Prémiová péče",
    description: "Profesionální servis zachovávající hodnotu vašich vozidel",
  },
  {
    icon: UserCheck,
    title: "Osobní manažer",
    description: "Dedikovaný kontakt pro koordinaci všech služeb",
  },
];

/* ────────────────────────────────────────────
   Benefits data — second row (3 cards, larger)
   ──────────────────────────────────────────── */
const benefitsRow2 = [
  {
    icon: Award,
    title: "Ověřená kvalita",
    description:
      "Pracujeme s prémiovou kosmetikou a nejmodernějšími technologiemi pro dokonalý výsledek.",
  },
  {
    icon: Users,
    title: "Individuální přístup",
    description:
      "Každý klient dostává řešení šité na míru podle svých specifických požadavků a potřeb.",
  },
  {
    icon: Handshake,
    title: "Spolehlivý partner",
    description:
      "Dlouhodobá spolupráce s řadou firem, které si cení naší spolehlivosti a profesionality.",
  },
];

export default function ProFirmyPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO — dark bg, left text + right form
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#302e2f] overflow-hidden">
        {/* Background image overlay at 30% opacity */}
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Decorative blurred circles */}
        <div className="absolute bottom-[32px] left-[164px] w-[256px] h-[256px] bg-[rgba(240,239,240,0.1)] rounded-full blur-[32px]" />
        <div className="absolute bottom-[564px] left-[777px] w-[256px] h-[256px] bg-[rgba(240,239,240,0.1)] rounded-full blur-[32px]" />
        <div className="absolute bottom-[44px] right-[97px] w-[256px] h-[256px] bg-[rgba(240,239,240,0.1)] rounded-full blur-[32px]" />

        <div className="relative z-10 max-w-[1536px] mx-auto px-4 lg:px-[32px] pt-[128px] pb-[80px] lg:pt-[128px] lg:pb-[80px]">
          <div className="flex flex-col lg:flex-row gap-[48px] items-center">
            {/* Left: Text content */}
            <div className="flex-1 flex flex-col items-center lg:items-start gap-[24px]">
              {/* Mobile-only badge */}
              <div className="lg:hidden flex items-center gap-[8px] bg-[#7960a9] border border-[#7960a9] rounded-[10px] px-[25px] py-[13px]">
                <Building2 className="size-[20px] text-[#f0eff0]" />
                <span className="font-clash font-bold text-[14px] text-[#f0eff0] uppercase leading-[20px]">
                  Firemní řešení
                </span>
              </div>

              <h1 className="font-clash text-[36px] lg:text-[60px] font-bold text-[#f0eff0] leading-[45px] lg:leading-[60px] text-center lg:text-left">
                Prémiová péče pro vaši firmu
              </h1>

              <p className="font-clash text-[14px] lg:text-[19px] font-medium text-[#f0eff0] leading-[20px] lg:leading-[32.5px] text-center lg:text-left">
                Automyčka Karlín poskytuje komplexní služby péče o firemní
                vozidla s individuálním přístupem a speciálními podmínkami pro
                korporátní klienty.
              </p>

              <div className="flex flex-col lg:flex-row gap-[16px] items-center pt-[8px] w-full lg:w-auto">
                <Link
                  href="#corporate-form"
                  className="inline-flex items-center justify-center gap-[12px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[17px] rounded-[16px] px-[40px] py-[22px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity w-[200px] lg:w-auto h-[60px] lg:h-auto leading-[28px]"
                >
                  Získat nabídku
                  <ArrowRight className="size-[24px]" />
                </Link>
                <Link
                  href="/sluzby"
                  className="inline-flex items-center justify-center border-[2px] border-[#b1b3b6] backdrop-blur-sm text-[#f0eff0] font-clash font-bold text-[17px] rounded-[10px] px-[42px] py-[22px] hover:bg-[#f0eff0]/10 transition-colors w-[200px] lg:w-auto h-[60px] lg:h-auto leading-[28px]"
                >
                  Naše služby
                </Link>
              </div>
            </div>

            {/* Right: Contact form — hidden on mobile, visible on lg */}
            <div
              id="corporate-form"
              className="hidden lg:flex flex-1 flex-col gap-[24px] bg-[#f0eff0] rounded-[24px] p-[32px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
            >
              <h3 className="font-clash text-[32px] font-bold text-[#302e2f] leading-[32px] text-center w-full">
                Poptat firemní služby
              </h3>

              <form className="flex flex-col gap-[16px]">
                {/* Nazev spolecnosti */}
                <div className="flex flex-col gap-[8px]">
                  <label className="font-clash text-[13px] font-bold text-[#302e2f] leading-[20px]">
                    Název společnosti *
                  </label>
                  <input
                    type="text"
                    className="w-full h-[50px] rounded-[12px] border border-[#b1b3b6] bg-[#f0eff0] px-4 font-clash text-[15px] text-[#302e2f] focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
                  />
                </div>

                {/* Kontaktni osoba */}
                <div className="flex flex-col gap-[8px]">
                  <label className="font-clash text-[13px] font-bold text-[#302e2f] leading-[20px]">
                    Kontaktní osoba *
                  </label>
                  <input
                    type="text"
                    className="w-full h-[50px] rounded-[12px] border border-[#b1b3b6] bg-[#f0eff0] px-4 font-clash text-[15px] text-[#302e2f] focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
                  />
                </div>

                {/* Email + Telefon (2-col) */}
                <div className="grid grid-cols-2 gap-[16px]">
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-clash text-[14px] font-bold text-[#302e2f] leading-[20px]">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      className="w-full h-[50px] rounded-[12px] border border-[#b1b3b6] bg-[#f0eff0] px-4 font-clash text-[15px] text-[#302e2f] focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-clash text-[13px] font-bold text-[#302e2f] leading-[20px]">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      className="w-full h-[50px] rounded-[12px] border border-[#b1b3b6] bg-[#f0eff0] px-4 font-clash text-[15px] text-[#302e2f] focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
                    />
                  </div>
                </div>

                {/* Velikost vozoveho parku */}
                <div className="flex flex-col gap-[8px]">
                  <label className="font-clash text-[13px] font-bold text-[#302e2f] leading-[20px]">
                    Velikost vozového parku
                  </label>
                  <select className="w-full h-[50px] rounded-[12px] border border-[#b1b3b6] bg-[#f0eff0] px-[21px] font-clash text-[15px] text-[#b1b3b6] focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition appearance-none">
                    <option value="">Vyberte velikost</option>
                    <option value="1-5">1-5 vozidel</option>
                    <option value="6-20">6-20 vozidel</option>
                    <option value="21-50">21-50 vozidel</option>
                    <option value="50+">50+ vozidel</option>
                  </select>
                </div>

                {/* Vase zprava */}
                <div className="flex flex-col gap-[8px] pb-[7px]">
                  <label className="font-clash text-[13px] font-bold text-[#302e2f] leading-[20px]">
                    Vaše zpráva
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Popište vaše požadavky..."
                    className="w-full rounded-[12px] border border-[#b1b3b6] bg-[#f0eff0] px-[17px] pt-[13px] pb-[85px] font-clash text-[16px] text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[15px] rounded-[12px] px-[24px] py-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity leading-[24px]"
                >
                  Odeslat poptávku
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LIGHT SECTIONS — Benefits + SharedBottom
          ═══════════════════════════════════════════ */}
      <div className="relative bg-[#f0eff0] overflow-hidden">
        <LowerWaveDecoration />

        <div className="relative z-[1]">
          {/* ─── Benefits Section ─── */}
          <section className="pt-[25px]">
            <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
              {/* py-20 wrapper matching Figma */}
              <div className="py-[80px]">
                <div className="flex flex-col gap-[64px]">
                  {/* Heading */}
                  <div className="flex flex-col items-center gap-[24px] text-center">
                    <h2 className="font-clash font-bold text-[36px] lg:text-[48px] text-[#302e2f] leading-[40px] lg:leading-[48px]">
                      Proč si nás vybrat?
                    </h2>
                    <p className="font-clash font-medium text-[19px] lg:text-[20px] text-[#302e2f] leading-[28px] max-w-[768px]">
                      Poskytujeme komplexní řešení pro firemní klienty s důrazem
                      na kvalitu a flexibilitu
                    </p>
                  </div>

                  {/* Row 1 — 4 smaller benefit cards (2x2 on mobile, 4-col on desktop) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] lg:gap-[32px]">
                    {benefitsRow1.map((benefit) => (
                      <div
                        key={benefit.title}
                        className="group relative bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden p-[21px] lg:p-[33px] flex flex-col items-center text-center gap-[11px] lg:gap-0"
                      >
                        {/* Hover glow */}
                        <div className="absolute top-0 right-0 w-[96px] lg:w-[128px] h-[96px] lg:h-[128px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-full blur-[20px] opacity-0 group-hover:opacity-10 transition-opacity" />

                        <div className="relative flex flex-col items-center">
                          {/* Icon */}
                          <div className="flex items-center justify-center w-[48px] lg:w-[64px] h-[48px] lg:h-[64px] rounded-[10px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4]">
                            <benefit.icon className="size-[25px] lg:size-[32px] text-[#f0eff0]" />
                          </div>

                          {/* Title */}
                          <h3 className="font-clash font-bold text-[20px] text-[#302e2f] leading-[20px] lg:leading-[28px] mt-[11px] lg:mt-[24px]">
                            {benefit.title}
                          </h3>

                          {/* Description */}
                          <p className="font-clash font-medium text-[12px] lg:text-[15px] text-[#302e2f] leading-normal lg:leading-[26px] mt-[11px] lg:mt-[12px]">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2 — 3 larger benefit cards (stacked on mobile, 3-col on desktop) */}
              <div className="pb-[80px]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px] lg:gap-[32px]">
                  {benefitsRow2.map((benefit) => (
                    <div
                      key={benefit.title}
                      className="relative bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden p-[33px] flex flex-col items-center text-center gap-[20px]"
                    >
                      {/* Icon */}
                      <div className="flex items-center justify-center w-[64px] h-[64px] rounded-[10px] lg:rounded-[10px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4]">
                        <benefit.icon className="size-[32px] text-[#f0eff0]" />
                      </div>

                      {/* Title */}
                      <h3 className="font-clash font-bold text-[24px] text-[#302e2f] leading-[32px]">
                        {benefit.title}
                      </h3>

                      {/* Description */}
                      <p className="font-clash font-medium text-[15px] text-[#302e2f] leading-[26px]">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ─── Shared bottom: FAQ, Partners, Blog ─── */}
          <SharedBottomSections wrapInLightBg={false} />
        </div>
      </div>
    </>
  );
}
