"use client";

import { Suspense, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  ArrowRight,
} from "lucide-react";

/* ─── Addon categories & items ─── */

interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface AddonCategory {
  id: string;
  title: string;
  addons: Addon[];
}

const categories: AddonCategory[] = [
  {
    id: "interier",
    title: "P\u00e9\u010de o interi\u00e9r",
    addons: [
      {
        id: "cisteni-bezpecnostnich-pasu",
        name: "\u010ci\u0161t\u011bn\u00ed bezpe\u010dnostn\u00edch p\u00e1s\u016f",
        price: 1285,
        description:
          "Odstran\u011bn\u00ed ne\u010distot a skvrn, osv\u011b\u017een\u00ed a dezinfekce p\u00e1s\u016f.",
        image: "/images/service-interior.jpg",
      },
      {
        id: "impregnace-kuze",
        name: "Impregnace k\u016f\u017ee",
        price: 1285,
        description:
          "Ochrana ko\u017een\u00fdch povrch\u016f proti vysych\u00e1n\u00ed a poprask\u00e1n\u00ed.",
        image: "/images/service-premium.jpg",
      },
      {
        id: "cisteni-kobercu",
        name: "\u010ci\u0161t\u011bn\u00ed koberc\u016f (extrakce)",
        price: 700,
        description:
          "Hloubkov\u00e9 \u010di\u0161t\u011bn\u00ed koberc\u016f a textilu mokrou extrakc\u00ed.",
        image: "/images/service-interior.jpg",
      },
    ],
  },
  {
    id: "interier-2",
    title: "P\u00e9\u010de o interi\u00e9r",
    addons: [
      {
        id: "cisteni-kuze",
        name: "\u010ci\u0161t\u011bn\u00ed bezpe\u010dnostn\u00edch p\u00e1s\u016f",
        price: 1285,
        description:
          "Odstran\u011bn\u00ed ne\u010distot a skvrn, osv\u011b\u017een\u00ed a dezinfekce p\u00e1s\u016f.",
        image: "/images/service-interior.jpg",
      },
      {
        id: "dezinfekce",
        name: "Impregnace k\u016f\u017ee",
        price: 1285,
        description:
          "Ochrana ko\u017een\u00fdch povrch\u016f proti vysych\u00e1n\u00ed a poprask\u00e1n\u00ed.",
        image: "/images/service-premium.jpg",
      },
      {
        id: "ozonizace",
        name: "Odstran\u011bn\u00ed z\u00e1pachu (ozonizace)",
        price: 800,
        description:
          "Profesion\u00e1ln\u00ed odstran\u011bn\u00ed z\u00e1pach\u016f oz\u00f3nem.",
        image: "/images/service-interior.jpg",
      },
    ],
  },
  {
    id: "interier-3",
    title: "P\u00e9\u010de o interi\u00e9r",
    addons: [
      {
        id: "keramicky-coating",
        name: "\u010ci\u0161t\u011bn\u00ed bezpe\u010dnostn\u00edch p\u00e1s\u016f",
        price: 1285,
        description:
          "Odstran\u011bn\u00ed ne\u010distot a skvrn, osv\u011b\u017een\u00ed a dezinfekce p\u00e1s\u016f.",
        image: "/images/service-interior.jpg",
      },
      {
        id: "lesteni-laku",
        name: "Impregnace k\u016f\u017ee",
        price: 1285,
        description:
          "Ochrana ko\u017een\u00fdch povrch\u016f proti vysych\u00e1n\u00ed a poprask\u00e1n\u00ed.",
        image: "/images/service-premium.jpg",
      },
    ],
  },
];

/* ─── Flatten addons for lookup ─── */
const allAddons = categories.flatMap((c) => c.addons);

/* ─── Page wrapper with Suspense ─── */

export default function AddonsStepPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 lg:py-16 text-center">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <p className="font-clash text-[16px] font-medium text-[#b1b3b6]">
              Na\u010d\u00edt\u00e1n\u00ed...
            </p>
          </div>
        </div>
      }
    >
      <AddonsStepContent />
    </Suspense>
  );
}

/* ─── Category carousel component ─── */

function CategoryCarousel({
  category,
  selectedAddons,
  toggleAddon,
}: {
  category: AddonCategory;
  selectedAddons: string[];
  toggleAddon: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild
      ? (scrollRef.current.firstElementChild as HTMLElement).offsetWidth + 16
      : 300;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/* Category header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-clash text-[18px] lg:text-[24px] font-bold text-[#302e2f]">
          {category.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex items-center justify-center w-[36px] h-[36px] rounded-[12px] border border-[#b1b3b6] bg-[#f0eff0] hover:border-[#7960a9] transition-colors"
          >
            <ChevronLeft className="size-5 text-[#302e2f]" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex items-center justify-center w-[36px] h-[36px] rounded-[12px] border border-[#7960a9] bg-[#f0eff0] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] hover:shadow-md transition-shadow"
          >
            <ChevronRight className="size-5 text-[#302e2f]" />
          </button>
        </div>
      </div>

      {/* Cards row \u2014 horizontally scrollable on desktop, 2-col grid on mobile */}
      <div className="hidden lg:block">
        <div
          ref={scrollRef}
          className="flex gap-[16px] overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {category.addons.map((addon) => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <AddonCard
                key={addon.id}
                addon={addon}
                isSelected={isSelected}
                onToggle={() => toggleAddon(addon.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile: 2-col grid */}
      <div className="lg:hidden grid grid-cols-2 gap-[16px]">
        {category.addons.map((addon) => {
          const isSelected = selectedAddons.includes(addon.id);
          return (
            <AddonCard
              key={addon.id}
              addon={addon}
              isSelected={isSelected}
              onToggle={() => toggleAddon(addon.id)}
              mobile
            />
          );
        })}
      </div>
    </div>
  );
}

/* ─── Addon card ─── */

function AddonCard({
  addon,
  isSelected,
  onToggle,
  mobile = false,
}: {
  addon: Addon;
  isSelected: boolean;
  onToggle: () => void;
  mobile?: boolean;
}) {
  return (
    <div
      className={`relative bg-[#f0eff0] border rounded-[10px] overflow-hidden shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] flex flex-col ${
        isSelected
          ? "border-[#7960a9] shadow-[0px_10px_25px_-3px_rgba(121,96,169,0.3)]"
          : "border-[#b1b3b6]"
      } ${mobile ? "w-full" : "w-[280px] shrink-0"}`}
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
          src={addon.image}
          alt={addon.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 280px"
        />
        {/* Dark overlay */}
        <div
          className={`absolute inset-0 ${
            isSelected
              ? "bg-gradient-to-b from-[#302e2f]/30 via-[#7960a9]/50 to-[#302e2f]/60"
              : "bg-[#302e2f]/15"
          }`}
        />

        {/* Bottom overlay: name + price */}
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-5">
          <h4 className="font-clash font-bold text-[13px] lg:text-[18px] text-[#f0eff0] uppercase tracking-[0.35px] leading-tight">
            {addon.name}
          </h4>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-clash font-bold text-[16px] lg:text-[24px] text-[#f0eff0]">
              {new Intl.NumberFormat("cs-CZ").format(addon.price)}
            </span>
            <span className="font-clash font-normal text-[12px] lg:text-[17px] text-[#f0eff0]">
              {"K\u010d"}
            </span>
          </div>
        </div>
      </div>

      {/* Description below image */}
      <div className="px-3 lg:px-4 py-2.5 lg:py-3 flex flex-col flex-1">
        <p className="font-clash text-[8px] lg:text-[12px] font-medium text-[#302e2f] text-center leading-relaxed mb-3">
          {addon.description}
        </p>

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
            <>Odebrat</>
          ) : (
            <>
              <Plus className="size-3 lg:size-4" />
              {"\u0050\u0159idat"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Main content ─── */

function AddonsStepContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicle = searchParams.get("vehicle") || "sedan";
  const program = searchParams.get("program") || "";

  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const totalAddons = selectedAddons.reduce((sum, id) => {
    const addon = allAddons.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  const handleContinue = () => {
    const addonParams = selectedAddons.length
      ? `&addons=${selectedAddons.join(",")}`
      : "";
    router.push(
      `/rezervace/kontakt?vehicle=${vehicle}&program=${program}${addonParams}`
    );
  };

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="lg:grid lg:grid-cols-[1fr_384px] lg:gap-10">
          {/* Left column: Title + Category Carousels */}
          <div>
            {/* Title section */}
            <div className="mb-8 lg:mb-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-clash text-[24px] lg:text-[40px] font-bold text-[#302e2f] mb-1 lg:mb-2">
                    {"Dopl\u0148kov\u00e9 slu\u017eby"}
                  </h2>
                  <p className="font-clash text-[13px] lg:text-[20px] font-medium text-[#302e2f]/60">
                    {"Vylep\u0161ete svou m\u00fdch\u00e1n\u00ed dal\u0161\u00edmi slu\u017ebami"}
                  </p>
                </div>

                {/* Mobile: change category button */}
                <Link
                  href={`/rezervace/program?vehicle=${vehicle}`}
                  className="lg:hidden flex items-center gap-[5px] bg-[#302e2f] rounded-[10px] px-[15px] py-2 shrink-0"
                >
                  <ChevronLeft className="size-4 text-[#f0eff0]" />
                  <span className="font-clash text-[10px] font-bold text-[#f0eff0] text-center leading-tight">
                    {"Zm\u011bnit"}
                    <br />
                    kategorii
                  </span>
                </Link>
              </div>

              {/* Desktop: text link back */}
              <Link
                href={`/rezervace/program?vehicle=${vehicle}`}
                className="hidden lg:inline-flex items-center gap-1 font-clash text-[14px] font-medium text-[#7960a9] hover:text-[#9b7ec4] transition-colors mt-2"
              >
                {"\u2190 Zm\u011bnit kategorii"}
              </Link>
            </div>

            {/* Mobile: Continue button at top */}
            <div className="lg:hidden mb-8">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-6 py-3 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity"
              >
                <span className="font-clash text-[14px] font-bold text-[#f0eff0] text-center">
                  {selectedAddons.length > 0
                    ? "Pokra\u010dovat"
                    : "Pokra\u010dovat Bez v\u00fdb\u011bru Dopl\u0148ku"}
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
                  selectedAddons={selectedAddons}
                  toggleAddon={toggleAddon}
                />
              ))}
            </div>

            {/* Mobile back link */}
            <div className="lg:hidden mt-8 pb-8">
              <Link
                href={`/rezervace/program?vehicle=${vehicle}`}
                className="font-clash text-[13px] font-bold text-[#302e2f]/60 hover:text-[#302e2f] transition-colors"
              >
                {"\u2190 Zp\u011bt"}
              </Link>
            </div>
          </div>

          {/* Right column: Cart sidebar (desktop only) */}
          <div className="hidden lg:block">
            <div className="sticky top-8 bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6">
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-6">
                <ShoppingCart className="size-5 text-[#302e2f]" />
                <span className="font-clash text-[16px] font-bold text-[#302e2f] uppercase tracking-wider">
                  {"KO\u0160\u00cdK"}
                </span>
              </div>

              {/* Empty state / Selected addons */}
              {selectedAddons.length === 0 ? (
                <div className="flex flex-col items-center py-6">
                  <ShoppingCart className="size-12 text-[#b1b3b6] mb-3" />
                  <p className="font-clash text-[14px] font-medium text-[#b1b3b6] text-center">
                    {"V\u00e1\u0161 ko\u0161\u00edk je pr\u00e1zdn\u00fd"}
                  </p>
                </div>
              ) : (
                <ul className="space-y-3 mb-4">
                  {selectedAddons.map((id) => {
                    const addon = allAddons.find((a) => a.id === id);
                    if (!addon) return null;
                    return (
                      <li
                        key={id}
                        className="flex items-center justify-between"
                      >
                        <span className="font-clash text-[13px] font-medium text-[#302e2f]">
                          {addon.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-clash text-[13px] font-bold text-[#7960a9]">
                            {addon.price.toLocaleString("cs-CZ")} {"K\u010d"}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleAddon(id)}
                            className="text-[#b1b3b6] hover:text-[#302e2f] transition-colors"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Divider */}
              <div className="border-t border-[#302e2f]/10 my-4" />

              {/* Promo code input */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={"Zadejte reklamn\u00ed k\u00f3d"}
                    className="flex-1 min-w-0 bg-white border border-[#b1b3b6] rounded-[8px] px-3 py-2 font-clash text-[13px] text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors"
                  />
                </div>
              </div>

              {/* Date picker */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-[#302e2f]"
                  >
                    <path
                      d="M5.333 1.333v1.334M10.667 1.333v1.334M2 6.667h12M3.333 2.667h9.334c.736 0 1.333.597 1.333 1.333v9.333c0 .737-.597 1.334-1.333 1.334H3.333A1.333 1.333 0 012 13.333V4c0-.736.597-1.333 1.333-1.333z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-clash text-[14px] font-bold text-[#302e2f]">
                    Vyberte datum
                  </span>
                </div>
                <input
                  type="date"
                  className="w-full bg-white border border-[#b1b3b6] rounded-[8px] px-3 py-2.5 font-clash text-[13px] text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors"
                />
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-3">
                <span className="font-clash text-[16px] font-bold text-[#302e2f]">
                  Celkem:
                </span>
                <span className="font-clash text-[20px] font-bold text-[#302e2f]">
                  {totalAddons > 0
                    ? `${totalAddons.toLocaleString("cs-CZ")} K\u010d`
                    : "0 K\u010d"}
                </span>
              </div>

              {/* Continue button */}
              <button
                type="button"
                onClick={handleContinue}
                className="w-full flex items-center justify-center gap-2 font-clash text-[14px] font-bold uppercase rounded-[10px] py-4 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-white shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
              >
                {"Pokra\u010dovat"}
                <ArrowRight className="size-4" />
              </button>

              {/* Back link */}
              <div className="text-center mt-4">
                <Link
                  href={`/rezervace/program?vehicle=${vehicle}`}
                  className="inline-flex items-center gap-1 font-clash text-[13px] font-medium text-[#302e2f]/50 hover:text-[#302e2f] transition-colors"
                >
                  <ChevronLeft className="size-3" />
                  {"Zp\u011bt"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile bottom action bar */}
        {selectedAddons.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#302e2f]/10 p-4 z-40">
            <button
              type="button"
              onClick={() => setShowCart(true)}
              className="w-full flex items-center justify-between bg-[#302e2f] text-[#f0eff0] rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="size-5" />
                <span className="font-clash text-[14px] font-bold">
                  {selectedAddons.length}{" "}
                  {selectedAddons.length === 1
                    ? "dopl\u0148ka"
                    : selectedAddons.length < 5
                      ? "dopl\u0148ky"
                      : "dopl\u0148k\u016f"}
                </span>
              </div>
              <span className="font-clash text-[16px] font-bold">
                +{totalAddons.toLocaleString("cs-CZ")} {"K\u010d"}
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
                    {"KO\u0160\u00cdK"}
                  </h3>
                </div>
                <button type="button" onClick={() => setShowCart(false)}>
                  <X className="size-6 text-[#302e2f]/50" />
                </button>
              </div>
              <ul className="space-y-3 mb-6">
                {selectedAddons.map((id) => {
                  const addon = allAddons.find((a) => a.id === id);
                  if (!addon) return null;
                  return (
                    <li
                      key={id}
                      className="flex items-center justify-between"
                    >
                      <span className="font-clash text-[14px] font-medium text-[#302e2f]">
                        {addon.name}
                      </span>
                      <span className="font-clash text-[14px] font-bold text-[#7960a9]">
                        {addon.price.toLocaleString("cs-CZ")} {"K\u010d"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between pt-4 border-t border-[#302e2f]/10">
                <span className="font-clash text-[16px] font-bold text-[#302e2f]">
                  Celkem
                </span>
                <span className="font-clash text-[18px] font-bold text-[#7960a9]">
                  {totalAddons.toLocaleString("cs-CZ")} {"K\u010d"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCart(false);
                  handleContinue();
                }}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold uppercase rounded-xl py-4 hover:opacity-90 transition-opacity"
              >
                {"Pokra\u010dovat"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
