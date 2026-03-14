"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  ShoppingCart,
  X,
  Plus,
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";
import { useBookingStore } from "@/stores/booking-store";
import CartSidebar from "@/components/shared/CartSidebar";

/** Serialized addon from CMS */
export interface CMSAddon {
  id: string;
  slug: string;
  name: string;
  price: number;
  altegioId: number;
  duration: string | null;
  description: string;
  imageUrl: string | null;
  addonCategory: "interior" | "exterior" | "protection" | null;
}

// Static fallback images
const FALLBACK_IMAGE_MAP: Record<string, string> = {
  interior: "/images/service-interior.jpg",
  exterior: "/images/service-exterior.jpg",
  protection: "/images/service-premium.jpg",
};

interface AddonCategory {
  id: string;
  title: string;
  addons: CMSAddon[];
}

function getCategoryTitle(key: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    interior: t("booking.addons.categoryInterior"),
    exterior: t("booking.addons.categoryExterior"),
    protection: t("booking.addons.categoryProtection"),
  };
  return map[key] ?? key;
}

function groupAddonsByCategory(addons: CMSAddon[], t: (key: string) => string): AddonCategory[] {
  const groups: Record<string, CMSAddon[]> = {
    interior: [],
    exterior: [],
    protection: [],
  };

  for (const addon of addons) {
    const cat = addon.addonCategory ?? "interior";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(addon);
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([key, items]) => ({
      id: `pece-${key}`,
      title: getCategoryTitle(key, t),
      addons: items,
    }));
}

export default function AddonSelector({ addons }: { addons: CMSAddon[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const store = useBookingStore();

  const [showCart, setShowCart] = useState(false);

  const categories = groupAddonsByCategory(addons, t);

  const toggleAddon = (addon: CMSAddon) => {
    store.toggleAddon({
      id: addon.id,
      name: addon.name,
      price: addon.price,
      altegioId: addon.altegioId,
    });
  };

  const isSelected = (id: string) => store.addons.some((a) => a.id === id);

  const isAddonOnly = store.isAddonOnly;

  const handleContinueMobile = () => {
    router.push("/rezervace/datum");
  };

  const handleContinueDesktop = () => {
    router.push("/rezervace/kontakt");
  };

  const getAddonCountLabel = (count: number) => {
    if (count === 1) return t("booking.addons.addonCount1");
    if (count >= 2 && count <= 4) return t("booking.addons.addonCount2to4");
    return t("booking.addons.addonCount5plus");
  };

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="lg:grid lg:grid-cols-[1fr_384px] lg:gap-10">
          {/* Left column: Title + Category Carousels */}
          <div className="min-w-0">
            {/* Addon-only mode badge */}
            {isAddonOnly && (
              <div className="mb-4">
                <span className="inline-flex items-center bg-[#7960a9]/10 text-[#7960a9] font-clash text-[12px] font-bold rounded-full px-4 py-1.5 uppercase">
                  {t("booking.addons.addonOnlyMode")}
                </span>
              </div>
            )}

            {/* Mobile: title + change category button */}
            <div className="lg:hidden mb-4">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-clash font-bold text-[24px] text-[#302e2f] leading-[30px]">
                    {t("booking.addons.title")}
                  </h2>
                  <p className="font-clash font-medium text-[14px] text-[#302e2f]/70 leading-[20px] mt-1">
                    {t("booking.addons.subtitle")}
                  </p>
                </div>
                <Link
                  href="/rezervace/program"
                  className="inline-flex items-center gap-1 bg-[#302e2f] rounded-[10px] px-4 py-2.5 font-clash text-[11px] font-bold text-white shrink-0"
                >
                  {"\u2190"} {t("booking.program.changeCategory")}
                </Link>
              </div>
            </div>

            {/* Mobile: Continue button at top */}
            <div className="lg:hidden mb-8">
              <button
                type="button"
                onClick={handleContinueMobile}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-6 py-3 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity"
              >
                <span className="font-clash text-[14px] font-bold text-[#f0eff0] text-center">
                  {store.addons.length > 0
                    ? t("common.continue")
                    : t("booking.addons.continueWithout")}
                </span>
                <ArrowRight className="size-5 text-[#f0eff0]" />
              </button>
            </div>

            {/* Category sections */}
            <div className="space-y-10 lg:space-y-12">
              {categories.map((category) => (
                <CategoryCarousel
                  key={category.id}
                  category={category}
                  isSelected={isSelected}
                  toggleAddon={toggleAddon}
                />
              ))}
            </div>

            {/* Mobile back link */}
            <div className="lg:hidden mt-8 pb-8">
              <Link
                href="/rezervace/program"
                className="font-clash text-[13px] font-bold text-[#302e2f]/70 hover:text-[#302e2f] transition-colors"
              >
                {"\u2190"} {t("common.back")}
              </Link>
            </div>
          </div>

          {/* Right column: Cart sidebar (desktop only) */}
          <div className="hidden lg:block">
            <CartSidebar
              backHref="/rezervace/program"
              onContinue={handleContinueDesktop}
              showDatePicker
            />
          </div>
        </div>

        {/* Mobile bottom action bar */}
        {store.addons.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#302e2f]/10 p-4 z-40">
            <button
              type="button"
              onClick={() => setShowCart(true)}
              className="w-full flex items-center justify-between bg-[#302e2f] text-[#f0eff0] rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="size-5" />
                <span className="font-clash text-[14px] font-bold">
                  {store.addons.length}{" "}
                  {getAddonCountLabel(store.addons.length)}
                </span>
              </div>
              <span className="font-clash text-[16px] font-bold">
                +
                {store.addons
                  .reduce((s, a) => s + a.price, 0)
                  .toLocaleString(locale)}{" "}
                {t("common.currency")}
              </span>
            </button>
          </div>
        )}

        {/* Mobile cart bottom sheet */}
        {showCart && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div
              className="absolute inset-0 bg-[#302e2f]/50"
              onClick={() => setShowCart(false)}
            />
            <div className="relative bg-white rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="size-5 text-[#302e2f]" />
                  <h3 className="font-clash text-[18px] font-bold text-[#302e2f] uppercase tracking-wider">
                    {t("booking.addons.cartTitle")}
                  </h3>
                </div>
                <button type="button" onClick={() => setShowCart(false)}>
                  <X className="size-6 text-[#302e2f]/50" />
                </button>
              </div>

              {/* Cart items with badges */}
              <div className="space-y-3 mb-6">
                {store.selectedProgram && (
                  <div className="flex items-center gap-3 bg-[#f0eff0] rounded-[10px] border border-[#b1b3b6]/30 px-3 py-2.5">
                    <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[6px] px-2 py-0.5 font-clash text-[9px] font-bold text-white uppercase tracking-wider shrink-0">
                      {t("booking.program.programBadge")}
                    </span>
                    <span className="font-clash text-[13px] font-bold text-[#302e2f] uppercase flex-1 min-w-0 truncate">
                      {store.selectedProgram.name}
                    </span>
                    <span className="font-clash text-[13px] font-bold text-[#302e2f] whitespace-nowrap shrink-0">
                      {store.selectedProgram.price.toLocaleString(locale)}{" "}
                      {t("common.currency")}
                    </span>
                  </div>
                )}
                {store.addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center gap-3 bg-[#f0eff0] rounded-[10px] border border-[#b1b3b6]/30 px-3 py-2.5"
                  >
                    <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[6px] px-2 py-0.5 font-clash text-[9px] font-bold text-white uppercase tracking-wider shrink-0">
                      {t("booking.contactForm.addonBadge")}
                    </span>
                    <span className="font-clash text-[13px] font-bold text-[#302e2f] uppercase flex-1 min-w-0 truncate">
                      {addon.name}
                    </span>
                    <span className="font-clash text-[13px] font-bold text-[#302e2f] whitespace-nowrap shrink-0">
                      {addon.price.toLocaleString(locale)}{" "}
                      {t("common.currency")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#302e2f]/10">
                <span className="font-clash text-[16px] font-bold text-[#302e2f]">
                  {t("booking.program.total")}
                </span>
                <span className="font-clash text-[18px] font-bold text-[#7960a9]">
                  {store.totalPrice.toLocaleString(locale)}{" "}
                  {t("common.currency")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCart(false);
                  handleContinueMobile();
                }}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold uppercase rounded-xl py-4 hover:opacity-90 transition-opacity"
              >
                {t("common.continue")}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Category carousel component with Embla slider ─── */

function CategoryCarousel({
  category,
  isSelected,
  toggleAddon,
}: {
  category: AddonCategory;
  isSelected: (id: string) => boolean;
  toggleAddon: (addon: CMSAddon) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  return (
    <div>
      {/* Category header with arrows */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-clash text-[18px] lg:text-[24px] font-bold text-[#302e2f]">
          {category.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            className="flex items-center justify-center size-8 rounded-full border border-[#302e2f]/30 text-[#302e2f]/50 hover:border-[#7960a9] hover:text-[#7960a9] transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="flex items-center justify-center size-8 rounded-full border border-[#302e2f]/30 text-[#302e2f]/50 hover:border-[#7960a9] hover:text-[#7960a9] transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Embla carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-[16px]">
            {category.addons.map((addon) => (
              <div
                key={addon.id}
                className="flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(40%-10px)] min-w-0"
              >
                <AddonCard
                  addon={addon}
                  isSelected={isSelected(addon.id)}
                  onToggle={() => toggleAddon(addon)}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Right fade-out overlay */}
        <div className="absolute top-0 right-0 w-16 lg:w-24 h-full pointer-events-none bg-gradient-to-l from-[#f0eff0]/80 to-transparent z-10" />
      </div>
    </div>
  );
}

/* ─── Addon card with expandable description ─── */

function AddonCard({
  addon,
  isSelected,
  onToggle,
}: {
  addon: CMSAddon;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);
  const imageSrc =
    addon.imageUrl ||
    FALLBACK_IMAGE_MAP[addon.addonCategory ?? "interior"] ||
    "/images/service-interior.jpg";

  return (
    <div
      className={`relative bg-[#f0eff0] border-2 rounded-[10px] overflow-hidden shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] flex flex-col w-full ${
        isSelected
          ? "border-[#7960a9] shadow-[0px_10px_25px_-3px_rgba(121,96,169,0.3)]"
          : "border-[#b1b3b6]"
      }`}
    >
      {/* Selected checkmark overlay */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 flex items-center justify-center w-[28px] h-[28px] rounded-full bg-[#7960a9]">
          <Check className="size-4 text-[#f0eff0]" />
        </div>
      )}

      {/* Image area */}
      <div className="relative h-[160px] lg:h-[200px]">
        <Image
          src={imageSrc}
          alt={addon.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 280px"
        />
        <div
          className={`absolute inset-0 ${
            isSelected
              ? "bg-gradient-to-b from-[#302e2f]/40 via-[#7960a9]/50 to-[#302e2f]/70"
              : "bg-[#302e2f]/40"
          }`}
        />

        {/* Duration badge — fixed position */}
        {addon.duration && (
          <span className="absolute top-3 left-3 lg:top-4 lg:left-4 z-10 inline-flex items-center bg-[#f0eff0]/20 backdrop-blur-sm rounded-full px-2 py-0.5 font-clash text-[9px] lg:text-[11px] font-medium text-[#f0eff0] whitespace-nowrap">
            {addon.duration}
          </span>
        )}

        {/* Bottom overlay: name + price */}
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-5">
          <h4 className="font-clash font-bold text-[13px] lg:text-[18px] text-[#f0eff0] uppercase tracking-[0.35px] leading-tight">
            {addon.name}
          </h4>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-clash font-bold text-[16px] lg:text-[24px] text-[#f0eff0]">
              {new Intl.NumberFormat(locale).format(addon.price)}
            </span>
            <span className="font-clash font-normal text-[12px] lg:text-[17px] text-[#f0eff0]">
              {t("common.currency")}
            </span>
          </div>
        </div>
      </div>

      {/* Content below image */}
      <div className="px-3 lg:px-4 py-2.5 lg:py-3 flex flex-col flex-1">
        {/* Expandable description toggle */}
        {addon.description && (
          <>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 font-clash text-[10px] lg:text-[12px] font-medium text-[#7960a9] hover:text-[#9b7ec4] transition-colors mb-2"
            >
              {expanded
                ? t("booking.program.hide")
                : t("booking.program.whatsIncluded")}
              {expanded ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
            </button>
            {expanded && (
              <p className="font-clash text-[10px] lg:text-[12px] font-medium text-[#302e2f] leading-relaxed mb-3">
                {addon.description}
              </p>
            )}
          </>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add / Remove button */}
        <button
          type="button"
          onClick={onToggle}
          className={`w-full flex items-center justify-center gap-1.5 font-clash font-bold text-[11px] lg:text-[14px] rounded-[8px] lg:rounded-[10px] py-2 lg:py-3 transition-all ${
            isSelected
              ? "bg-[#302e2f] text-white hover:bg-[#302e2f]/90"
              : "bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-white shadow-[0px_10px_25px_-5px_rgba(155,126,196,0.3)] hover:opacity-90"
          }`}
        >
          {isSelected ? (
            <>{t("booking.program.remove")}</>
          ) : (
            <>
              <Plus className="size-3 lg:size-4" />
              {t("booking.program.add")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
