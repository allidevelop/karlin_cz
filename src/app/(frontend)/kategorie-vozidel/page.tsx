import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getVehicleCategories, getServices } from "@/lib/payload";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";

export const metadata: Metadata = {
  title: "Kategorie vozidel",
  description:
    "Vyberte kategorii vašeho vozidla a zjistěte ceny služeb mytí a detailingu.",
};

/** Map vehicle category slug -> image path (desktop + mobile variants) */
const IMAGE_MAP: Record<string, { desktop: string; mobile: string }> = {
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

export default async function KategorieVozidelPage() {
  const [categories, services] = await Promise.all([
    getVehicleCategories(),
    getServices(),
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
        title="Kategorie vozidel"
        subtitle="Vyberte kategorii vašeho vozidla"
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
                  Programy
                </Link>
                <Link
                  href="/kategorie-vozidel"
                  className="font-clash text-[14px] font-medium text-white bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] px-6 py-3 whitespace-nowrap leading-normal text-center"
                >
                  <span className="lg:hidden">
                    Kategorie
                    <br />
                    vozidel
                  </span>
                  <span className="hidden lg:inline">Kategorie vozidel</span>
                </Link>
                <Link
                  href="/doplnkove-sluzby"
                  className="font-clash text-[14px] font-medium text-[#302e2f] rounded-[10px] px-6 py-3 hover:text-[#7960a9] transition-colors whitespace-nowrap leading-normal text-center"
                >
                  <span className="lg:hidden">
                    Doplňkové
                    <br />
                    služby
                  </span>
                  <span className="hidden lg:inline">Doplňkové služby</span>
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
                const images = IMAGE_MAP[slug];

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
                        <div className="lg:hidden absolute bottom-0 left-0 right-0 px-6 pb-6 flex flex-col items-center gap-[10px]">
                          <h3 className="font-clash font-bold text-[13px] text-[#f0eff0] uppercase tracking-[0.35px] leading-[17.5px] text-center">
                            {cat.name}
                          </h3>
                          {minPrice != null && (
                            <div className="flex items-center gap-[6px] text-[#f0eff0]">
                              <span className="font-clash font-bold text-[20px] leading-[36px]">
                                {new Intl.NumberFormat("cs-CZ").format(
                                  minPrice
                                )}
                              </span>
                              <span className="font-clash font-normal text-[16.7px] leading-[28px]">
                                Kč
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Category name on image (desktop) */}
                        <div className="hidden lg:block absolute bottom-0 left-0 right-0 px-6 pb-6 pt-[23px]">
                          <h3 className="font-clash font-bold text-[14px] text-[#f0eff0] uppercase tracking-[0.35px] leading-[17.5px]">
                            {cat.name}
                          </h3>
                        </div>
                      </div>

                      {/* Mobile: "Zjistit více" link */}
                      <div className="lg:hidden flex items-center justify-center gap-[5px] h-[22px] p-[10px]">
                        <Link
                          href={`/kategorie-vozidel/${slug}`}
                          className="font-clash text-[10px] font-medium text-[#302e2f] hover:text-[#7960a9] transition-colors"
                        >
                          Zjistit více
                        </Link>
                        <ChevronRight className="size-4 text-[#302e2f]" />
                      </div>

                      {/* Desktop: Price + Buttons area */}
                      <div className="hidden lg:flex flex-col items-center h-[240px] p-6 backdrop-blur-[5px]">
                        {/* Price section - centered vertically in available space */}
                        <div className="flex-1 flex items-center justify-center">
                          <div className="flex flex-col gap-2 items-center">
                            <span className="font-clash font-bold text-[12px] text-[#b1b3b6] uppercase tracking-[0.6px] leading-[16px]">
                              ceny od
                            </span>
                            <div className="flex items-baseline gap-1">
                              {minPrice != null ? (
                                <>
                                  <span className="font-clash font-bold text-[60px] leading-[60px] text-[#7960a9]">
                                    {new Intl.NumberFormat("cs-CZ").format(
                                      minPrice
                                    )}
                                  </span>
                                  <span className="font-clash font-bold text-[22.9px] leading-[32px] text-[#7960a9]">
                                    Kč
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

                        {/* Buttons */}
                        <div className="flex items-center justify-center gap-[15px] w-full">
                          <Link
                            href={`/kategorie-vozidel/${slug}`}
                            className="inline-flex items-center justify-center bg-[#302e2f] border-2 border-[#302e2f] backdrop-blur-[12px] rounded-[10px] h-[47px] w-[160px] font-clash font-bold text-[18px] text-[#f0eff0] uppercase hover:bg-[#302e2f]/90 transition-colors"
                          >
                            Zjistit více
                          </Link>
                          <Link
                            href="/rezervace/vozidlo"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] h-[47px] w-[160px] font-clash font-bold text-[18px] text-[#f0eff0] uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
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

        {/* "Nenasli jste co hledate?" CTA */}
        <NotFoundCTA />

        {/* Shared bottom: FAQ, Partners, Blog */}
        <SharedBottomSections wrapInLightBg={false} />
      </div>
    </>
  );
}
