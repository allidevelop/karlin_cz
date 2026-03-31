import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getVehicleCategories, getServices } from "@/lib/payload";

/** Fallback images for vehicle categories without CMS images */
const FALLBACK_IMAGE_MAP: Record<string, string> = {
  "hatchback-sedan": "/images/vehicle-hatchback.png",
  suv: "/images/vehicle-suv-1.png",
  "g-class-v-class-pickup": "/images/vehicle-gclass-1.png",
  motocykly: "/images/vehicle-moto-1.png",
};

/** Slug -> booking vehicle param mapping */
const SLUG_TO_VEHICLE_PARAM: Record<string, string> = {
  "hatchback-sedan": "sedan",
  suv: "suv",
  "g-class-v-class-pickup": "g-class",
  motocykly: "motocykly",
};

type Props = {
  cmsTitle?: string | null;
  cmsSubtitle?: string | null;
  cmsChooseProgramButton?: string | null;
  cmsAllServicesButton?: string | null;
};

export default async function ServicesSection({ cmsTitle, cmsSubtitle, cmsChooseProgramButton, cmsAllServicesButton }: Props) {
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

  // Build vehicle cards from CMS data
  const vehicleCards = vehicleCategories.map((vc) => {
    const slug = vc.slug as string;
    const cmsImage = vc.image as { url?: string } | null | undefined;
    const imageSrc = (typeof cmsImage === "object" && cmsImage?.url) ? cmsImage.url : (FALLBACK_IMAGE_MAP[slug] ?? "");
    const vehicleParam = SLUG_TO_VEHICLE_PARAM[slug] ?? slug;
    const price = minPriceByCategory.get(vc.id) ?? 0;

    return {
      id: vehicleParam,
      name: vc.name ?? "",
      image: imageSrc,
      price,
      href: `/rezervace/program?vehicle=${vehicleParam}`,
    };
  });

  return (
    <section id="services" className="pb-[80px] -mt-px">
      <div className="max-w-[1536px] mx-auto pt-[25px] px-4 lg:px-[32px]">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[30px] gap-4">
          <div>
            <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
              {t("services.title")}
            </h2>
            <p className="font-clash font-medium text-[15.1px] lg:text-[36px] text-[#302e2f] leading-[24px] lg:leading-normal mt-1 lg:mt-0">
              {t("services.subtitle")}
            </p>
          </div>
          {/* Desktop only — button in header row */}
          <Link
            href="/sluzby"
            className="hidden lg:inline-flex items-center gap-2 bg-[#302e2f] border border-[#f0eff0] text-[#f0eff0] font-clash font-medium text-[14.6px] leading-[24px] rounded-[10px] px-6 py-3 hover:opacity-90 transition-opacity"
          >
            {t("services.allServices")}
            <ArrowRight className="size-[18px]" />
          </Link>
        </div>

        {/* Vehicle category cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[25px]">
          {vehicleCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="card-hover-tint group relative rounded-[10px] overflow-hidden border border-[#b1b3b6] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-[2px] bg-[#f0eff0] h-[241px] lg:h-[480px] flex flex-col transition-all duration-300 hover:border-[#7960a9] hover:shadow-[0_0_30px_-5px_rgba(121,96,169,0.3)]"
            >
              {/* Hover glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[32px] blur-[12px] opacity-0 group-hover:opacity-30 transition-opacity -z-10" />

              {/* Top: Image */}
              <div className="relative flex-1 lg:h-[240px] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#302e2f]/40 mix-blend-multiply" />
                {/* Category label */}
                <div className="absolute bottom-0 left-0 right-0 px-4 lg:px-6 pb-5 lg:pb-7">
                  <span className="font-clash font-bold text-[15px] lg:text-[20px] text-[#f0eff0] uppercase tracking-[0.5px] leading-[20px] lg:leading-[26px]">
                    {card.name}
                  </span>
                </div>
                {/* Purple gradient overlay on mobile */}
                <div className="lg:hidden absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#7960a9] to-transparent" />
              </div>

              {/* Bottom: Price + CTA */}
              <div className="p-4 lg:p-6 lg:h-[240px] flex flex-col items-center justify-center">
                {/* Mobile price layout */}
                <div className="lg:hidden text-center">
                  <span className="font-clash font-normal text-[15px] text-[#302e2f]">{t("common.priceFrom")} </span>
                  <span className="font-clash font-bold text-[20px] text-[#7960a9]">{card.price}</span>
                  <span className="font-clash font-normal text-[15px] text-[#7960a9]"> {t("common.currency")}</span>
                </div>

                {/* Desktop price layout */}
                <div className="hidden lg:flex flex-col items-center gap-2 flex-1 justify-center">
                  <span className="font-clash font-bold text-[12px] text-[#302e2f]/50 uppercase tracking-[0.6px] leading-[16px]">
                    {t("common.pricesFrom")}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-clash font-bold text-[60px] leading-[60px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] bg-clip-text text-transparent">
                      {card.price}
                    </span>
                    <span className="font-clash font-bold text-[22.9px] leading-[32px] text-[#7960a9]">
                      {t("common.currency")}
                    </span>
                  </div>
                </div>

                {/* CTA button (desktop only) */}
                <button className="hidden lg:flex w-full items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[14px] uppercase leading-[24px] rounded-[10px] py-[14px] hover:opacity-90 transition-opacity">
                  {t("services.chooseProgram")}
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile only — button below grid */}
        <Link
          href="/sluzby"
          className="lg:hidden flex items-center justify-center gap-2 bg-[#302e2f] border border-[#f0eff0] text-[#f0eff0] font-clash font-medium text-[14.6px] leading-[24px] rounded-[10px] px-6 py-4 w-full hover:opacity-90 transition-opacity mt-6"
        >
          {t("services.allServices")}
          <ArrowRight className="size-[18px]" />
        </Link>
      </div>
    </section>
  );
}
