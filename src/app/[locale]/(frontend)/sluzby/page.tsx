import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Check, ChevronRight } from "lucide-react";
import { getPrograms, getTranslations as getCmsTranslations } from "@/lib/payload";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.servicesTitle"),
    description: t("metadata.servicesDescription"),
  };
}

const FALLBACK_IMAGE_MAP: Record<string, string> = {
  "exterior-komplet": "/images/service-exterior.jpg",
  "interior-komplet": "/images/service-interior.jpg",
  "to-go": "/images/service-togo.jpg",
  "to-glow": "/images/service-toglow.jpg",
  "to-wow": "/images/service-towow.jpg",
  "premium-detailing": "/images/service-premium.jpg",
  "premium-detailing-komplet": "/images/service-premium.jpg",
  "komplexni-myti": "/images/service-togo.jpg",
};

export default async function SluzbyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [services, cmsTranslations] = await Promise.all([
    getPrograms(6, locale),
    getCmsTranslations(locale),
  ]);
  const t = await getTranslations();

  return (
    <>
      {/* Hero */}
      <PageHero
        title={t("servicesPage.title")}
        subtitle={t("servicesPage.subtitle")}
      />

      {/* Light bg wrapper */}
      <div className="relative bg-[#f0eff0] overflow-hidden">
        {/* Background wave decoration at 40% opacity, matching akce page */}
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
        {/* Tab navigation */}
        <section className="pt-10 lg:pt-12">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <div className="flex justify-center">
              <div className="inline-flex items-center bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-[9px] overflow-x-auto">
                <Link
                  href="/sluzby"
                  className="font-clash text-[14px] font-medium text-white bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-5 py-2.5 whitespace-nowrap"
                >
                  {t("doplnkoveSluzby.tabs.programs")}
                </Link>
                <Link
                  href="/kategorie-vozidel"
                  className="font-clash text-[14px] font-medium text-[#302e2f] rounded-[10px] px-5 py-2.5 hover:text-[#7960a9] transition-colors whitespace-nowrap"
                >
                  {t("doplnkoveSluzby.tabs.vehicleCategories")}
                </Link>
                <Link
                  href="/doplnkove-sluzby"
                  className="font-clash text-[14px] font-medium text-[#302e2f] rounded-[10px] px-5 py-2.5 hover:text-[#7960a9] transition-colors whitespace-nowrap"
                >
                  {t("doplnkoveSluzby.tabs.additionalServices")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Service cards grid */}
        <section className="pt-10 lg:pt-12 pb-6">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-[16px] lg:gap-x-[32px] lg:gap-y-[72px]">
              {services.map((service) => {
                const slug = service.slug as string;
                const imageObj = service.image as { url?: string } | null | undefined;
                const imageSrc = (typeof imageObj === "object" && imageObj?.url) ? imageObj.url : FALLBACK_IMAGE_MAP[slug];
                const features = (
                  service.features as
                    | { feature: string; id?: string }[]
                    | undefined
                );
                const badgeText = (service as Record<string, unknown>).badge as string | null | undefined;
                const description = (service as Record<string, unknown>).description as string | null | undefined;

                return (
                  <div key={slug} className="relative">
                    {/* Badge (from CMS) */}
                    {badgeText && (
                      <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 z-10 hidden lg:flex">
                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] backdrop-blur-[7.5px] rounded-full px-8 py-2 font-clash font-bold text-[16px] text-white whitespace-nowrap">
                          {badgeText}
                        </span>
                      </div>
                    )}

                    {/* Card */}
                    <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden h-full flex flex-col">
                      {/* Image area */}
                      <div className="relative h-[240px] lg:h-[256px]">
                        {imageSrc && (
                          <Image
                            src={imageSrc}
                            alt={service.name ?? ""}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 33vw"
                          />
                        )}
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-[#302e2f]/15 lg:bg-[#302e2f]/50" />

                        {/* Bottom content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                          <h3 className="font-clash font-bold text-[13px] lg:text-[24px] text-white uppercase leading-[18px] lg:leading-[32px]">
                            {service.name}
                          </h3>
                          <div className="flex items-baseline gap-1 mt-1 lg:mt-2">
                            <span className="font-clash text-[10px] lg:text-[12px] font-normal text-[#b1b3b6] uppercase tracking-[0.6px]">
                              {t("common.priceFrom")}
                            </span>
                            <span className="font-clash font-bold text-[16px] lg:text-[29px] text-white">
                              {service.price != null
                                ? new Intl.NumberFormat(locale).format(
                                    service.price
                                  )
                                : ""}
                            </span>
                            <span className="font-clash font-normal text-[12px] lg:text-[18.8px] text-white">
                              {t("common.currency")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile: "Více o programu?" link */}
                      <div className="lg:hidden px-4 py-3">
                        <Link
                          href={`/sluzby/${slug}`}
                          className="inline-flex items-center gap-1 font-clash text-[12px] font-medium text-[#302e2f] hover:text-[#7960a9] transition-colors"
                        >
                          {t("booking.program.whatsIncluded")}
                          <ChevronRight className="size-3" />
                        </Link>
                      </div>

                      {/* Desktop: Features + Buttons */}
                      <div className="hidden lg:flex flex-col flex-1 p-6">
                        {/* Features list or description fallback */}
                        {features && features.length > 0 ? (
                          <div className="flex flex-col gap-3 mb-6">
                            {features.map((f, i) => (
                              <div
                                key={f.id ?? i}
                                className="flex items-start gap-2"
                              >
                                <Check className="size-[18px] text-[#7960a9] shrink-0 mt-0.5" />
                                <span className="font-clash font-normal text-[13.3px] text-[#302e2f] leading-[22.75px]">
                                  {f.feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : description ? (
                          <p className="font-clash font-medium text-[14px] text-[#302e2f] leading-relaxed mb-6">
                            {description}
                          </p>
                        ) : null}

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Buttons */}
                        <div className="flex items-center justify-center gap-[15px]">
                          <Link
                            href={`/sluzby/${slug}`}
                            className="inline-flex items-center justify-center bg-[#302e2f] border-2 border-[#302e2f] rounded-[10px] h-[47px] w-[200px] font-clash font-bold text-[20px] text-white uppercase hover:bg-[#302e2f]/90 transition-colors"
                          >
                            {t("common.learnMore")}
                          </Link>
                          <Link
                            href="/rezervace/vozidlo"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] h-[47px] w-[200px] font-clash font-bold text-[20px] text-white uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
                          >
                            {t("common.bookNow")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* "Nenašli jste co hledáte?" CTA */}
        <NotFoundCTA
          cmsBookNowButton={cmsTranslations?.notFoundBookButton}
          cmsCallUsButton={cmsTranslations?.notFoundCallButton}
        />

        {/* Shared bottom: FAQ, Partners, Blog */}
        <SharedBottomSections wrapInLightBg={false} pageSlug="services" />
        </div>
      </div>
    </>
  );
}
