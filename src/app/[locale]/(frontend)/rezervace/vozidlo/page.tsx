import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import SharedBottomSections from "@/components/shared/SharedBottomSections";
import { getTranslations } from "next-intl/server";
import { getVehicleCategories, getServices } from "@/lib/payload";

/** Fallback images for vehicle categories without CMS images */
const FALLBACK_IMAGE_MAP: Record<string, { desktop: string; mobile: string }> = {
  "hatchback-sedan": { desktop: "/images/vehicle-hatchback.png", mobile: "/images/vehicle-hatchback-mobile.png" },
  suv: { desktop: "/images/vehicle-suv-1.png", mobile: "/images/vehicle-suv-mobile.png" },
  "g-class-v-class-pickup": { desktop: "/images/vehicle-gclass-1.png", mobile: "/images/vehicle-gclass-mobile.png" },
  motocykly: { desktop: "/images/vehicle-moto-1.png", mobile: "/images/vehicle-moto-mobile.png" },
};

/** Slug -> booking vehicle param mapping */
const SLUG_TO_VEHICLE_PARAM: Record<string, string> = {
  "hatchback-sedan": "sedan",
  suv: "suv",
  "g-class-v-class-pickup": "g-class",
  motocykly: "motocykly",
};

export default async function VehicleStepPage() {
  const t = await getTranslations();
  const [vehicleCategories, services] = await Promise.all([
    getVehicleCategories(),
    getServices(),
  ]);

  // Build min price per vehicle category from CMS services
  const minPriceByCategory = new Map<string | number, number>();
  for (const service of services) {
    const pricingByVehicle = service.pricingByVehicle as
      | { vehicleCategory: { id?: number } | number; price: number }[]
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

  // Build categories list
  const categories = vehicleCategories.map((vc) => {
    const slug = vc.slug as string;
    const cmsImage = vc.image as { url?: string } | null | undefined;
    const cmsMobileImage = (vc as Record<string, unknown>).mobileImage as { url?: string } | null | undefined;
    const fallback = FALLBACK_IMAGE_MAP[slug];
    const vehicleParam = SLUG_TO_VEHICLE_PARAM[slug] ?? slug;

    return {
      id: vehicleParam,
      slug,
      name: vc.name ?? "",
      image: (typeof cmsImage === "object" && cmsImage?.url) ? cmsImage.url : (fallback?.desktop ?? ""),
      mobileImage: (typeof cmsMobileImage === "object" && cmsMobileImage?.url) ? cmsMobileImage.url : (fallback?.mobile ?? ""),
      price: minPriceByCategory.get(vc.id) ?? 0,
      altegioCategoryId: (vc as Record<string, unknown>).altegioCategoryId as number | undefined,
    };
  });

  return (
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
      <section className="py-8 lg:py-12">
        <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
          {/* Header row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-6 lg:mb-[30px] gap-3 lg:gap-4">
            <div>
              <h2 className="font-clash font-bold text-[28px] lg:text-[48px] text-[#302e2f] leading-[34px] lg:leading-[48px]">
                {t("booking.vehicle.title")}
              </h2>
              <p className="font-clash font-medium text-[14px] lg:text-[36px] text-[#302e2f] leading-[22px] lg:leading-normal mt-1">
                {t("booking.vehicle.subtitle")}
              </p>
            </div>
            <Link
              href="/sluzby"
              className="inline-flex items-center gap-2 bg-[#302e2f] text-[#f0eff0] font-clash font-medium text-[12px] lg:text-[14.6px] leading-[24px] rounded-[10px] px-5 lg:px-6 py-2.5 lg:py-3 hover:opacity-90 transition-opacity self-start lg:self-auto"
            >
              <span>{t("common.allServices")}</span>
              <ArrowRight className="size-[16px] lg:size-[18px]" />
            </Link>
          </div>

          {/* Vehicle category cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[24px]">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="card-hover-tint group relative rounded-[10px] overflow-hidden border border-[#b1b3b6] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-[2px] bg-[#f0eff0] h-[241px] lg:h-[480px] flex flex-col transition-all duration-300 hover:border-[#7960a9] hover:shadow-[0_0_30px_-5px_rgba(121,96,169,0.3)]"
              >
                {/* Hover glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[32px] blur-[12px] opacity-0 group-hover:opacity-30 transition-opacity -z-10" />

                {/* Top: Image */}
                <div className="relative flex-1 lg:h-[240px] overflow-hidden">
                  {/* Desktop image */}
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover hidden lg:block"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Mobile image */}
                  <Image
                    src={cat.mobileImage}
                    alt={cat.name}
                    fill
                    className="object-cover lg:hidden"
                    sizes="50vw"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-[#302e2f]/40 mix-blend-multiply" />

                  {/* Category label */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 lg:px-6 pb-4 lg:pb-6">
                    <h3 className="font-clash font-bold text-[13px] lg:text-[25px] text-[#f0eff0] uppercase tracking-[0.35px] leading-[17.5px] lg:leading-[30px]">
                      {cat.name.split(" / ").map((part: string, i: number, arr: string[]) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && <>{" / "}<br className="hidden lg:inline" /></>}
                        </span>
                      ))}
                    </h3>
                  </div>

                  {/* Purple gradient overlay on mobile */}
                  <div className="lg:hidden absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#7960a9]/60 to-transparent" />
                </div>

                {/* Bottom: Price + CTA */}
                <div className="p-3 lg:p-6 lg:h-[240px] flex flex-col items-center justify-center">
                  {/* Mobile price layout */}
                  <div className="lg:hidden text-center mb-2">
                    <span className="font-clash font-bold text-[10px] text-[#302e2f]/50 uppercase tracking-[0.6px] block mb-0.5">
                      {t("common.pricesFrom")}
                    </span>
                    <div className="flex items-baseline justify-center gap-0.5">
                      <span className="font-clash font-bold text-[28px] leading-[28px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] bg-clip-text text-transparent">
                        {cat.price}
                      </span>
                      <span className="font-clash font-bold text-[14px] text-[#7960a9]">
                        {t("common.currency")}
                      </span>
                    </div>
                  </div>

                  {/* Desktop price layout */}
                  <div className="hidden lg:flex flex-col items-center gap-2 flex-1 justify-center">
                    <span className="font-clash font-bold text-[12px] text-[#302e2f]/50 uppercase tracking-[0.6px] leading-[16px]">
                      {t("common.pricesFrom")}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-clash font-bold text-[60px] leading-[60px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] bg-clip-text text-transparent">
                        {cat.price}
                      </span>
                      <span className="font-clash font-bold text-[22.9px] leading-[32px] text-[#7960a9]">
                        {t("common.currency")}
                      </span>
                    </div>
                  </div>

                  {/* Mobile: single CTA button */}
                  <Link
                    href={`/rezervace/program?vehicle=${cat.id}`}
                    className="lg:hidden w-full bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[11px] uppercase leading-[24px] rounded-[8px] py-2 text-center hover:opacity-90 transition-opacity"
                  >
                    {t("services.chooseProgram")}
                  </Link>

                  {/* Desktop: single CTA button */}
                  <div className="hidden lg:flex items-center w-full">
                    <Link
                      href={`/rezervace/program?vehicle=${cat.id}`}
                      className="w-full inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] h-[47px] font-clash font-bold text-[14px] text-white uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
                    >
                      {t("services.chooseProgram")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shared bottom sections: FAQ, Partners, Blog, Newsletter */}
      <SharedBottomSections wrapInLightBg={false} pageSlug="booking" />
      </div>
    </div>
  );
}
