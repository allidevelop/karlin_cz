import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getVehicleCategories, getServices, getTranslations as getCmsTranslations } from "@/lib/payload";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.vehicleCategoriesTitle"),
    description: t("metadata.vehicleCategoriesDescription"),
  };
}

/** Fallback images for vehicle categories without CMS images */
const FALLBACK_IMAGE_MAP: Record<string, { desktop: string; mobile: string }> = {
  "hatchback-sedan": {
    desktop: "/images/vehicle-hatchback.png",
    mobile: "/images/vehicle-hatchback-mobile.png",
  },
  suv: {
    desktop: "/images/vehicle-suv-1.png",
    mobile: "/images/vehicle-suv-mobile.png",
  },
  "g-class-v-class-pickup": {
    desktop: "/images/vehicle-gclass-1.png",
    mobile: "/images/vehicle-gclass-mobile.png",
  },
  motocykly: {
    desktop: "/images/vehicle-moto-1.png",
    mobile: "/images/vehicle-moto-mobile.png",
  },
};

export default async function KategorieVozidelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const [categories, services, cmsTranslations] = await Promise.all([
    getVehicleCategories(),
    getServices(),
    getCmsTranslations(locale),
  ]);

  // Build a map of vehicle category ID -> minimum price across all services
  const minPriceByCategory = new Map<string | number, number>();
  for (const service of services) {
    const pricingByVehicle = service.pricingByVehicle as
      | { vehicleCategory: any; price: number }[]
      | undefined;
    if (!pricingByVehicle) continue;
    for (const p of pricingByVehicle) {
      const catId =
        typeof p.vehicleCategory === "object" && p.vehicleCategory !== null
          ? p.vehicleCategory.id
          : p.vehicleCategory;
      if (catId == null) continue;
      const current = minPriceByCategory.get(catId);
      if (current == null || p.price < current) {
        minPriceByCategory.set(catId, p.price);
      }
    }
  }

  return (
    <>
      {/* Hero */}
      <PageHero
        title={t("kategorieVozidel.title")}
        subtitle={t("kategorieVozidel.subtitle")}
      />

      {/* Light bg wrapper */}
      <div className="bg-[#f0eff0]">
        {/* Tab navigation */}
        <section className="pt-[25px]">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <div className="flex justify-center">
              <div className="inline-flex items-center bg-[#f0eff0] border border-[#f0eff0] lg:border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-[9px] overflow-x-auto">
                <Link
                  href="/sluzby"
                  className="font-clash text-[14px] font-medium text-[#302e2f] rounded-[10px] px-6 py-3 whitespace-nowrap hover:text-[#7960a9] transition-colors"
                >
                  {t("doplnkoveSluzby.tabs.programs")}
                </Link>
                <Link
                  href="/kategorie-vozidel"
                  className="font-clash text-[14px] font-medium text-white bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] px-6 py-3 whitespace-nowrap leading-normal text-center"
                >
                  <span className="lg:hidden">
                    {t("kategorieVozidel.title")}
                  </span>
                  <span className="hidden lg:inline">{t("kategorieVozidel.title")}</span>
                </Link>
                <Link
                  href="/doplnkove-sluzby"
                  className="font-clash text-[14px] font-medium text-[#302e2f] rounded-[10px] px-6 py-3 hover:text-[#7960a9] transition-colors whitespace-nowrap leading-normal text-center"
                >
                  <span className="lg:hidden">
                    {t("doplnkoveSluzby.tabs.additionalServices")}
                  </span>
                  <span className="hidden lg:inline">{t("doplnkoveSluzby.tabs.additionalServices")}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle category cards grid */}
        <section id="services" className="pt-[48px] lg:pb-[80px]">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] lg:gap-[25px]">
              {categories.map((cat) => {
                const slug = cat.slug as string;
                const minPrice = minPriceByCategory.get(cat.id) ?? null;
                // CMS images with static fallback
                const cmsImage = cat.image as { url?: string } | null | undefined;
                const cmsMobileImage = (cat as Record<string, unknown>).mobileImage as { url?: string } | null | undefined;
                const fallbackImages = FALLBACK_IMAGE_MAP[slug];
                const images = {
                  desktop: (typeof cmsImage === "object" && cmsImage?.url) ? cmsImage.url : fallbackImages?.desktop,
                  mobile: (typeof cmsMobileImage === "object" && cmsMobileImage?.url) ? cmsMobileImage.url : fallbackImages?.mobile,
                };

                return (
                  <div key={slug} className="group relative">
                    {/* Card */}
                    <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-[2px] overflow-hidden h-[241px] lg:h-[480px] flex flex-col">
                      {/* Hover glow (desktop) */}
                      <div className="absolute -inset-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[32px] blur-[12px] opacity-0 group-hover:opacity-30 transition-opacity -z-10 hidden lg:block" />

                      {/* Top: Image area */}
                      <div className="relative h-[218px] lg:h-[240px] overflow-hidden">
                        {images && (
                          <>
                            {/* Desktop image */}
                            <Image
                              src={images.desktop}
                              alt={cat.name ?? ""}
                              fill
                              className="object-cover hidden lg:block"
                              sizes="(max-width: 1024px) 50vw, 25vw"
                            />
                            {/* Mobile image */}
                            <Image
                              src={images.mobile}
                              alt={cat.name ?? ""}
                              fill
                              className="object-cover lg:hidden"
                              sizes="50vw"
                            />
                          </>
                        )}
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-[#302e2f]/40 mix-blend-multiply" />

                        {/* Category name + price on image (mobile) */}
                        <div className="lg:hidden absolute bottom-0 left-0 right-0 px-4 pb-5 flex flex-col items-center gap-[8px]">
                          <h3 className="font-clash font-bold text-[15px] text-[#f0eff0] uppercase tracking-[0.5px] leading-[20px] text-center">
                            {cat.name}
                          </h3>
                          {minPrice != null && (
                            <div className="flex items-center gap-[6px] text-[#f0eff0]">
                              <span className="font-clash font-bold text-[20px] leading-[36px]">
                                {new Intl.NumberFormat(locale).format(
                                  minPrice
                                )}
                              </span>
                              <span className="font-clash font-normal text-[16.7px] leading-[28px]">
                                {t("common.currency")}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Category name on image (desktop) */}
                        <div className="hidden lg:block absolute bottom-0 left-0 right-0 px-6 pb-7">
                          <h3 className="font-clash font-bold text-[20px] text-[#f0eff0] uppercase tracking-[0.5px] leading-[26px]">
                            {cat.name}
                          </h3>
                        </div>
                      </div>

                      {/* Mobile: "Zjistit více" link */}
                      <div className="lg:hidden flex items-center justify-center gap-[5px] h-[22px] p-[10px]">
                        <Link
                          href="/rezervace/vozidlo"
                          className="font-clash text-[10px] font-medium text-[#302e2f] hover:text-[#7960a9] transition-colors"
                        >
                          {t("kategorieVozidel.learnMore")}
                        </Link>
                        <ChevronRight className="size-4 text-[#302e2f]" />
                      </div>

                      {/* Desktop: Price + Buttons area */}
                      <div className="hidden lg:flex flex-col items-center h-[240px] p-6 backdrop-blur-[5px]">
                        {/* Price section - centered vertically in available space */}
                        <div className="flex-1 flex items-center justify-center">
                          <div className="flex flex-col gap-2 items-center">
                            <span className="font-clash font-bold text-[12px] text-[#b1b3b6] uppercase tracking-[0.6px] leading-[16px]">
                              {t("kategorieVozidel.pricesFrom")}
                            </span>
                            <div className="flex items-baseline gap-1">
                              {minPrice != null ? (
                                <>
                                  <span className="font-clash font-bold text-[60px] leading-[60px] text-[#7960a9]">
                                    {new Intl.NumberFormat(locale).format(
                                      minPrice
                                    )}
                                  </span>
                                  <span className="font-clash font-bold text-[22.9px] leading-[32px] text-[#7960a9]">
                                    {t("common.currency")}
                                  </span>
                                </>
                              ) : (
                                <span className="font-clash font-bold text-[60px] leading-[60px] text-[#7960a9]">
                                  ---
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* CTA button */}
                        <Link
                          href="/rezervace/vozidlo"
                          className="w-full flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[14px] uppercase leading-[24px] rounded-[10px] py-[14px] hover:opacity-90 transition-opacity"
                        >
                          {t("services.chooseProgram")}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* "Nenasli jste co hledate?" CTA */}
        <NotFoundCTA
          cmsBookNowButton={cmsTranslations?.notFoundBookButton}
          cmsCallUsButton={cmsTranslations?.notFoundCallButton}
        />

        {/* Shared bottom: FAQ, Partners, Blog */}
        <SharedBottomSections wrapInLightBg={false} pageSlug="services" />
      </div>
    </>
  );
}
