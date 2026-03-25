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
                          <Link key={slug} href={`/sluzby/${slug}`} className="group relative">
                            <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden h-full flex flex-col">
                              {/* Hover glow */}
                              <div className="absolute -inset-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[32px] blur-[12px] opacity-0 group-hover:opacity-30 transition-opacity -z-10 hidden lg:block" />

                              {/* Image area */}
                              <div className="relative h-[180px] lg:h-[256px]">
                                <Image
                                  src={imageSrc}
                                  alt={service.name ?? ""}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-[#302e2f]/15 lg:bg-[#302e2f]/50" />

                                {/* Name + price overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                                  <h3 className="font-clash font-bold text-[13px] lg:text-[20px] text-white uppercase leading-[18px] lg:leading-[26px]">
                                    {service.name}
                                  </h3>
                                  <div className="flex items-baseline gap-1 mt-1 lg:mt-2">
                                    <span className="font-clash font-bold text-[16px] lg:text-[29px] text-white">
                                      {service.price != null
                                        ? new Intl.NumberFormat(locale).format(service.price)
                                        : ""}
                                    </span>
                                    <span className="font-clash font-normal text-[12px] lg:text-[18px] text-white">
                                      {t("common.currency")}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Bottom: description + CTA */}
                              <div className="flex flex-col flex-1 p-4 lg:p-6">
                                {service.description && (
                                  <p className="font-clash font-medium text-[11px] lg:text-[14px] text-[#302e2f]/70 leading-relaxed line-clamp-2 mb-3">
                                    {service.description}
                                  </p>
                                )}
                                <div className="flex-1" />
                                <span className="w-full flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[12px] lg:text-[14px] uppercase leading-[24px] rounded-[10px] py-3 hover:opacity-90 transition-opacity">
                                  {t("common.learnMore")}
                                </span>
                              </div>
                            </div>
                          </Link>
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
