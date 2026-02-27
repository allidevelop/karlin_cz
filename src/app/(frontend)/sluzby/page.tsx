import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Check, ChevronRight } from "lucide-react";
import { getServices } from "@/lib/payload";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";

export const metadata: Metadata = {
  title: "Všechny naše služby",
  description:
    "Objevte portfolio našich prémiových služeb. Od expresního mytí po kompletní detailing.",
};

const IMAGE_MAP: Record<string, string> = {
  "exterior-komplet": "/images/service-exterior.jpg",
  "interior-komplet": "/images/service-interior.jpg",
  "to-go": "/images/service-togo.jpg",
  "to-glow": "/images/service-toglow.jpg",
  "to-wow": "/images/service-towow.jpg",
  "premium-detailing": "/images/service-premium.jpg",
};

export default async function SluzbyPage() {
  const services = await getServices();

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Všechny naše služby"
        subtitle="Objevte portfolio našich prémiových služeb"
      />

      {/* Light bg wrapper */}
      <div className="bg-[#f0eff0]">
        {/* Tab navigation */}
        <section className="pt-10 lg:pt-12">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <div className="flex justify-center">
              <div className="inline-flex items-center bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-[9px] overflow-x-auto">
                <Link
                  href="/sluzby"
                  className="font-clash text-[14px] font-medium text-white bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-5 py-2.5 whitespace-nowrap"
                >
                  Programy
                </Link>
                <Link
                  href="/kategorie-vozidel"
                  className="font-clash text-[14px] font-medium text-[#302e2f] rounded-[10px] px-5 py-2.5 hover:text-[#7960a9] transition-colors whitespace-nowrap"
                >
                  Kategorie vozidel
                </Link>
                <Link
                  href="/doplnkove-sluzby"
                  className="font-clash text-[14px] font-medium text-[#302e2f] rounded-[10px] px-5 py-2.5 hover:text-[#7960a9] transition-colors whitespace-nowrap"
                >
                  Doplňkové služby
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
                const imageSrc = IMAGE_MAP[slug];
                const features = (
                  service.features as
                    | { feature: string; id?: string }[]
                    | undefined
                )?.slice(0, 5);
                const isPopular = slug === "to-glow";

                return (
                  <div key={slug} className="relative">
                    {/* "Nejoblíbenější" badge */}
                    {isPopular && (
                      <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 z-10 hidden lg:flex">
                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] backdrop-blur-[7.5px] rounded-full px-8 py-2 font-clash font-bold text-[16px] text-white whitespace-nowrap">
                          Nejoblíbenější
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
                              od
                            </span>
                            <span className="font-clash font-bold text-[16px] lg:text-[29px] text-white">
                              {service.price != null
                                ? new Intl.NumberFormat("cs-CZ").format(
                                    service.price
                                  )
                                : ""}
                            </span>
                            <span className="font-clash font-normal text-[12px] lg:text-[18.8px] text-white">
                              Kč
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile: "Co je v programu?" link */}
                      <div className="lg:hidden px-4 py-3">
                        <Link
                          href={`/sluzby/${slug}`}
                          className="inline-flex items-center gap-1 font-clash text-[10px] font-medium text-[#302e2f] hover:text-[#7960a9] transition-colors"
                        >
                          Co je v programu?
                          <ChevronRight className="size-3" />
                        </Link>
                      </div>

                      {/* Desktop: Features + Buttons */}
                      <div className="hidden lg:flex flex-col flex-1 p-6">
                        {/* Features list */}
                        {features && features.length > 0 && (
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
                        )}

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Buttons */}
                        <div className="flex items-center justify-center gap-[15px]">
                          <Link
                            href={`/sluzby/${slug}`}
                            className="inline-flex items-center justify-center bg-[#302e2f] border-2 border-[#302e2f] rounded-[10px] h-[47px] w-[200px] font-clash font-bold text-[20px] text-white uppercase hover:bg-[#302e2f]/90 transition-colors"
                          >
                            Zjistit více
                          </Link>
                          <Link
                            href="/rezervace/vozidlo"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] h-[47px] w-[200px] font-clash font-bold text-[20px] text-white uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
                          >
                            Rezervace
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
        <NotFoundCTA />

        {/* Shared bottom: FAQ, Partners, Blog */}
        <SharedBottomSections wrapInLightBg={false} />
      </div>
    </>
  );
}
