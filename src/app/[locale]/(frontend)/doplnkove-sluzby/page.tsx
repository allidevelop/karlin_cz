import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getAddons, getTranslations as getCmsTranslations } from "@/lib/payload";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.additionalServicesTitle"),
    description: t("metadata.additionalServicesDescription"),
  };
}

// Fallback images by category
const CATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  interior: "/images/service-interior.jpg",
  exterior: "/images/service-exterior.jpg",
  protection: "/images/service-premium.jpg",
};

const CATEGORY_TITLES: Record<string, string> = {
  interior: "doplnkoveSluzby.categories.interior",
  exterior: "doplnkoveSluzby.categories.exterior",
  protection: "doplnkoveSluzby.categories.protection",
};

// Legacy mapping for existing translation keys
const CATEGORY_KEY_MAP: Record<string, string> = {
  interior: "interior",
  exterior: "exterior",
  protection: "glass",
};

export default async function DoplnkoveSluzbPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const [rawAddons, cmsTranslations] = await Promise.all([
    getAddons(),
    getCmsTranslations(locale),
  ]);

  // Group addons by addonCategory
  const groups: Record<string, typeof rawAddons> = {
    interior: [],
    exterior: [],
    protection: [],
  };

  for (const addon of rawAddons) {
    const cat = (addon as Record<string, unknown>).addonCategory as string ?? "interior";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(addon);
  }

  const addonCategories = Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([key, items]) => ({ key, services: items }));

  return (
    <>
      {/* Hero */}
      <PageHero
        title={t("doplnkoveSluzby.title")}
        subtitle={t("doplnkoveSluzby.subtitle")}
      />

      {/* Light bg wrapper */}
      <div className="bg-[#f0eff0]">
        {/* Tab navigation */}
        <section className="pt-[25px] lg:pt-[48px]">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <div className="flex justify-center">
              <div className="inline-flex items-center bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-[9px] overflow-x-auto">
                <Link
                  href="/sluzby"
                  className="font-clash text-[14px] font-medium text-[#302e2f] rounded-[10px] px-6 py-3 hover:text-[#7960a9] transition-colors whitespace-nowrap"
                >
                  {t("doplnkoveSluzby.tabs.programs")}
                </Link>
                <Link
                  href="/kategorie-vozidel"
                  className="font-clash text-[14px] font-medium text-[#302e2f] rounded-[10px] px-6 py-3 hover:text-[#7960a9] transition-colors whitespace-nowrap"
                >
                  {t("doplnkoveSluzby.tabs.vehicleCategories")}
                </Link>
                <Link
                  href="/doplnkove-sluzby"
                  className="font-clash text-[14px] font-medium text-white bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-6 py-3 whitespace-nowrap"
                >
                  {t("doplnkoveSluzby.tabs.additionalServices")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Addon service categories */}
        <section className="pt-[48px] lg:pt-[48px] pb-[40px] lg:pb-[80px]">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <div className="flex flex-col gap-[48px] lg:gap-[64px]">
              {addonCategories.map((category) => {
                const translationKey = CATEGORY_TITLES[category.key] ??
                  `doplnkoveSluzby.categories.${CATEGORY_KEY_MAP[category.key] ?? category.key}`;

                return (
                  <div
                    key={category.key}
                    className="flex flex-col gap-[25px] lg:gap-[32px]"
                  >
                    {/* Category heading with purple line */}
                    <div className="flex items-center gap-3">
                      <span className="w-[48px] h-[4px] rounded-full bg-gradient-to-r from-[#7960a9] to-[#9b7ec4]" />
                      <h2 className="font-clash text-[20px] lg:text-[30px] font-bold text-[#302e2f] leading-[28px] lg:leading-[36px]">
                        {t(translationKey)}
                      </h2>
                    </div>

                    {/* Service cards grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-[16px] lg:gap-[32px]">
                      {category.services.map((service) => {
                        const imageObj = service.image as { url?: string } | null | undefined;
                        const imageSrc = (typeof imageObj === "object" && imageObj?.url)
                          ? imageObj.url
                          : CATEGORY_FALLBACK_IMAGE[category.key] ?? "/images/service-interior.jpg";
                        const slug = service.slug as string;

                        return (
                          <div key={slug} className="flex flex-col">
                            {/* Card */}
                            <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] overflow-hidden flex flex-col h-full">
                              {/* Image area */}
                              <div className="relative h-[200px] lg:h-[256px]">
                                <Image
                                  src={imageSrc}
                                  alt={service.name ?? ""}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 50vw, 33vw"
                                />
                                {/* Dark overlay */}
                                <div className="absolute inset-0 bg-[#302e2f]/50" />

                                {/* Service name overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 flex flex-col items-center gap-1 lg:gap-2">
                                  <h3 className="font-clash font-bold text-[13px] lg:text-[24px] text-white text-center leading-[18px] lg:leading-[30px]">
                                    {service.name}
                                  </h3>
                                  {service.subtitle && (
                                    <p className="font-clash font-medium text-[11px] lg:text-[20px] text-white text-center leading-[14px] lg:leading-[20px]">
                                      {service.subtitle}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Content area */}
                              <div className="flex flex-col flex-1 p-[10px] lg:p-6 gap-[10px] lg:gap-4">
                                {/* Description */}
                                <p className="font-clash font-medium text-[11px] lg:text-[16px] text-[#302e2f] text-center leading-normal">
                                  {service.description ?? ""}
                                </p>

                                {/* Price */}
                                <div className="flex items-baseline justify-center gap-2 border-b border-[#f0eff0] pb-1 lg:pb-4">
                                  <span className="font-clash font-bold text-[20px] lg:text-[32px] text-[#7960a9] leading-[36px] lg:leading-[40px]">
                                    {service.price != null
                                      ? new Intl.NumberFormat(locale).format(service.price)
                                      : ""}
                                  </span>
                                  <span className="font-clash font-medium text-[12px] lg:text-[18px] text-[#b1b3b6] leading-[28px]">
                                    {t("common.currency")}
                                  </span>
                                </div>

                                {/* Buttons - desktop */}
                                <div className="hidden lg:flex items-center justify-center gap-[15px]">
                                  <Link
                                    href={`/sluzby/${slug}`}
                                    className="inline-flex items-center justify-center bg-[#302e2f] border-2 border-[#302e2f] rounded-[10px] h-[47px] w-[180px] font-clash font-bold text-[20px] text-white uppercase hover:bg-[#302e2f]/90 transition-colors backdrop-blur-[12px]"
                                  >
                                    {t("common.learnMore")}
                                  </Link>
                                  <Link
                                    href="/rezervace/vozidlo"
                                    className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] h-[47px] w-[180px] font-clash font-bold text-[20px] text-white uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
                                  >
                                    {t("common.bookNow")}
                                  </Link>
                                </div>

                                {/* Rating placeholder - desktop */}
                                <div className="hidden lg:flex items-center justify-center gap-2">
                                  <span className="font-clash text-[12px] font-medium text-[#b1b3b6]">
                                    {t("doplnkoveSluzby.rating")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Mobile bottom buttons */}
              <div className="grid grid-cols-2 gap-4 px-0 lg:hidden">
                <Link
                  href="/sluzby"
                  className="flex items-center justify-center bg-[#302e2f] rounded-[10px] px-8 py-4 font-clash font-bold text-[16px] text-white uppercase"
                >
                  {t("common.learnMore")}
                </Link>
                <Link
                  href="/rezervace/vozidlo"
                  className="flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-8 py-4 font-clash font-bold text-[16px] text-white uppercase"
                >
                  {t("common.bookNow")}
                </Link>
              </div>
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
