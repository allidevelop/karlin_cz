import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Check, ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPromotions, getPromotionBySlug, getTranslations as getCmsTranslations } from "@/lib/payload";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";
import PromoCarousel from "@/components/akce/PromoCarousel";
import PromoBookingCTA from "@/components/akce/PromoBookingCTA";
import { LowerWaveDecoration } from "@/components/home/WaveDecorations";

export async function generateStaticParams() {
  const promotions = await getPromotions();
  return promotions.flatMap((p) =>
    ['cs', 'en', 'ru'].map((locale) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale });
  const promo = await getPromotionBySlug(slug, locale);
  if (!promo) {
    return { title: t("metadata.promoNotFound") };
  }
  return {
    title: promo.title,
    description: promo.description ?? "",
  };
}

export default async function PromoDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [promo, cmsTranslations] = await Promise.all([
    getPromotionBySlug(slug, locale),
    getCmsTranslations(locale),
  ]);
  const t = await getTranslations();

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  if (!promo) {
    notFound();
  }

  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return "";
    return `${new Intl.NumberFormat(locale).format(price)} ${t("common.currency")}`;
  };

  const formatPriceNumber = (price: number | null | undefined) => {
    if (price == null) return "";
    return new Intl.NumberFormat(locale).format(price);
  };

  const originalPriceStr = formatPrice(promo.originalPrice);
  const discountedPriceNumber = formatPriceNumber(promo.discountedPrice);
  const validUntilStr = promo.validTo
    ? dateFormatter.format(new Date(promo.validTo))
    : t("promotions.permanentOffer");

  // Calculate savings
  const savings =
    promo.originalPrice && promo.discountedPrice
      ? promo.originalPrice - promo.discountedPrice
      : null;
  const savingsStr = savings ? formatPrice(savings) : null;

  // Extract terms from the array field
  const terms: string[] =
    (promo.terms as { term: string }[] | undefined)?.map((t) => t.term) ?? [];

  // Extract included items from the array field
  const includes: string[] =
    (promo.includedItems as { item: string }[] | undefined)?.map(
      (i) => i.item
    ) ?? [];

  // Extract full description from richText (Lexical JSON)
  const contentRoot = (promo.content as any)?.root?.children;
  const fullDescription = contentRoot
    ? contentRoot
        .map((node: any) =>
          (node.children ?? []).map((c: any) => c.text ?? "").join("")
        )
        .filter((t: string) => t.length > 0)
        .join(" ")
    : promo.description ?? "";

  // Image URL
  const imageUrl =
    typeof promo.image === "object" && promo.image !== null
      ? (promo.image as any).url ?? null
      : null;

  // Related promotions
  const allPromos = await getPromotions(locale);
  const relatedPromos = allPromos.filter((p) => p.slug !== slug).slice(0, 4);

  // Map related promos for PromoCarousel
  const carouselPromos = relatedPromos.map((p) => ({
    title: p.title,
    slug: p.slug,
    description: p.description ?? null,
    discountedPrice: p.discountedPrice ?? null,
    originalPrice: p.originalPrice ?? null,
    badge: p.badge ?? null,
    validTo: p.validTo ?? null,
    imageUrl:
      typeof p.image === "object" && p.image !== null
        ? (p.image as any).url ?? null
        : null,
  }));

  return (
    <>
      {/* Hero */}
      <PageHero
        title={t("promotionsPage.title")}
        subtitle={t("promotionsPage.subtitle")}
        backLink={{ href: "/akce", label: t("promotions.backToPromotions") }}
      />

      {/* Light sections */}
      <div className="relative bg-[#f0eff0] overflow-hidden">
        <LowerWaveDecoration />

        <div className="relative z-[1]">
          {/* Promo detail — image + details side by side */}
          <section className="pt-[25px] pb-[32px]">
            <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
              <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[24px] lg:gap-[32px] items-start">
                {/* Left: Image with badge */}
                <div className="relative">
                  {/* Badge pill — centered on top edge */}
                  {promo.badge && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                      <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] backdrop-blur-[7.5px] text-[#f0eff0] font-clash font-bold text-[16px] leading-[20px] rounded-b-[20px] px-6 py-3">
                        {promo.badge}
                      </span>
                    </div>
                  )}

                  <div className="relative rounded-[16px] overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
                    <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-[#302e2f] to-[#302e2f]/80">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={promo.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-clash text-[14px] font-medium text-[#b1b3b6]">
                            {t("promotions.photo")}
                          </span>
                        </div>
                      )}
                      {/* Subtle dark overlay */}
                      <div className="absolute inset-0 bg-[rgba(48,46,47,0.1)]" />
                    </div>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="flex flex-col gap-[32px]">
                  {/* Title + subtitle + date + description */}
                  <div className="flex flex-col gap-[16px]">
                    {/* Title */}
                    <h1 className="font-clash text-[28px] lg:text-[40px] font-bold text-[#1a1a1a] leading-[1.1]">
                      {promo.title}
                    </h1>

                    {/* Subtitle / short description */}
                    {promo.description && (
                      <p className="font-clash text-[18px] lg:text-[22.3px] font-medium text-[#1a1a1a] leading-[32px]">
                        {promo.description}
                      </p>
                    )}

                    {/* Validity date */}
                    <div className="flex items-center pt-[8px]">
                      <span className="font-clash text-[18px] font-medium text-[#302e2f] leading-[28px]">
                        {t("promotions.validUntil")} {validUntilStr}
                      </span>
                    </div>

                    {/* Long description */}
                    {fullDescription && fullDescription !== promo.description && (
                      <p className="font-clash text-[17.2px] font-medium text-[#1a1a1a] leading-[29.25px] pt-[7.25px]">
                        {fullDescription}
                      </p>
                    )}
                  </div>

                  {/* Price box — purple bg */}
                  <div className="bg-[#7960a9] rounded-[10px] p-[16px] lg:p-[24px] flex flex-col gap-[16px]">
                    {/* Prices row */}
                    <div className="flex items-end justify-between">
                      {/* Left: original + discounted price */}
                      <div className="flex flex-col gap-[4px]">
                        {originalPriceStr && (
                          <span className="font-clash text-[14px] font-normal text-[#b1b3b6] line-through leading-[20px]">
                            {originalPriceStr}
                          </span>
                        )}
                        <div className="flex items-baseline gap-[8px] text-[#f0eff0]">
                          <span className="font-clash text-[36px] lg:text-[48px] font-bold leading-[1]">
                            {discountedPriceNumber}
                          </span>
                          <span className="font-clash text-[20px] font-bold leading-[28px]">
                            {t("common.currency")}
                          </span>
                        </div>
                      </div>

                      {/* Right: savings indicator */}
                      {savingsStr && (
                        <div className="flex flex-col gap-[2px] items-end">
                          <span className="font-clash text-[11px] font-normal text-[#b1b3b6] opacity-80 leading-[16px]">
                            {t("promotions.youSave")}
                          </span>
                          <span className="font-clash text-[20px] font-bold text-[#f0eff0] leading-[28px]">
                            {savingsStr}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA button — white bg, purple text, INSIDE the purple box */}
                    <PromoBookingCTA
                      promotionId={String(promo.id)}
                      promoCode={(promo as Record<string, unknown>).altegioPromoCode as string | null ?? null}
                      discount={savings ?? 0}
                      cmsBookWithPromoButton={cmsTranslations?.promotionsBookWithPromoButton}
                      altegioServiceId={(promo as Record<string, unknown>).altegioServiceId as number | null ?? null}
                      serviceName={promo.title}
                      servicePrice={promo.discountedPrice ?? promo.originalPrice ?? null}
                      externalBookingUrl={(promo as Record<string, unknown>).externalBookingUrl as string | null ?? null}
                    />
                  </div>
                </div>
              </div>

              {/* Included items and Terms — two columns below */}
              {(includes.length > 0 || terms.length > 0) && (
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[20px] mt-[24px]">
                  {/* Co je zahrnuto — light bg card */}
                  {includes.length > 0 && (
                    <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] p-[16px] lg:p-[24px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center gap-[10px] mb-[16px]">
                        <span className="w-[36px] h-[3px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-full" />
                        <h2 className="font-clash text-[18px] lg:text-[22px] font-bold text-[#302e2f] leading-[26px]">
                          {t("promotions.whatsIncluded")}
                        </h2>
                      </div>
                      <div className="flex flex-col gap-[10px]">
                        {includes.map((item) => (
                          <div key={item} className="flex items-start gap-[10px]">
                            <Check className="size-[18px] text-[#7960a9] shrink-0 mt-[2px]" />
                            <span className="font-clash text-[14px] lg:text-[15px] font-medium text-[#302e2f] leading-[22px]">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Podmínky akce — purple gradient bg */}
                  {terms.length > 0 && (
                    <div className="bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] p-[16px] lg:p-[24px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center gap-[10px] mb-[16px]">
                        <span className="w-[36px] h-[3px] bg-white rounded-full" />
                        <h2 className="font-clash text-[18px] lg:text-[22px] font-bold text-white leading-[26px]">
                          {t("promotions.terms")}
                        </h2>
                      </div>
                      <div className="flex flex-col gap-[10px]">
                        {terms.map((term) => (
                          <div key={term} className="flex items-start gap-[10px]">
                            <Check className="size-[18px] text-white shrink-0 mt-[2px]" />
                            <span className="font-clash text-[14px] lg:text-[15px] font-medium text-white leading-[22px]">
                              {term}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* "Nenašli jste co hledáte?" CTA */}
          <NotFoundCTA
            cmsBookNowButton={cmsTranslations?.notFoundBookButton}
            cmsCallUsButton={cmsTranslations?.notFoundCallButton}
          />

          {/* Related promotions — carousel */}
          {relatedPromos.length > 0 && (
            <section className="py-[48px]">
              <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
                <h2 className="font-clash font-bold text-[36px] lg:text-[48px] text-[#302e2f] leading-[48px]">
                  {t("promotions.otherPromotions")}
                </h2>
              </div>
              <PromoCarousel promotions={carouselPromos} />
            </section>
          )}

          {/* Shared bottom: FAQ, Partners, Blog */}
          <SharedBottomSections wrapInLightBg={false} pageSlug="promotions" />
        </div>
      </div>
    </>
  );
}
