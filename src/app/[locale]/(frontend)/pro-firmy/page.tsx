import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getHomePageContent, getMediaUrl } from "@/lib/payload";
import SharedBottomSections from "@/components/shared/SharedBottomSections";
import { LowerWaveDecoration } from "@/components/home/WaveDecorations";
import BenefitsSection from "@/components/pro-firmy/BenefitsSection";
import MobileBadge from "@/components/pro-firmy/MobileBadge";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.forBusinessTitle"),
    description: t("metadata.forBusinessDescription"),
  };
}

export default async function ProFirmyPage() {
  const [t, cmsContent] = await Promise.all([
    getTranslations(),
    getHomePageContent(),
  ]);
  const heroImageUrl = getMediaUrl(cmsContent?.heroImage) || "/images/hero-bg.jpg";

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO — dark bg, left text + right form
          ═══════════════════════════════════════════ */}
      <section className="relative bg-[#302e2f] overflow-hidden">
        {/* Background video with YouTube iframe */}
        {cmsContent?.heroVideoId ? (
          <>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${cmsContent.heroVideoId}?autoplay=1&mute=1&loop=1&playlist=${cmsContent.heroVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&iv_load_policy=3`}
                loading="eager"
                allow="autoplay; encrypted-media"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full border-0"
                title="Background video"
              />
            </div>
            {/* Fallback image for slow connections */}
            <Image
              src={heroImageUrl}
              alt=""
              fill
              className="object-cover -z-10"
              priority
            />
          </>
        ) : (
          <div className="absolute inset-0">
            <Image
              src={heroImageUrl}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Decorative blurred circles */}
        <div className="absolute bottom-[32px] left-[164px] w-[256px] h-[256px] bg-[rgba(240,239,240,0.1)] rounded-full blur-[32px]" />
        <div className="absolute bottom-[564px] left-[777px] w-[256px] h-[256px] bg-[rgba(240,239,240,0.1)] rounded-full blur-[32px]" />
        <div className="absolute bottom-[44px] right-[97px] w-[256px] h-[256px] bg-[rgba(240,239,240,0.1)] rounded-full blur-[32px]" />

        <div className="relative z-10 max-w-[1536px] mx-auto px-4 lg:px-[32px] pt-[128px] pb-[80px] lg:pt-[128px] lg:pb-[80px]">
          <div className="flex flex-col lg:flex-row gap-[48px] items-center">
            {/* Left: Text content */}
            <div className="flex-1 flex flex-col items-center lg:items-start gap-[24px]">
              {/* Mobile-only badge */}
              <MobileBadge text={t("proFirmy.badge")} />

              <h1 className="font-clash text-[36px] lg:text-[60px] font-bold text-[#f0eff0] leading-[45px] lg:leading-[60px] text-center lg:text-left">
                {t("proFirmy.title")}
              </h1>

              <p className="font-clash text-[14px] lg:text-[19px] font-medium text-[#f0eff0] leading-[20px] lg:leading-[32.5px] text-center lg:text-left">
                {t("proFirmy.description")}
              </p>

              <div className="flex flex-col lg:flex-row gap-[16px] items-center pt-[8px] w-full lg:w-auto">
                <Link
                  href="/rezervace/vozidlo"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[20px] uppercase rounded-[10px] px-7 py-[17px] shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity w-full sm:w-[200px] lg:w-auto"
                >
                  {t("hero.cta")}
                </Link>
                <Link
                  href="/sluzby"
                  className="inline-flex items-center justify-center gap-2 backdrop-blur-[12px] bg-[rgba(177,179,182,0.1)] border border-[#f0eff0] text-[#f0eff0] font-clash font-bold text-[20px] uppercase rounded-[10px] px-[29px] py-[17px] hover:bg-white/20 transition-colors w-full sm:w-[200px] lg:w-auto"
                >
                  {t("proFirmy.ourServices")}
                </Link>
              </div>
            </div>

            {/* Right: Contact form — hidden on mobile, visible on lg */}
            <div
              id="corporate-form"
              className="hidden lg:flex flex-1 flex-col gap-[24px] bg-[#f0eff0] rounded-[24px] p-[32px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
            >
              <h3 className="font-clash text-[32px] font-bold text-[#302e2f] leading-[32px] text-center w-full">
                {t("proFirmy.formHeading")}
              </h3>

              <form className="flex flex-col gap-[16px]">
                {/* Nazev spolecnosti */}
                <div className="flex flex-col gap-[8px]">
                  <label className="font-clash text-[13px] font-bold text-[#302e2f] leading-[20px]">
                    {t("proFirmy.companyLabel")}
                  </label>
                  <input
                    type="text"
                    className="w-full h-[50px] rounded-[12px] border border-[#b1b3b6] bg-[#f0eff0] px-4 font-clash text-[15px] text-[#302e2f] focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
                  />
                </div>

                {/* Kontaktni osoba */}
                <div className="flex flex-col gap-[8px]">
                  <label className="font-clash text-[13px] font-bold text-[#302e2f] leading-[20px]">
                    {t("proFirmy.contactPersonLabel")}
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
                      {t("proFirmy.emailLabel")}
                    </label>
                    <input
                      type="email"
                      className="w-full h-[50px] rounded-[12px] border border-[#b1b3b6] bg-[#f0eff0] px-4 font-clash text-[15px] text-[#302e2f] focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <label className="font-clash text-[13px] font-bold text-[#302e2f] leading-[20px]">
                      {t("proFirmy.phoneLabel")}
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
                    {t("proFirmy.fleetSizeLabel")}
                  </label>
                  <select className="w-full h-[50px] rounded-[12px] border border-[#b1b3b6] bg-[#f0eff0] px-[21px] font-clash text-[15px] text-[#b1b3b6] focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition appearance-none">
                    <option value="">{t("proFirmy.fleetSizeDefault")}</option>
                    <option value="1-5">{t("proFirmy.fleetSize1to5")}</option>
                    <option value="6-20">{t("proFirmy.fleetSize6to20")}</option>
                    <option value="21-50">{t("proFirmy.fleetSize21to50")}</option>
                    <option value="50+">{t("proFirmy.fleetSize50plus")}</option>
                  </select>
                </div>

                {/* Vase zprava */}
                <div className="flex flex-col gap-[8px] pb-[7px]">
                  <label className="font-clash text-[13px] font-bold text-[#302e2f] leading-[20px]">
                    {t("proFirmy.messageLabel")}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={t("proFirmy.messagePlaceholder")}
                    className="w-full rounded-[12px] border border-[#b1b3b6] bg-[#f0eff0] px-[17px] pt-[13px] pb-[13px] font-clash text-[16px] text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[15px] rounded-[12px] px-[24px] py-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity leading-[24px]"
                >
                  {t("proFirmy.submitInquiry")}
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
          <BenefitsSection
            whyUsTitle={t("proFirmy.whyUsTitle")}
            whyUsSubtitle={t("proFirmy.whyUsSubtitle")}
            flexibleSlotsTitle={t("proFirmy.benefits.flexibleSlots.title")}
            flexibleSlotsDesc={t("proFirmy.benefits.flexibleSlots.description")}
            goodPricesTitle={t("proFirmy.benefits.goodPrices.title")}
            goodPricesDesc={t("proFirmy.benefits.goodPrices.description")}
            premiumCareTitle={t("proFirmy.benefits.premiumCare.title")}
            premiumCareDesc={t("proFirmy.benefits.premiumCare.description")}
            personalManagerTitle={t("proFirmy.benefits.personalManager.title")}
            personalManagerDesc={t("proFirmy.benefits.personalManager.description")}
            verifiedQualityTitle={t("proFirmy.benefits.verifiedQuality.title")}
            verifiedQualityDesc={t("proFirmy.benefits.verifiedQuality.description")}
            individualApproachTitle={t("proFirmy.benefits.individualApproach.title")}
            individualApproachDesc={t("proFirmy.benefits.individualApproach.description")}
            reliablePartnerTitle={t("proFirmy.benefits.reliablePartner.title")}
            reliablePartnerDesc={t("proFirmy.benefits.reliablePartner.description")}
          />

          {/* ─── Shared bottom: FAQ, Partners, Blog ─── */}
          <SharedBottomSections wrapInLightBg={false} pageSlug="pro-firmy" />
        </div>
      </div>
    </>
  );
}
