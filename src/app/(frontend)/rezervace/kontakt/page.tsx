"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, ChevronDown, Tag } from "lucide-react";

/* ── Static data (mirrors program/page.tsx) ── */
const programs: Record<string, { name: string; price: number }> = {
  "to-go": { name: "To Go", price: 985 },
  "to-glow": { name: "To Glow", price: 1085 },
  "to-wow": { name: "To Wow", price: 2500 },
  "exterior-komplet": { name: "Exteriér Komplet", price: 985 },
  "interior-komplet": { name: "Interiér Komplet", price: 1085 },
  "premium-detailing": { name: "Premium Detailing", price: 4500 },
};

const addonsList: Record<string, { name: string; price: number }> = {
  "cisteni-kuze": { name: "Čištění kůže", price: 500 },
  "keramicky-coating": { name: "Keramický coating", price: 3000 },
  "lesteni-laku": { name: "Leštění laku", price: 2000 },
  "cisteni-motoru": { name: "Čištění motoru", price: 800 },
  "ochrana-disku": { name: "Ochrana disků", price: 600 },
  "hydrofobni-okna": { name: "Hydrofobní úprava oken", price: 400 },
  ozonizace: { name: "Odstranění zápachu (ozonizace)", price: 800 },
  dezinfekce: { name: "Dezinfekce interiéru", price: 300 },
  "renovace-svetlometu": { name: "Renovace světlometů", price: 500 },
  "cisteni-kobercu": { name: "Čištění koberců (extrakce)", price: 700 },
};

const reminderOptions = [
  { value: "1h", label: "Za 1 hodinu před návštěvou" },
  { value: "2h", label: "Za 2 hodiny před návštěvou" },
  { value: "24h", label: "Za 24 hodin před návštěvou" },
  { value: "none", label: "Bez připomenutí" },
];

/* ── Helpers ── */
const fmt = (n: number) => new Intl.NumberFormat("cs-CZ").format(n);

/* ── Page wrapper (Suspense boundary for useSearchParams) ── */
export default function ContactStepPage() {
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
      <ContactStepContent />
    </Suspense>
  );
}

/* ── Main content ── */
function ContactStepContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicle = searchParams.get("vehicle") || "";
  const programId = searchParams.get("program") || "";
  const addonsParam = searchParams.get("addons") || "";
  const selectedAddonIds = addonsParam ? addonsParam.split(",") : [];

  const selectedProgram = programs[programId];
  const selectedAddons = selectedAddonIds
    .map((id) => ({ id, ...addonsList[id] }))
    .filter((a) => a.name);

  const programPrice = selectedProgram?.price || 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const total = programPrice + addonsTotal;

  /* Form state */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
    reminder: "1h",
    consent: false,
    marketing: false,
  });

  const [promoCode, setPromoCode] = useState("");
  const [promoExpanded, setPromoExpanded] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const isValid =
    form.name.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.consent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    router.push("/rezervace/potvrzeni");
  };

  /* ── Cart sidebar (shared between desktop and mobile bottom) ── */
  const CartContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] ${
        isMobile ? "p-4" : "p-6 sticky top-8"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <ShoppingCart className="size-6 text-[#302e2f]" />
        <span className="font-clash text-[24px] font-bold text-[#302e2f] uppercase leading-[32px]">
          Košík
        </span>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {selectedProgram && (
          <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-2 py-0.5 font-clash text-[9.5px] font-bold text-[#f0eff0] uppercase leading-[15px] whitespace-nowrap shrink-0">
                  Program
                </span>
                <span className="font-clash text-[12px] font-semibold text-[#302e2f] uppercase leading-[16px] truncate">
                  {selectedProgram.name}
                </span>
              </div>
              <span className="font-clash text-[13px] font-bold text-[#7960a9] whitespace-nowrap leading-[20px]">
                {fmt(selectedProgram.price)} Kč
              </span>
            </div>
          </div>
        )}

        {selectedAddons.map((addon) => (
          <div
            key={addon.id}
            className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-2 py-0.5 font-clash text-[9.5px] font-bold text-[#f0eff0] uppercase leading-[15px] whitespace-nowrap shrink-0">
                  Doplněk
                </span>
                <span className="font-clash text-[12px] font-semibold text-[#302e2f] uppercase leading-[16px] truncate">
                  {addon.name}
                </span>
              </div>
              <span className="font-clash text-[13px] font-bold text-[#7960a9] whitespace-nowrap leading-[20px]">
                {fmt(addon.price)} Kč
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Promo code section */}
      <div className="border-t border-[#b1b3b6] mt-4 pt-4">
        <button
          type="button"
          onClick={() => setPromoExpanded(!promoExpanded)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <Tag className="size-4 text-[#302e2f]" />
            <span className="font-clash text-[13px] font-medium text-[#302e2f] leading-[20px]">
              Zadejte reklamní kód
            </span>
          </div>
          <ChevronDown
            className={`size-4 text-[#302e2f] transition-transform ${
              promoExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {promoExpanded && (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Zadejte reklamní kód"
              className="flex-1 min-w-0 bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] px-4 py-2.5 font-clash text-[13px] font-medium text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors"
            />
            <button
              type="button"
              className="bg-[#b1b3b6] rounded-[10px] px-3 py-2.5 font-clash text-[13px] font-medium text-[#f0eff0] hover:bg-[#9b7ec4] transition-colors shrink-0"
            >
              Použít
            </button>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-[#b1b3b6] mt-4 pt-4">
        <div className="flex items-center justify-between">
          <span className="font-clash text-[18px] font-bold text-[#302e2f] leading-[28px]">
            Celkem:
          </span>
          <span className="font-clash text-[18px] font-bold text-[#7960a9] leading-[28px]">
            {fmt(total)} Kč
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="lg:grid lg:grid-cols-[1fr_384px] lg:gap-8 lg:justify-center lg:max-w-[1216px] lg:mx-auto">
          {/* ─── Left column: Form card ─── */}
          <div>
            <form onSubmit={handleSubmit}>
              <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] lg:rounded-[10px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden p-4 lg:p-6">
                {/* Section title */}
                <h3 className="font-clash text-[20px] lg:text-[24px] font-bold text-[#302e2f] leading-[28px] lg:leading-[32px] mb-4">
                  Osobní údaje
                </h3>

                <div className="space-y-4">
                  {/* Jméno */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-clash text-[13px] font-bold lg:font-bold text-[#302e2f] leading-[20px] mb-2"
                    >
                      Jméno *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Zadejte vaše jméno"
                      required
                      className="w-full bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] lg:rounded-[10px] px-4 py-4 font-clash text-[15px] font-medium text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors"
                    />
                  </div>

                  {/* Telefon */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-clash text-[13px] font-bold lg:font-bold text-[#302e2f] leading-[20px] mb-2"
                    >
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Zadejte telefonní číslo"
                      required
                      className="w-full bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] lg:rounded-[10px] px-4 py-4 font-clash text-[15px] font-medium text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors"
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-clash text-[13px] font-bold lg:font-bold text-[#302e2f] leading-[20px] mb-2"
                    >
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Zadejte e-mail"
                      className="w-full bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] lg:rounded-[10px] px-4 py-4 font-clash text-[15px] font-medium text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors"
                    />
                  </div>

                  {/* Mobile-only: promo code section */}
                  <div className="lg:hidden border-t border-[#e5e7eb] pt-4">
                    <button
                      type="button"
                      onClick={() => setPromoExpanded(!promoExpanded)}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="size-4 text-[#302e2f]" />
                        <span className="font-clash text-[13px] font-medium text-[#302e2f] leading-[20px]">
                          Zadejte reklamní kód
                        </span>
                      </div>
                      <ChevronDown
                        className={`size-4 text-[#302e2f] transition-transform ${
                          promoExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {promoExpanded && (
                      <div className="flex gap-2 mt-3">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Zadejte reklamní kód"
                          className="flex-1 min-w-0 bg-[#f0eff0] border border-[#b1b3b6] rounded-[8px] px-4 py-2.5 font-clash text-[13px] font-medium text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors"
                        />
                        <button
                          type="button"
                          className="bg-[#b1b3b6] rounded-[8px] px-3 py-2.5 font-clash text-[13px] font-medium text-[#f0eff0] hover:bg-[#9b7ec4] transition-colors shrink-0"
                        >
                          Použít
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Komentář */}
                  <div>
                    <label
                      htmlFor="comment"
                      className="block font-clash text-[13px] font-bold lg:font-bold text-[#302e2f] leading-[20px] mb-2"
                    >
                      Komentář
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={form.comment}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Komentář k záznamu"
                      className="w-full bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] lg:rounded-[10px] px-4 pt-3 pb-[85px] font-clash text-[15px] font-medium text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors resize-none"
                    />
                  </div>

                  {/* Připomenutí */}
                  <div>
                    <label
                      htmlFor="reminder"
                      className="block font-clash text-[13px] font-bold lg:font-bold text-[#302e2f] leading-[20px] mb-2"
                    >
                      Připomenutí
                    </label>
                    <div className="relative">
                      <select
                        id="reminder"
                        name="reminder"
                        value={form.reminder}
                        onChange={handleChange}
                        className="w-full bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] lg:rounded-[10px] px-5 py-3.5 font-clash text-[15px] font-medium text-[#302e2f] focus:outline-none focus:border-[#7960a9] transition-colors appearance-none pr-10"
                      >
                        {reminderOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-[#302e2f] pointer-events-none" />
                    </div>
                  </div>

                  {/* Consent checkbox 1: GDPR */}
                  <div className="flex items-start gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={form.consent}
                      onChange={handleChange}
                      className="mt-1.5 size-[13px] shrink-0 rounded-[2.5px] border border-[#b1b3b6] bg-[#f0eff0] accent-[#7960a9] cursor-pointer"
                    />
                    <label
                      htmlFor="consent"
                      className="font-clash text-[13px] lg:text-[13px] font-medium text-[#302e2f] leading-[22.75px] cursor-pointer"
                    >
                      souhlasím se zpracováním svých{" "}
                      <Link
                        href="/zasady-ochrany-osobnich-udaju"
                        className="text-[#7960a9] font-bold hover:text-[#9b7ec4] transition-colors"
                        target="_blank"
                      >
                        osobních údajů
                      </Link>{" "}
                      a potvrzuji, že jsem si přečetl/a přijal/a Zásady ochrany
                      osobních údajů a Uživatelská smlouva
                    </label>
                  </div>

                  {/* Consent checkbox 2: Marketing */}
                  <div className="flex items-start gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="marketing"
                      name="marketing"
                      checked={form.marketing}
                      onChange={handleChange}
                      className="mt-1.5 size-[13px] shrink-0 rounded-[2.5px] border border-[#b1b3b6] bg-[#f0eff0] accent-[#7960a9] cursor-pointer"
                    />
                    <label
                      htmlFor="marketing"
                      className="font-clash text-[13px] lg:text-[13px] font-medium text-[#302e2f] leading-[22.75px] cursor-pointer"
                    >
                      souhlasím se zasíláním obchodních sdělení (nabídky, slevy,
                      akce, novinky) na mou e-mailovou adresu
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`font-clash text-[14px] font-bold rounded-[10px] px-6 py-2.5 transition-all leading-[24px] ${
                      isValid
                        ? "bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] hover:opacity-90"
                        : "bg-[#b1b3b6]/30 text-[#b1b3b6] cursor-not-allowed"
                    }`}
                  >
                    Kompletní registrace
                  </button>
                </div>
              </div>
            </form>

            {/* Mobile: back link */}
            <div className="lg:hidden mt-6 pb-6">
              <Link
                href={`/rezervace/doplnky?vehicle=${vehicle}&program=${programId}${addonsParam ? `&addons=${addonsParam}` : ""}`}
                className="font-clash text-[13px] font-bold text-[#302e2f]/60 hover:text-[#302e2f] transition-colors"
              >
                ← Zpět
              </Link>
            </div>
          </div>

          {/* ─── Right column: Cart sidebar (desktop only) ─── */}
          <div className="hidden lg:block">
            <CartContent />
          </div>
        </div>
      </div>
    </section>
  );
}
