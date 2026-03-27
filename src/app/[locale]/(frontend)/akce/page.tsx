import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getPromotions, getTranslations as getCmsTranslations } from "@/lib/payload";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.promotionsTitle"),
    description: t("metadata.promotionsDescription"),
  };
}

export default async function AkcePage() {
  const locale = await getLocale();
  const [promotions, cmsTranslations] = await Promise.all([
    getPromotions(),
    getCmsTranslations(locale),
  ]);
  const t = await getTranslations();
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* Map CMS promotions to the shape PromoCarousel expects */
  const promoItems = promotions.map((promo) => {
    /* Resolve the image URL from the Payload media relation */
    let imageUrl: string | null = null;
    if (promo.image && typeof promo.image === "object" && "url" in promo.image) {
      imageUrl = (promo.image as { url?: string }).url ?? null;
    }

    return {
      title: promo.title,
      slug: promo.slug as string,
      description: promo.description as string | null | undefined,
      discountedPrice: promo.discountedPrice as number | null | undefined,
      originalPrice: promo.originalPrice as number | null | undefined,
      badge: promo.badge as string | null | undefined,
      validTo: promo.validTo as string | null | undefined,
      imageUrl,
    };
  });

  return (
    <>
      {/* Hero — dark bg matching Figma node 1:6910 */}
      <PageHero
        title={t("promotionsPage.title")}
        subtitle={t("promotionsPage.subtitle")}
      />

      {/* Light bg wrapper — promotions + NotFoundCTA + shared sections */}
      <div className="relative bg-[#f0eff0] overflow-hidden">
        {/* Background wave decoration at 40% opacity, per Figma */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <Image
            src="/images/wave-bg.png"
            alt=""
            fill
            className="object-cover opacity-40"
            priority={false}
          />
        </div>

        <div className="relative z-[1]">
          {/* Promo cards grid — 3 columns */}
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px] pt-[25px] lg:pt-[40px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promoItems.map((promo) => {
                const imageSrc = promo.imageUrl || "/images/promo-winter.png";
                const discounted = promo.discountedPrice != null
                  ? new Intl.NumberFormat(locale).format(promo.discountedPrice)
                  : null;
                const original = promo.originalPrice != null
                  ? new Intl.NumberFormat(locale).format(promo.originalPrice)
                  : null;

                return (
                  <Link
                    key={promo.slug}
                    href={`/akce/${promo.slug}`}
                    className="card-hover-tint relative rounded-[10px] overflow-hidden border border-[#b1b3b6] backdrop-blur-[2px] bg-[#f0eff0] flex flex-col group transition-all duration-300 hover:border-[#7960a9] hover:shadow-[0_0_30px_-5px_rgba(121,96,169,0.3)]"
                  >
                    {promo.badge && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-start justify-center">
                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] backdrop-blur-[7.5px] text-[#f0eff0] font-clash font-bold text-[18px] leading-[24px] rounded-b-full px-6 pb-3 pt-2 whitespace-nowrap">
                          {promo.badge}
                        </span>
                      </div>
                    )}

                    <div className="relative h-[256px] shrink-0 overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={promo.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-[rgba(48,46,47,0.5)]" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-2">
                        <h3 className="font-clash font-bold text-[26px] lg:text-[32px] text-[#f0eff0] uppercase text-center leading-[30px]">
                          {promo.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col gap-4 items-center justify-center transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-[#7960a9] group-hover:to-[#9b7ec4]">
                      <p className="font-clash font-medium text-[16px] text-[#302e2f] leading-normal text-center line-clamp-2 w-full transition-colors duration-300 group-hover:text-[#f0eff0]">
                        {promo.description}
                      </p>

                      <div className="border-b border-[#f0eff0] pb-4 w-full flex flex-col items-center gap-1 transition-colors duration-300 group-hover:border-[#f0eff0]/30">
                        {discounted && (
                          <div className="flex items-baseline gap-2 justify-center text-[#7960a9] transition-colors duration-300 group-hover:text-[#f0eff0]">
                            <span className="font-clash font-bold text-[24px] lg:text-[32px] leading-[40px]">
                              {discounted}
                            </span>
                            <span className="font-clash font-bold text-[18px] leading-[28px]">
                              {t("common.currency")}
                            </span>
                          </div>
                        )}
                        {original && (
                          <div className="flex items-baseline gap-2 justify-center text-[#b1b3b6] transition-colors duration-300 group-hover:text-[#f0eff0]/50">
                            <span className="font-clash font-medium text-[24px] leading-[40px] line-through decoration-solid">
                              {original}
                            </span>
                            <span className="font-clash font-normal text-[16px] leading-[28px] line-through decoration-solid">
                              {t("common.currency")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="w-full bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-6 py-4 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:from-[#f0eff0] group-hover:to-[#f0eff0]">
                        <span className="flex items-center justify-center font-clash font-bold text-[14.8px] text-[#f0eff0] uppercase leading-[24px] transition-colors duration-300 group-hover:text-[#7960a9]">
                          {t("promotions.viewDetail")}
                        </span>
                      </div>

                      {promo.validTo && (
                        <p className="font-clash font-medium text-[14px] text-[#302e2f] text-center leading-[20px] transition-colors duration-300 group-hover:text-[#f0eff0]/70">
                          {t("promotions.validUntil")} {dateFormatter.format(new Date(promo.validTo))}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* "Nenašli jste co hledáte?" CTA */}
          <NotFoundCTA
            cmsBookNowButton={cmsTranslations?.notFoundBookButton}
            cmsCallUsButton={cmsTranslations?.notFoundCallButton}
          />

          {/* Shared bottom: FAQ, Partners, Blog */}
          <SharedBottomSections wrapInLightBg={false} pageSlug="promotions" />
        </div>
      </div>
    </>
  );
}
