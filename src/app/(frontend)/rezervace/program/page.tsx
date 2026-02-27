"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";

const IMAGE_MAP: Record<string, string> = {
  "exterior-komplet": "/images/service-exterior.jpg",
  "interior-komplet": "/images/service-interior.jpg",
  "to-go": "/images/service-togo.jpg",
  "to-glow": "/images/service-toglow.jpg",
  "to-wow": "/images/service-towow.jpg",
  "premium-detailing": "/images/service-premium.jpg",
};

const programs = [
  {
    id: "to-go",
    name: "To Go",
    price: 985,
    features: [
      "Ruční mytí karoserie",
      "Základní čištění disků",
      "Ošetření pneumatik",
      "Rychlé vysávání interiéru",
      "Sušení karoserie",
    ],
  },
  {
    id: "to-glow",
    name: "To Glow",
    price: 1085,
    features: [
      "Kompletní ruční mytí karoserie",
      "Čištění disků a podběhů",
      "Ošetření pneumatik a plastů",
      "Kompletní vysávání interiéru",
      "Čištění palubní desky",
      "Čištění sedadel",
      "Mytí oken zevnitř i zvenku",
      "Vůně interiéru",
    ],
  },
  {
    id: "to-wow",
    name: "To Wow",
    price: 2500,
    features: [
      "Předmytí a ruční mytí",
      "Dekontaminace laku",
      "Jednovrstvé leštění",
      "Aplikace vosku / sealantu",
      "Čištění disků a motorového prostoru",
      "Kompletní čištění interiéru",
      "Čištění a ošetření kůže / textilu",
      "Mytí oken zevnitř i zvenku",
      "Vůně interiéru",
    ],
  },
  {
    id: "exterior-komplet",
    name: "Exteriér Komplet",
    price: 985,
    features: [
      "Předmytí a ruční mytí karoserie",
      "Čištění disků a podběhů",
      "Ošetření pneumatik",
      "Mytí oken a zrcátek",
      "Ošetření plastových prvků",
      "Sušení mikrovláknem",
    ],
  },
  {
    id: "interior-komplet",
    name: "Interiér Komplet",
    price: 1085,
    features: [
      "Kompletní vysávání interiéru",
      "Čištění palubní desky a panelů",
      "Čištění a ošetření sedadel",
      "Čištění podlahových koberců",
      "Čištění oken zevnitř",
      "Ošetření plastů a gumy",
      "Vůně interiéru",
    ],
  },
  {
    id: "premium-detailing",
    name: "Premium Detailing",
    price: 4500,
    features: [
      "Kompletní předmytí a ruční mytí",
      "Dekontaminace laku (clay bar)",
      "Vícevrstvé strojní leštění",
      "Keramický coating / prémiový vosk",
      "Čištění motorového prostoru",
      "Kompletní renovace interiéru",
      "Hloubkové čištění sedadel a koberců",
      "Ošetření kůže speciálními přípravky",
      "Mytí oken s hydrofobní úpravou",
      "Prémiová vůně interiéru",
    ],
  },
];

export default function ProgramStepPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 lg:py-16 text-center">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <p className="font-clash text-[16px] font-medium text-[#b1b3b6]">
              Načítání...
            </p>
          </div>
        </div>
      }
    >
      <ProgramStepContent />
    </Suspense>
  );
}

function ProgramStepContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicle = searchParams.get("vehicle") || "sedan";

  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");

  const selectedProgram = programs.find((p) => p.id === selected);

  const toggleSelect = (programId: string) => {
    setSelected((prev) => (prev === programId ? null : programId));
  };

  const handleContinue = () => {
    if (selected) {
      router.push(
        `/rezervace/doplnky?vehicle=${vehicle}&program=${selected}`
      );
    }
  };

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="lg:grid lg:grid-cols-[1fr_384px] lg:gap-10">
          {/* ─── Left column: Title + Cards ─── */}
          <div>
            {/* Title section */}
            <div className="mb-8 lg:mb-10">
              <h2 className="font-clash text-[28px] lg:text-[40px] font-bold text-[#302e2f] mb-2">
                Vyberte program
              </h2>
              <p className="font-clash text-[14px] lg:text-[20px] font-medium text-[#302e2f]/60 mb-4">
                Profesionální péče o váš vůz v srdci Prahy
              </p>

              {/* Mobile: dark button */}
              <Link
                href="/rezervace/vozidlo"
                className="lg:hidden inline-flex items-center justify-center bg-[#302e2f] rounded-[10px] px-5 py-2.5 font-clash text-[12px] font-bold text-white"
              >
                Změnit kategorii
              </Link>
              {/* Desktop: text link */}
              <Link
                href="/rezervace/vozidlo"
                className="hidden lg:inline-flex items-center gap-1 font-clash text-[14px] font-medium text-[#7960a9] hover:text-[#9b7ec4] transition-colors"
              >
                ← Změnit kategorii
              </Link>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-2 gap-[16px] lg:gap-[24px]">
              {programs.map((program) => {
                const isSelected = selected === program.id;
                const isExpanded = expanded === program.id;
                const imageSrc = IMAGE_MAP[program.id];
                const isPremium = program.id === "exterior-komplet";

                return (
                  <div key={program.id} className="relative">
                    {/* "Premium" badge */}
                    {isPremium && (
                      <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 z-10 hidden lg:flex">
                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] backdrop-blur-[7.5px] rounded-full px-8 py-2 font-clash font-bold text-[16px] text-white whitespace-nowrap">
                          Premium
                        </span>
                      </div>
                    )}

                    <div
                      className={`bg-[#f0eff0] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden transition-all h-full flex flex-col ${
                        isSelected
                          ? "border-2 border-[#7960a9] shadow-[0px_10px_25px_-3px_rgba(121,96,169,0.3)]"
                          : "border border-[#b1b3b6]"
                      }`}
                    >
                      {/* Image area */}
                      <div className="relative h-[160px] lg:h-[192px]">
                        {imageSrc && (
                          <Image
                            src={imageSrc}
                            alt={program.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 33vw"
                          />
                        )}
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-[#302e2f]/15 lg:bg-[#302e2f]/50" />

                        {/* Bottom content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-5">
                          <h3 className="font-clash font-bold text-[13px] lg:text-[24px] text-white uppercase leading-[18px] lg:leading-[32px]">
                            {program.name}
                          </h3>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="font-clash text-[10px] lg:text-[12px] font-normal text-[#b1b3b6] uppercase tracking-[0.6px]">
                              od
                            </span>
                            <span className="font-clash font-bold text-[16px] lg:text-[27px] text-white">
                              {new Intl.NumberFormat("cs-CZ").format(
                                program.price
                              )}
                            </span>
                            <span className="font-clash font-normal text-[12px] lg:text-[17px] text-white">
                              Kč
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content below image */}
                      <div className="flex flex-col flex-1 p-3 lg:p-5">
                        {/* "Co je v programu?" / "Skrýt" toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded(isExpanded ? null : program.id)
                          }
                          className="flex items-center gap-1 font-clash text-[10px] lg:text-[13px] font-medium text-[#7960a9] hover:text-[#9b7ec4] transition-colors mb-3"
                        >
                          {isExpanded ? "Skrýt" : "Co je v programu?"}
                          {isExpanded ? (
                            <ChevronUp className="size-3 lg:size-4" />
                          ) : (
                            <ChevronDown className="size-3 lg:size-4" />
                          )}
                        </button>

                        {/* Expanded features */}
                        {isExpanded && (
                          <div className="flex flex-col gap-2 lg:gap-2.5 mb-3 lg:mb-4">
                            {program.features.map((feature, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-1.5 lg:gap-2"
                              >
                                <Check className="size-3.5 lg:size-[18px] text-[#7960a9] shrink-0 mt-0.5" />
                                <span className="font-clash font-medium text-[10px] lg:text-[13px] text-[#302e2f] leading-[16px] lg:leading-[22.75px]">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Add / Remove button */}
                        <button
                          type="button"
                          onClick={() => toggleSelect(program.id)}
                          className={`w-full font-clash font-bold text-[11px] lg:text-[14px] rounded-[8px] lg:rounded-[10px] py-2 lg:py-3 transition-all ${
                            isSelected
                              ? "bg-[#302e2f] text-white hover:bg-[#302e2f]/90"
                              : "bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-white shadow-[0px_10px_25px_-5px_rgba(155,126,196,0.3)] hover:opacity-90"
                          }`}
                        >
                          {isSelected ? "Odebrat" : "Přidat"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile back link */}
            <div className="lg:hidden mt-8 pb-24">
              <Link
                href="/rezervace/vozidlo"
                className="font-clash text-[13px] font-bold text-[#302e2f]/60 hover:text-[#302e2f] transition-colors"
              >
                ← Zpět
              </Link>
            </div>
          </div>

          {/* ─── Right column: Cart sidebar (desktop only) ─── */}
          <div className="hidden lg:block">
            <div className="sticky top-8 bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6">
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-6">
                <ShoppingCart className="size-5 text-[#302e2f]" />
                <span className="font-clash text-[16px] font-bold text-[#302e2f] uppercase tracking-wider">
                  Košík
                </span>
              </div>

              {/* Empty state */}
              {!selectedProgram ? (
                <>
                  <p className="font-clash text-[14px] font-medium text-[#b1b3b6] py-8 text-center">
                    Zatím jste nevybrali žádný program.
                  </p>
                  <button
                    type="button"
                    disabled
                    className="w-full font-clash text-[14px] font-bold uppercase rounded-[10px] py-4 bg-[#b1b3b6]/20 text-[#b1b3b6] cursor-not-allowed"
                  >
                    Pokračovat
                  </button>
                </>
              ) : (
                <>
                  {/* Selected program item */}
                  <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#302e2f]/10">
                    <div>
                      <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-full px-3 py-0.5 font-clash text-[11px] font-bold text-white mb-1.5">
                        Program
                      </span>
                      <p className="font-clash text-[14px] font-bold text-[#302e2f]">
                        {selectedProgram.name}
                      </p>
                    </div>
                    <span className="font-clash text-[14px] font-bold text-[#302e2f] whitespace-nowrap">
                      {new Intl.NumberFormat("cs-CZ").format(
                        selectedProgram.price
                      )}{" "}
                      Kč
                    </span>
                  </div>

                  {/* Promo code */}
                  <div className="py-4 border-b border-[#302e2f]/10">
                    <p className="font-clash text-[13px] font-medium text-[#302e2f]/60 mb-2">
                      Slevový kód
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Zadejte kód"
                        className="flex-1 min-w-0 bg-white border border-[#b1b3b6] rounded-[8px] px-3 py-2 font-clash text-[13px] text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors"
                      />
                      <button
                        type="button"
                        className="font-clash text-[13px] font-bold text-[#7960a9] px-3 hover:text-[#9b7ec4] transition-colors shrink-0"
                      >
                        Použít
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between py-4">
                    <span className="font-clash text-[16px] font-bold text-[#302e2f] uppercase">
                      Celkem
                    </span>
                    <span className="font-clash text-[20px] font-bold text-[#302e2f]">
                      {new Intl.NumberFormat("cs-CZ").format(
                        selectedProgram.price
                      )}{" "}
                      Kč
                    </span>
                  </div>

                  {/* Continue button */}
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full font-clash text-[14px] font-bold uppercase rounded-[10px] py-4 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-white shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
                  >
                    Pokračovat
                  </button>

                  {/* Back link */}
                  <div className="text-center mt-4">
                    <Link
                      href="/rezervace/vozidlo"
                      className="font-clash text-[13px] font-medium text-[#302e2f]/50 hover:text-[#302e2f] transition-colors"
                    >
                      Zpět na výběr vozidla
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ─── Mobile bottom action bar ─── */}
        {selected && selectedProgram && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#302e2f]/10 p-4 z-40">
            <div className="flex items-center justify-between mb-3">
              <span className="font-clash text-[14px] font-bold text-[#302e2f]">
                {selectedProgram.name}
              </span>
              <span className="font-clash text-[16px] font-bold text-[#302e2f]">
                {new Intl.NumberFormat("cs-CZ").format(selectedProgram.price)}{" "}
                Kč
              </span>
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="w-full font-clash text-[14px] font-bold uppercase rounded-[10px] py-3.5 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-white shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
            >
              Pokračovat
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
