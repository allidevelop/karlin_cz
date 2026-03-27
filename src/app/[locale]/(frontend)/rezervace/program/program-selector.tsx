"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Check, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useBookingStore } from "@/stores/booking-store";
import CartSidebar from "@/components/shared/CartSidebar";

/** Serialized program from CMS */
export interface CMSProgram {
  id: string;
  slug: string;
  name: string;
  price: number;
  duration: string | null;
  imageUrl: string | null;
  badge: string | null;
  features: string[];
  pricingByVehicle: Array<{
    vehicleCategorySlug: string;
    altegioCategoryId: number | null;
    price: number;
    altegioServiceId: number | null;
  }>;
  altegioId: number | null;
}

/** Serialized vehicle category from CMS */
export interface CMSVehicleCategory {
  id: string;
  slug: string;
  name: string;
  altegioCategoryId: number | null;
}

// Static fallback images for programs without CMS images
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

interface ProgramItem {
  id: string;
  name: string;
  price: number;
  altegioId: number;
  duration: string | null;
  badge: string | null;
  features: string[];
  imageUrl: string | null;
}

function buildProgramsForVehicle(
  programs: CMSProgram[],
  vehicleSlug: string | null,
  vehicleCategories: CMSVehicleCategory[],
  verifiedPrices: Record<number, number> = {}
): ProgramItem[] {
  // Find the vehicle's altegioCategoryId
  const vehicle = vehicleCategories.find((v) => v.slug === vehicleSlug);
  const altegioCatId = vehicle?.altegioCategoryId;

  return programs
    .map((program) => {
      // Find the pricing for the selected vehicle
      const vehiclePricing = program.pricingByVehicle.find(
        (p) => p.altegioCategoryId === altegioCatId
      );

      if (!vehiclePricing && program.pricingByVehicle.length > 0) {
        return null;
      }

      const altegioId = vehiclePricing?.altegioServiceId ?? program.altegioId ?? 0;
      // Use verified price from Altegio if available, otherwise CMS price
      const cmsPrice = vehiclePricing?.price ?? program.price;
      const price = (altegioId && verifiedPrices[altegioId]) ? verifiedPrices[altegioId] : cmsPrice;

      return {
        id: program.slug,
        name: program.name,
        price,
        altegioId,
        duration: program.duration,
        badge: program.badge,
        features: program.features,
        imageUrl: program.imageUrl || FALLBACK_IMAGE_MAP[program.slug] || null,
      };
    })
    .filter(Boolean) as ProgramItem[];
}

export default function ProgramSelector({
  programs,
  vehicleCategories,
}: {
  programs: CMSProgram[];
  vehicleCategories: CMSVehicleCategory[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();

  // Zustand store
  const store = useBookingStore();

  // UI-only local state
  const [expanded, setExpanded] = useState<string | null>(null);
  const [verifiedPrices, setVerifiedPrices] = useState<Record<number, number>>({});

  // Reverse mapping: short vehicle param -> CMS slug
  const vehicleParamToSlug: Record<string, string> = {
    sedan: "hatchback-sedan",
    suv: "suv",
    "g-class": "g-class-v-class-pickup",
    motocykly: "motocykly",
  };

  // Always sync URL param "vehicle" to store (handles navigating between categories)
  useEffect(() => {
    const vehicleParam = searchParams.get("vehicle");
    if (!vehicleParam) return;
    const cmsSlug = vehicleParamToSlug[vehicleParam] ?? vehicleParam;
    // Only update if the slug actually changed
    if (cmsSlug === store.vehicleCategory) return;
    const vCat = vehicleCategories.find(
      (v) => v.slug === cmsSlug
    );
    store.setVehicleCategory(
      cmsSlug,
      cmsSlug,
      vCat?.altegioCategoryId ?? undefined
    );
  }, [searchParams, store.vehicleCategory, store.setVehicleCategory, vehicleCategories]);

  // Verify prices from Altegio on mount
  useEffect(() => {
    const allAltegioIds = programs.flatMap((p) =>
      p.pricingByVehicle.map((pv) => pv.altegioServiceId).filter(Boolean)
    ) as number[];

    if (allAltegioIds.length === 0) return;

    const uniqueIds = [...new Set(allAltegioIds)];
    fetch(`/api/booking/verify-prices?ids=${uniqueIds.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.prices && typeof data.prices === "object") {
          setVerifiedPrices(data.prices);
        }
      })
      .catch(() => {
        // Silently fail — use CMS prices
      });
  }, [programs]);

  // Build programs based on selected vehicle
  const displayPrograms = useMemo(
    () => buildProgramsForVehicle(programs, store.vehicleCategory, vehicleCategories, verifiedPrices),
    [programs, store.vehicleCategory, vehicleCategories, verifiedPrices]
  );

  // Derive the selected program from the store
  const selectedProgram = store.selectedProgram
    ? displayPrograms.find((p) => p.id === store.selectedProgram!.id) ?? null
    : null;

  const toggleSelect = (programId: string) => {
    if (store.selectedProgram?.id === programId) {
      store.clearProgram();
    } else {
      const program = displayPrograms.find((p) => p.id === programId);
      if (program) {
        store.setProgram({
          id: program.id,
          name: program.name,
          price: program.price,
          altegioId: program.altegioId,
        });
      }
    }
  };

  const handleContinue = () => {
    if (store.selectedProgram) {
      router.push("/rezervace/doplnky");
    }
  };

  // Mobile: separate expanded card from non-expanded for layout
  const mobileExpandedProgram = displayPrograms.find(
    (p) => expanded === p.id
  );
  const mobileCollapsedPrograms = displayPrograms.filter(
    (p) => expanded !== p.id
  );

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="lg:grid lg:grid-cols-[1fr_384px] lg:gap-10">
          {/* Left column: Title + Cards */}
          <div>
            {/* Mobile: title + change category button */}
            <div className="lg:hidden mb-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-clash font-bold text-[24px] text-[#302e2f] leading-[30px]">
                    {t("booking.program.title")}
                  </h2>
                  <p className="font-clash font-medium text-[14px] text-[#302e2f]/70 leading-[20px] mt-1">
                    {t("booking.program.subtitle")}
                  </p>
                </div>
                <Link
                  href="/rezervace/vozidlo"
                  className="inline-flex items-center gap-1 bg-[#302e2f] rounded-[10px] px-4 py-2.5 font-clash text-[11px] font-bold text-white shrink-0"
                >
                  {"\u2190"} {t("booking.program.changeCategory")}
                </Link>
              </div>
            </div>

            {/* ─── Mobile layout ─── */}
            <div className="lg:hidden">
              {/* Expanded card (full width) */}
              {mobileExpandedProgram && (
                <div className="mb-4">
                  <div className="bg-[#f0eff0] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden border-2 border-[#7960a9]">
                    {/* Image area */}
                    <div className="relative h-[200px]">
                      {mobileExpandedProgram.imageUrl && (
                        <Image
                          src={mobileExpandedProgram.imageUrl}
                          alt={mobileExpandedProgram.name}
                          fill
                          className="object-cover"
                          sizes="100vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-[#302e2f]/50" />
                      {/* Badge */}
                      {mobileExpandedProgram.badge && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-full px-3 py-1 font-clash font-bold text-[10px] text-white">
                            {mobileExpandedProgram.badge}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-clash font-bold text-[18px] text-white uppercase leading-[22px]">
                          {mobileExpandedProgram.name}
                        </h3>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="font-clash font-bold text-[22px] text-white">
                            {new Intl.NumberFormat(locale).format(mobileExpandedProgram.price)}
                          </span>
                          <span className="font-clash font-normal text-[14px] text-white">
                            {t("common.currency")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="p-4">
                      <div className="flex flex-col gap-3 mb-4">
                        {mobileExpandedProgram.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="size-4 text-[#7960a9] shrink-0 mt-0.5" />
                            <span className="font-clash font-medium text-[13px] text-[#302e2f] leading-[20px]">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Skrýt link */}
                      <button
                        type="button"
                        onClick={() => setExpanded(null)}
                        className="flex items-center gap-1 font-clash text-[12px] font-medium text-[#7960a9] hover:text-[#9b7ec4] transition-colors mb-4 mx-auto"
                      >
                        {t("booking.program.hide")}
                        <ChevronUp className="size-3" />
                      </button>

                      {/* Odebrat button */}
                      <button
                        type="button"
                        onClick={() => toggleSelect(mobileExpandedProgram.id)}
                        className="w-full flex items-center justify-center font-clash font-bold text-[13px] rounded-[10px] py-3 bg-[#302e2f] text-white hover:bg-[#302e2f]/90 transition-colors"
                      >
                        {t("booking.program.remove")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Collapsed cards grid (2 columns) */}
              <div className="grid grid-cols-2 gap-[16px]">
                {mobileCollapsedPrograms.map((program) => {
                  const isSelected = store.selectedProgram?.id === program.id;
                  const imageSrc = program.imageUrl;

                  return (
                    <div key={program.id} className="relative">
                      <div
                        className={`bg-[#f0eff0] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col border-2 ${
                          isSelected
                            ? "border-[#7960a9] shadow-[0px_10px_25px_-3px_rgba(121,96,169,0.3)]"
                            : "border-[#b1b3b6]"
                        }`}
                      >
                        {/* Image area */}
                        <button
                          type="button"
                          onClick={() => toggleSelect(program.id)}
                          className="relative h-[180px] w-full text-left"
                        >
                          {imageSrc && (
                            <Image
                              src={imageSrc}
                              alt={program.name}
                              fill
                              className="object-cover"
                              sizes="50vw"
                            />
                          )}
                          <div className="absolute inset-0 bg-[#302e2f]/50" />
                          {/* Badge */}
                          {program.badge && (
                            <div className="absolute top-3 left-3 z-10">
                              <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-full px-2.5 py-0.5 font-clash font-bold text-[9px] text-white">
                                {program.badge}
                              </span>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="font-clash font-bold text-[13px] text-white uppercase leading-[18px]">
                              {program.name}
                            </h3>
                            <div className="flex items-baseline gap-1 mt-1">
                              <span className="font-clash font-bold text-[18px] text-white">
                                {new Intl.NumberFormat(locale).format(program.price)}
                              </span>
                              <span className="font-clash font-normal text-[12px] text-white">
                                {t("common.currency")}
                              </span>
                            </div>
                          </div>
                        </button>

                        {/* "Co je v programu?" link */}
                        <div className="px-3 py-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              toggleSelect(program.id);
                              setExpanded(program.id);
                            }}
                            className="flex items-center gap-1 font-clash text-[10px] font-medium text-[#7960a9] hover:text-[#9b7ec4] transition-colors"
                          >
                            {t("booking.program.whatsIncluded")}
                            <ChevronDown className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── Desktop layout (unchanged) ─── */}
            <div className="hidden lg:block lg:columns-2 lg:gap-[24px]">
              {displayPrograms.map((program) => {
                const isSelected = store.selectedProgram?.id === program.id;
                const isExpanded = expanded === program.id;
                const imageSrc = program.imageUrl;

                return (
                  <div key={program.id} className="relative mb-[24px] break-inside-avoid">
                    {/* Badge (from CMS) */}
                    {program.badge && (
                      <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 z-10 flex">
                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] backdrop-blur-[7.5px] rounded-full px-8 py-2 font-clash font-bold text-[16px] text-white whitespace-nowrap">
                          {program.badge}
                        </span>
                      </div>
                    )}

                    <div
                      className={`bg-[#f0eff0] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden transition-all h-full flex flex-col border-2 ${
                        isSelected
                          ? "border-[#7960a9] shadow-[0px_10px_25px_-3px_rgba(121,96,169,0.3)]"
                          : "border-[#b1b3b6]"
                      }`}
                    >
                      {/* Image area */}
                      <div className="relative h-[192px]">
                        {imageSrc && (
                          <Image
                            src={imageSrc}
                            alt={program.name}
                            fill
                            className="object-cover"
                            sizes="33vw"
                          />
                        )}
                        <div className="absolute inset-0 bg-[#302e2f]/60" />
                        {/* Duration badge — top left */}
                        {program.duration && (
                          <span className="absolute top-4 left-4 z-10 inline-flex items-center bg-[#f0eff0]/20 backdrop-blur-sm rounded-full px-3 py-1 font-clash text-[12px] font-medium text-white whitespace-nowrap">
                            {program.duration}
                          </span>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="font-clash font-bold text-[24px] text-white uppercase leading-[32px]">
                            {program.name}
                          </h3>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="font-clash text-[12px] font-normal text-[#f0eff0]/70 uppercase tracking-[0.6px]">
                              {t("common.priceFrom")}
                            </span>
                            <span className="font-clash font-bold text-[27px] text-white">
                              {new Intl.NumberFormat(locale).format(program.price)}
                            </span>
                            <span className="font-clash font-normal text-[17px] text-white">
                              {t("common.currency")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content below image */}
                      <div className="flex flex-col flex-1 p-5">
                        <button
                          type="button"
                          onClick={() => setExpanded(isExpanded ? null : program.id)}
                          className="flex items-center gap-1 font-clash text-[13px] font-medium text-[#7960a9] hover:text-[#9b7ec4] transition-colors mb-3"
                        >
                          {isExpanded ? t("booking.program.hide") : t("booking.program.whatsIncluded")}
                          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </button>

                        {isExpanded && (
                          <div className="flex flex-col gap-2.5 mb-4">
                            {program.features.map((feature, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <Check className="size-[18px] text-[#7960a9] shrink-0 mt-0.5" />
                                <span className="font-clash font-medium text-[13px] text-[#302e2f] leading-[22.75px]">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex-1" />

                        <button
                          type="button"
                          onClick={() => toggleSelect(program.id)}
                          className={`w-full flex items-center justify-center gap-1.5 font-clash font-bold text-[14px] rounded-[10px] py-3 transition-all ${
                            isSelected
                              ? "bg-[#302e2f] text-white hover:bg-[#302e2f]/90"
                              : "bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-white shadow-[0px_10px_25px_-5px_rgba(155,126,196,0.3)] hover:opacity-90"
                          }`}
                        >
                          {isSelected ? (
                            t("booking.program.remove")
                          ) : (
                            <>
                              <Plus className="size-4" />
                              {t("booking.program.add")}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Skip to addons (addon-only mode) */}
            <div className="mt-6 lg:mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  store.setAddonOnly(true);
                  router.push("/rezervace/doplnky");
                }}
                className="inline-flex items-center gap-2 font-clash text-[14px] font-bold text-[#f0eff0] bg-[#302e2f] rounded-[10px] px-6 py-3 hover:opacity-90 transition-opacity uppercase"
              >
                {t("booking.addons.skipToAddons")}
                <ChevronDown className="size-4 -rotate-90" />
              </button>
            </div>

            {/* Mobile footer spacer */}
            <div className="lg:hidden mt-8 pb-8" />
          </div>

          {/* Right column: Cart sidebar (desktop only) */}
          <div className="hidden lg:block">
            <CartSidebar
              backHref="/rezervace/vozidlo"
              onContinue={handleContinue}
              continueDisabled={!store.selectedProgram}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
