"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import {
  ShoppingCart,
  Tag,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  X,
  Calendar,
  Loader2,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useBookingStore } from "@/stores/booking-store";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";

interface CartSidebarProps {
  backHref: string;
  onContinue: () => void;
  continueDisabled?: boolean;
  showDatePicker?: boolean;
  /** Hide continue button + back link (used on contact page where form has its own submit) */
  summaryOnly?: boolean;
}

/** Group time slots: 3 morning, 3 afternoon, 3 evening */
function groupTimeSlots(times: string[]) {
  const morning = times.filter((t) => t < "12:00").slice(0, 3);
  const afternoon = times
    .filter((t) => t >= "12:00" && t < "17:00")
    .slice(0, 3);
  const evening = times.filter((t) => t >= "17:00").slice(0, 3);
  return { morning, afternoon, evening };
}

export default function CartSidebar({
  backHref,
  onContinue,
  continueDisabled = false,
  showDatePicker = false,
  summaryOnly = false,
}: CartSidebarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const store = useBookingStore();

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState(store.promoCode || "");
  const [promoStatus, setPromoStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >(store.promoDiscountType ? "success" : "idle");
  const [promoError, setPromoError] = useState("");

  /* ── Date/Time state ── */
  const todayStr = new Date().toISOString().split("T")[0];
  // Reset persisted date if it's in the past
  const initialDate = store.selectedDate && store.selectedDate >= todayStr ? store.selectedDate : "";
  const initialTime = initialDate ? (store.selectedTime || "") : "";
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>(initialTime);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const hasItems = !!store.selectedProgram || store.addons.length > 0 || !!store.directAltegioServiceId;

  /* ── Fetch time slots when date changes ── */
  useEffect(() => {
    if (!showDatePicker || !selectedDate) {
      setTimeSlots([]);
      return;
    }

    const altegioId =
      store.directAltegioServiceId ||
      store.selectedProgram?.altegioId ||
      (store.isAddonOnly && store.addons[0]?.altegioId) ||
      null;

    if (!altegioId) {
      // Fallback: generate default slots
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
          // Fallback
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
    showDatePicker,
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

  const grouped = groupTimeSlots(timeSlots);

  return (
    <div className="sticky top-24 bg-[#f0eff0] border border-[#b1b3b6]/40 rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <ShoppingCart className="size-6 text-[#302e2f]" />
        <span className="font-clash text-[20px] font-bold text-[#302e2f] uppercase tracking-wider">
          {t("booking.addons.cartTitle")}
        </span>
      </div>

      {/* Items */}
      {hasItems ? (
        <div className="space-y-3 mb-4 max-h-[320px] overflow-y-auto pr-1">
          {store.directAltegioServiceId && store.directServiceName && (
            <div className="flex items-center gap-3 bg-white rounded-[10px] border border-[#b1b3b6]/30 px-4 py-3">
              <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[6px] px-2.5 py-1 font-clash text-[10px] font-bold text-white uppercase tracking-wider shrink-0">
                {t("booking.cart.promoBadge")}
              </span>
              <span className="font-clash text-[13px] font-bold text-[#302e2f] uppercase flex-1 min-w-0 truncate">
                {store.directServiceName}
              </span>
              <span className="font-clash text-[13px] font-bold text-[#302e2f] whitespace-nowrap shrink-0">
                {store.directServicePrice != null ? `${new Intl.NumberFormat(locale).format(store.directServicePrice)} ${t("common.currency")}` : ""}
              </span>
              <button
                type="button"
                onClick={() => store.clearDirectService()}
                className="text-[#b1b3b6] hover:text-red-500 transition-colors shrink-0 ml-1"
                aria-label="Remove"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {store.selectedProgram && (
            <div className="flex items-center gap-3 bg-white rounded-[10px] border border-[#b1b3b6]/30 px-4 py-3">
              <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[6px] px-2.5 py-1 font-clash text-[10px] font-bold text-white uppercase tracking-wider shrink-0">
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
              <button
                type="button"
                onClick={() => store.clearProgram()}
                className="text-[#b1b3b6] hover:text-red-500 transition-colors shrink-0 ml-1"
                aria-label="Remove"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {store.addons.map((addon) => (
            <div
              key={addon.id}
              className="flex items-center gap-3 bg-white rounded-[10px] border border-[#b1b3b6]/30 px-4 py-3"
            >
              <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[6px] px-2.5 py-1 font-clash text-[10px] font-bold text-white uppercase tracking-wider shrink-0">
                {t("booking.contactForm.addonBadge")}
              </span>
              <span className="font-clash text-[13px] font-bold text-[#302e2f] uppercase flex-1 min-w-0 truncate">
                {addon.name}
              </span>
              <span className="font-clash text-[13px] font-bold text-[#302e2f] whitespace-nowrap shrink-0">
                {new Intl.NumberFormat(locale).format(addon.price)}{" "}
                {t("common.currency")}
              </span>
              <button
                type="button"
                onClick={() => store.toggleAddon(addon)}
                className="text-[#b1b3b6] hover:text-red-500 transition-colors shrink-0 ml-1"
                aria-label="Remove"
              >
                <X className="size-4" />
              </button>
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

      {/* Promo code collapsible section */}
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
                  disabled={promoStatus === "loading" || !promoInput.trim()}
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

      {/* Date/Time picker (optional) */}
      {showDatePicker && (
        <div className="border-t border-[#b1b3b6]/30 pt-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="size-4 text-[#302e2f]" />
            <span className="font-clash text-[14px] font-bold text-[#302e2f]">
              {t("booking.addons.selectDate")}
            </span>
          </div>
          <DatePicker
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setSelectedTime("");
            }}
            minDate={new Date().toISOString().split("T")[0]}
            locale={locale}
            placeholder={t("booking.addons.selectDate")}
          />

          {/* Time dropdown */}
          {selectedDate && (
            <div className="mt-3">
              {loadingTimes ? (
                <div className="flex items-center justify-center py-3">
                  <Loader2 className="size-5 text-[#7960a9] animate-spin" />
                </div>
              ) : timeSlots.length > 0 ? (
                <TimePicker
                  value={selectedTime}
                  onChange={setSelectedTime}
                  placeholder={t("booking.contactForm.selectTime")}
                  groups={[
                    { label: t("booking.cart.timeMorning"), times: grouped.morning },
                    { label: t("booking.cart.timeAfternoon"), times: grouped.afternoon },
                    { label: t("booking.cart.timeEvening"), times: grouped.evening },
                  ]}
                />
              ) : (
                <p className="font-clash text-[13px] text-[#302e2f]/60">
                  {t("booking.contactForm.noTimeslots")}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Discount line */}
      {store.promotionDiscount > 0 && (
        <div className="flex items-center justify-between mb-2">
          <span className="font-clash text-[14px] font-medium text-[#7960a9]">
            {t("booking.cart.discount")}
          </span>
          <span className="font-clash text-[14px] font-bold text-[#7960a9]">
            -{new Intl.NumberFormat(locale).format(store.promotionDiscount)}{" "}
            {t("common.currency")}
          </span>
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between py-3">
        <span className="font-clash text-[18px] font-bold text-[#302e2f]">
          {t("booking.program.total")}:
        </span>
        <span className="font-clash text-[20px] font-bold text-[#7960a9]">
          {store.totalPrice > 0
            ? `${new Intl.NumberFormat(locale).format(store.totalPrice)} ${t("common.currency")}`
            : `0 ${t("common.currency")}`}
        </span>
      </div>

      {/* Continue button + Back link (optional) */}
      {!summaryOnly && (
        <>
          <button
            type="button"
            onClick={onContinue}
            disabled={continueDisabled}
            className={`w-full flex items-center justify-center gap-2 font-clash text-[14px] font-bold uppercase rounded-[12px] py-4 transition-opacity ${
              continueDisabled
                ? "bg-gradient-to-r from-[#7960a9]/60 to-[#9b7ec4]/60 text-white/80 cursor-not-allowed"
                : "bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-white shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90"
            }`}
          >
            {t("common.continue")}
            <ChevronRight className="size-4" />
          </button>

          <div className="text-center mt-4">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 font-clash text-[13px] font-medium text-[#302e2f]/70 hover:text-[#302e2f] transition-colors"
            >
              <ChevronLeft className="size-3" />
              {t("common.back")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
