"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  ShoppingCart,
  Tag,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  X,
  Loader2,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useBookingStore } from "@/stores/booking-store";

/** Group time slots: 3 morning, 3 afternoon, 3 evening */
function groupTimeSlots(times: string[]) {
  const morning = times.filter((t) => t < "12:00").slice(0, 3);
  const afternoon = times
    .filter((t) => t >= "12:00" && t < "17:00")
    .slice(0, 3);
  const evening = times.filter((t) => t >= "17:00").slice(0, 3);
  return { morning, afternoon, evening };
}

export default function DateTimeStepPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const store = useBookingStore();

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState(store.promoCode || "");
  const [promoStatus, setPromoStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >(store.promoDiscountType ? "success" : "idle");
  const [promoError, setPromoError] = useState("");

  /* ── Date/Time state ── */
  const todayStr = new Date().toISOString().split("T")[0];
  const initialDate =
    store.selectedDate && store.selectedDate >= todayStr
      ? store.selectedDate
      : "";
  const initialTime = initialDate ? store.selectedTime || "" : "";
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>(initialTime);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const hasItems =
    !!store.selectedProgram ||
    store.addons.length > 0 ||
    !!store.directAltegioServiceId;

  /* ── Fetch time slots when date changes ── */
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    const altegioId =
      store.directAltegioServiceId ||
      store.selectedProgram?.altegioId ||
      (store.isAddonOnly && store.addons[0]?.altegioId) ||
      null;

    if (!altegioId) {
      const slots: string[] = [];
      for (let h = 7; h < 20; h++) {
        slots.push(`${String(h).padStart(2, "0")}:00`);
        slots.push(`${String(h).padStart(2, "0")}:30`);
      }
      setTimeSlots(slots.filter((s) => s <= "19:30"));
      return;
    }

    let cancelled = false;
    setLoadingTimes(true);
    setSelectedTime("");

    fetch(`/api/booking/times?serviceId=${altegioId}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.times && Array.isArray(data.times)) {
          setTimeSlots(data.times.map((t: { time: string }) => t.time));
        } else {
          const slots: string[] = [];
          for (let h = 7; h < 20; h++) {
            slots.push(`${String(h).padStart(2, "0")}:00`);
            slots.push(`${String(h).padStart(2, "0")}:30`);
          }
          setTimeSlots(slots.filter((s) => s <= "19:30"));
        }
      })
      .catch(() => {
        if (!cancelled) setTimeSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingTimes(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    selectedDate,
    store.directAltegioServiceId,
    store.selectedProgram?.altegioId,
    store.isAddonOnly,
    store.addons,
  ]);

  /* ── Sync date/time to store ── */
  useEffect(() => {
    if (selectedDate && selectedTime) {
      store.setDateTime(selectedDate, selectedTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedTime]);

  const handleApplyPromo = async () => {
    const code = promoInput.trim();
    if (!code) return;

    setPromoStatus("loading");
    setPromoError("");

    try {
      const res = await fetch("/api/booking/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (data.valid) {
        store.setPromotion(
          data.promoId,
          code.toUpperCase(),
          data.discountType,
          data.discountValue
        );
        setPromoInput(code.toUpperCase());
        setPromoStatus("success");
      } else {
        setPromoStatus("error");
        const errorMap: Record<string, string> = {
          invalid: t("booking.cart.promoInvalid"),
          expired: t("booking.cart.promoExpired"),
          used_up: t("booking.cart.promoUsedUp"),
        };
        setPromoError(errorMap[data.error] || t("booking.cart.promoInvalid"));
      }
    } catch {
      setPromoStatus("error");
      setPromoError(t("booking.cart.promoInvalid"));
    }
  };

  const handleClearPromo = () => {
    store.clearPromotion();
    setPromoInput("");
    setPromoStatus("idle");
    setPromoError("");
  };

  const handleContinue = () => {
    router.push("/rezervace/kontakt");
  };

  const grouped = groupTimeSlots(timeSlots);

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        {/* On desktop, redirect-like: show CartSidebar layout similar to other steps */}
        <div className="lg:grid lg:grid-cols-[1fr_384px] lg:gap-8 lg:justify-center lg:max-w-[1216px] lg:mx-auto">
          {/* Mobile: Cart + Date card */}
          <div className="w-full">
            <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] p-5 lg:p-6">
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-6">
                <ShoppingCart className="size-5 text-[#302e2f]" />
                <span className="font-clash text-[20px] font-bold text-[#302e2f]">
                  {t("booking.addons.cartTitle")}
                </span>
              </div>

              {/* Cart items */}
              {hasItems ? (
                <div className="space-y-3 mb-5">
                  {store.selectedProgram && (
                    <div className="flex items-center gap-3 bg-white rounded-[10px] border border-[#b1b3b6]/30 px-3 py-2.5">
                      <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[6px] px-2 py-0.5 font-clash text-[9px] font-bold text-white uppercase tracking-wider shrink-0">
                        {t("booking.program.programBadge")}
                      </span>
                      <span className="font-clash text-[13px] font-bold text-[#302e2f] uppercase flex-1 min-w-0 truncate">
                        {store.selectedProgram.name}
                      </span>
                      <span className="font-clash text-[13px] font-bold text-[#302e2f] whitespace-nowrap shrink-0">
                        {new Intl.NumberFormat(locale).format(
                          store.selectedProgram.price
                        )}{" "}
                        {t("common.currency")}
                      </span>
                    </div>
                  )}
                  {store.addons.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center gap-3 bg-white rounded-[10px] border border-[#b1b3b6]/30 px-3 py-2.5"
                    >
                      <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[6px] px-2 py-0.5 font-clash text-[9px] font-bold text-white uppercase tracking-wider shrink-0">
                        {t("booking.contactForm.addonBadge")}
                      </span>
                      <span className="font-clash text-[13px] font-bold text-[#302e2f] uppercase flex-1 min-w-0 truncate">
                        {addon.name}
                      </span>
                      <span className="font-clash text-[13px] font-bold text-[#302e2f] whitespace-nowrap shrink-0">
                        {new Intl.NumberFormat(locale).format(addon.price)}{" "}
                        {t("common.currency")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 mb-4">
                  <ShoppingCart className="size-12 text-[#302e2f]/40 mb-3" />
                  <p className="font-clash text-[14px] font-medium text-[#302e2f]/60 text-center">
                    {t("booking.addons.emptyCart")}
                  </p>
                </div>
              )}

              {/* Promo code section */}
              <div className="border-t border-[#b1b3b6]/30 pt-4 mb-4">
                <button
                  type="button"
                  onClick={() => setPromoOpen(!promoOpen)}
                  className="w-full flex items-center gap-2.5 group"
                >
                  <Tag className="size-4 text-[#302e2f]/50 group-hover:text-[#7960a9] transition-colors" />
                  <span className="font-clash text-[14px] font-medium text-[#302e2f]/60 group-hover:text-[#302e2f] transition-colors flex-1 text-left">
                    {t("booking.addons.promoPlaceholder")}
                  </span>
                  {promoOpen ? (
                    <ChevronUp className="size-4 text-[#302e2f]/50" />
                  ) : (
                    <ChevronDown className="size-4 text-[#302e2f]/50" />
                  )}
                </button>

                {promoOpen && (
                  <div className="mt-3">
                    {promoStatus === "success" ? (
                      <div className="flex items-center justify-between bg-[#7960a9]/10 rounded-[8px] px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Tag className="size-3.5 text-[#7960a9]" />
                          <span className="font-clash text-[13px] font-bold text-[#7960a9] uppercase">
                            {store.promoCode}
                          </span>
                          <span className="font-clash text-[11px] font-medium text-[#7960a9]/70">
                            {store.promoDiscountType === "percentage"
                              ? `-${store.promoDiscountValue}%`
                              : `-${store.promoDiscountValue} ${t("common.currency")}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleClearPromo}
                          className="text-[#7960a9]/50 hover:text-[#7960a9] transition-colors"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value);
                            if (promoStatus === "error") {
                              setPromoStatus("idle");
                              setPromoError("");
                            }
                          }}
                          placeholder={t("booking.addons.promoPlaceholder")}
                          className={`flex-1 min-w-0 bg-white border rounded-[8px] px-3 py-2.5 font-clash text-[13px] text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none transition-colors ${
                            promoStatus === "error"
                              ? "border-red-400 focus:border-red-500"
                              : "border-[#b1b3b6]/50 focus:border-[#7960a9]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={
                            promoStatus === "loading" || !promoInput.trim()
                          }
                          className="font-clash text-[13px] font-bold text-white bg-[#b1b3b6] hover:bg-[#7960a9] disabled:opacity-50 rounded-[8px] px-4 py-2.5 transition-colors shrink-0"
                        >
                          {t("common.apply")}
                        </button>
                      </div>
                    )}
                    {promoError && (
                      <p className="font-clash text-[11px] text-red-500 mt-1.5">
                        {promoError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Date picker */}
              <div className="border border-[#b1b3b6]/30 rounded-[10px] p-4 mb-5 bg-white/50">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="size-4 text-[#302e2f]" />
                  <span className="font-clash text-[14px] font-bold text-[#302e2f]">
                    {t("booking.addons.selectDate")}
                  </span>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  min={todayStr}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTime("");
                  }}
                  className="w-full bg-white border border-[#b1b3b6]/50 rounded-[10px] px-4 py-3 font-clash text-[14px] text-[#302e2f] focus:outline-none focus:border-[#7960a9] transition-colors"
                />

                {/* Time selector */}
                {selectedDate && (
                  <div className="mt-3">
                    {loadingTimes ? (
                      <div className="flex items-center justify-center py-3">
                        <Loader2 className="size-5 text-[#7960a9] animate-spin" />
                      </div>
                    ) : timeSlots.length > 0 ? (
                      <div className="relative">
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full bg-white border border-[#b1b3b6]/50 rounded-[10px] px-4 py-3 font-clash text-[14px] text-[#302e2f] focus:outline-none focus:border-[#7960a9] transition-colors appearance-none pr-10"
                        >
                          <option value="">
                            {t("booking.contactForm.selectTime")}
                          </option>
                          {grouped.morning.length > 0 && (
                            <optgroup label={t("booking.cart.timeMorning")}>
                              {grouped.morning.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {grouped.afternoon.length > 0 && (
                            <optgroup label={t("booking.cart.timeAfternoon")}>
                              {grouped.afternoon.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {grouped.evening.length > 0 && (
                            <optgroup label={t("booking.cart.timeEvening")}>
                              {grouped.evening.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#302e2f] pointer-events-none" />
                      </div>
                    ) : (
                      <p className="font-clash text-[13px] text-[#302e2f]/60">
                        {t("booking.contactForm.noTimeslots")}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Discount line */}
              {store.promotionDiscount > 0 && (
                <div className="flex items-center justify-between mb-2">
                  <span className="font-clash text-[14px] font-medium text-[#7960a9]">
                    {t("booking.cart.discount")}
                  </span>
                  <span className="font-clash text-[14px] font-bold text-[#7960a9]">
                    -
                    {new Intl.NumberFormat(locale).format(
                      store.promotionDiscount
                    )}{" "}
                    {t("common.currency")}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between py-2">
                <span className="font-clash text-[18px] font-bold text-[#302e2f]">
                  {t("booking.program.total")}:
                </span>
                <span className="font-clash text-[20px] font-bold text-[#7960a9]">
                  {store.totalPrice > 0
                    ? `${new Intl.NumberFormat(locale).format(store.totalPrice)} ${t("common.currency")}`
                    : `0 ${t("common.currency")}`}
                </span>
              </div>

              {/* Continue button */}
              <button
                type="button"
                onClick={handleContinue}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-white font-clash text-[14px] font-bold uppercase rounded-[12px] py-4 mt-4 shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
              >
                {t("common.continue")}
                <ChevronRight className="size-4" />
              </button>

              {/* Back link */}
              <div className="text-center mt-4">
                <Link
                  href="/rezervace/doplnky"
                  className="inline-flex items-center gap-1 font-clash text-[13px] font-medium text-[#302e2f]/70 hover:text-[#302e2f] transition-colors"
                >
                  <ChevronLeft className="size-3" />
                  {t("common.back")}
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop: empty right column (desktop users skip this page) */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
