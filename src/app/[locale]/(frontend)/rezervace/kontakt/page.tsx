"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { ChevronDown, ChevronUp, Loader2, Tag, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useBookingStore } from "@/stores/booking-store";
import CartSidebar from "@/components/shared/CartSidebar";

export default function ContactStepPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const store = useBookingStore();

  /* ── Promo code state (mobile) ── */
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState(store.promoCode || "");
  const [promoStatus, setPromoStatus] = useState<"idle" | "loading" | "success" | "error">(
    store.promoDiscountType ? "success" : "idle"
  );
  const [promoError, setPromoError] = useState("");

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
        store.setPromotion(data.promoId, code.toUpperCase(), data.discountType, data.discountValue);
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

  /* ── Form state ── */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
    reminder: "1h",
    consent: false,
    marketing: false,
  });

  // Initialize form from store (if user navigated back and forth)
  useEffect(() => {
    const storeName = [store.firstName, store.lastName].filter(Boolean).join(" ");
    if (storeName || store.email || store.phone || store.comment) {
      setForm((prev) => ({
        ...prev,
        name: storeName || prev.name,
        email: store.email || prev.email,
        phone: store.phone || prev.phone,
        comment: store.comment || prev.comment,
        reminder: store.reminder || prev.reminder,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Sync form to store on change ── */
  const syncFormToStore = useCallback(
    (updatedForm: typeof form) => {
      const nameParts = updatedForm.name.trim().split(" ");
      store.setContactInfo({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: updatedForm.email,
        phone: updatedForm.phone,
        comment: updatedForm.comment,
        reminder: updatedForm.reminder,
      });
    },
    [store]
  );

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
    const updated = { ...form, [target.name]: value };
    setForm(updated);
    syncFormToStore(updated);
  };

  /* ── Validation ── */
  const hasServices = !!(store.selectedProgram || store.addons.length > 0 || store.directAltegioServiceId);
  const isValid = useMemo(
    () =>
      form.name.trim() !== "" &&
      form.phone.trim() !== "" &&
      form.consent &&
      !!store.selectedDate &&
      !!store.selectedTime &&
      hasServices,
    [form.name, form.phone, form.consent, store.selectedDate, store.selectedTime, hasServices]
  );

  /* ── Submit booking ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setError(null);

    try {
      const nameParts = form.name.trim().split(/\s+/);
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: store.directAltegioServiceId || store.selectedProgram?.altegioId || 0,
          addonIds: store.addons
            .map((a) => a.altegioId)
            .filter(Boolean),
          firstName: nameParts[0] || form.name,
          lastName: nameParts.slice(1).join(" "),
          email: form.email || undefined,
          phone: form.phone,
          date: store.selectedDate!,
          time: store.selectedTime!,
          note: form.comment,
          totalPrice: store.totalPrice,
          promoCode: store.promoCode || undefined,
          promoDiscountType: store.promoDiscountType || undefined,
          promoDiscountValue: store.promoDiscountValue || undefined,
          promotionDiscount: store.promotionDiscount || undefined,
        }),
      });

      const result = await response.json();
      if (result.success) {
        store.setBookingResult(result.bookingId, result.status);
        router.push("/rezervace/potvrzeni");
      } else {
        setError(
          result.error || t("booking.contactForm.errorCreate")
        );
      }
    } catch {
      setError(t("booking.contactForm.errorNetwork"));
    } finally {
      setSubmitting(false);
    }
  };

  const reminderOptions = [
    { value: "1h", label: t("booking.contactForm.reminder1h") },
    { value: "2h", label: t("booking.contactForm.reminder2h") },
    { value: "24h", label: t("booking.contactForm.reminder24h") },
    { value: "none", label: t("booking.contactForm.noReminder") },
  ];

  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="lg:grid lg:grid-cols-[1fr_384px] lg:gap-8 lg:justify-center lg:max-w-[1216px] lg:mx-auto">
          {/* ─── Left column: Form card ─── */}
          <div>
            <form onSubmit={handleSubmit}>
              <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden p-4 lg:p-6">
                {/* Section title */}
                <h3 className="font-clash text-[20px] lg:text-[24px] font-bold text-[#302e2f] leading-[28px] lg:leading-[32px] mb-4">
                  {t("booking.contactForm.title")}
                </h3>

                <div className="space-y-4">
                  {/* Jméno */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-clash text-[13px] font-bold text-[#302e2f] leading-[20px] mb-2"
                    >
                      {t("booking.contactForm.nameLabel")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t("booking.contactForm.namePlaceholder")}
                      required
                      className="w-full bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] px-4 py-4 font-clash text-[15px] font-medium text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors"
                    />
                  </div>

                  {/* Telefon */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-clash text-[13px] font-bold text-[#302e2f] leading-[20px] mb-2"
                    >
                      {t("booking.contactForm.phoneLabel")}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t("booking.contactForm.phonePlaceholder")}
                      required
                      className="w-full bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] px-4 py-4 font-clash text-[15px] font-medium text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors"
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-clash text-[13px] font-bold text-[#302e2f] leading-[20px] mb-2"
                    >
                      {t("booking.contactForm.emailLabel")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t("booking.contactForm.emailPlaceholder")}
                      className="w-full bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] px-4 py-4 font-clash text-[15px] font-medium text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors"
                    />
                  </div>

                  {/* Mobile: Promo code accordion */}
                  <div className="lg:hidden">
                    <button
                      type="button"
                      onClick={() => setPromoOpen(!promoOpen)}
                      className="w-full flex items-center gap-2.5 group"
                    >
                      <Tag className="size-4 text-[#302e2f]/50 group-hover:text-[#7960a9] transition-colors" />
                      <span className="font-clash text-[14px] font-medium text-[#302e2f]/60 group-hover:text-[#302e2f] transition-colors flex-1 text-left">
                        {t("booking.contactForm.promoLabel")}
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
                            </div>
                            <button type="button" onClick={handleClearPromo} className="text-[#7960a9]/50 hover:text-[#7960a9]">
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
                                if (promoStatus === "error") { setPromoStatus("idle"); setPromoError(""); }
                              }}
                              placeholder={t("booking.addons.promoPlaceholder")}
                              className={`flex-1 min-w-0 bg-white border rounded-[8px] px-3 py-2.5 font-clash text-[13px] text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none transition-colors ${
                                promoStatus === "error" ? "border-red-400" : "border-[#b1b3b6]/50 focus:border-[#7960a9]"
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
                          <p className="font-clash text-[11px] text-red-500 mt-1.5">{promoError}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Komentář */}
                  <div>
                    <label
                      htmlFor="comment"
                      className="block font-clash text-[13px] font-bold text-[#302e2f] leading-[20px] mb-2"
                    >
                      {t("booking.contactForm.commentLabel")}
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={form.comment}
                      onChange={handleChange}
                      rows={4}
                      placeholder={t("booking.contactForm.commentPlaceholder")}
                      className="w-full bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] px-4 pt-3 pb-[85px] font-clash text-[15px] font-medium text-[#302e2f] placeholder:text-[#b1b3b6] focus:outline-none focus:border-[#7960a9] transition-colors resize-none"
                    />
                  </div>

                  {/* Připomenutí */}
                  <div>
                    <label
                      htmlFor="reminder"
                      className="block font-clash text-[13px] font-bold text-[#302e2f] leading-[20px] mb-2"
                    >
                      {t("booking.contactForm.reminderLabel")}
                    </label>
                    <div className="relative">
                      <select
                        id="reminder"
                        name="reminder"
                        value={form.reminder}
                        onChange={handleChange}
                        className="w-full bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] px-5 py-3.5 font-clash text-[15px] font-medium text-[#302e2f] focus:outline-none focus:border-[#7960a9] transition-colors appearance-none pr-10"
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
                      className="font-clash text-[13px] font-medium text-[#302e2f] leading-[22.75px] cursor-pointer"
                    >
                      {t.rich("booking.contactForm.gdprConsent", {
                        link: (chunks) => (
                          <Link
                            href="/zasady-ochrany-osobnich-udaju"
                            className="text-[#7960a9] font-bold hover:text-[#9b7ec4] transition-colors"
                            target="_blank"
                          >
                            {chunks}
                          </Link>
                        ),
                      })}
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
                      className="font-clash text-[13px] font-medium text-[#302e2f] leading-[22.75px] cursor-pointer"
                    >
                      {t("booking.contactForm.marketingConsent")}
                    </label>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-[10px]">
                    <p className="font-clash text-[13px] font-medium text-red-600">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    disabled={!isValid || submitting}
                    className={`font-clash text-[14px] font-bold rounded-[10px] px-6 py-2.5 transition-all leading-[24px] flex items-center gap-2 ${
                      isValid && !submitting
                        ? "bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] hover:opacity-90"
                        : "bg-[#b1b3b6]/30 text-[#b1b3b6] cursor-not-allowed"
                    }`}
                  >
                    {submitting && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    {t("booking.contactForm.submitBooking")}
                  </button>
                </div>
              </div>
            </form>

            {/* Mobile: back link to datum step */}
            <div className="lg:hidden mt-6 pb-6">
              <Link
                href="/rezervace/datum"
                className="font-clash text-[13px] font-bold text-[#302e2f]/60 hover:text-[#302e2f] transition-colors"
              >
                {"\u2190"} {t("common.back")}
              </Link>
            </div>
          </div>

          {/* ─── Right column: Cart sidebar with date/time picker ─── */}
          <div className="hidden lg:block">
            <CartSidebar
              backHref="/rezervace/doplnky"
              onContinue={() => {}}
              summaryOnly
              showDatePicker
            />
          </div>
        </div>

        {/* Mobile: no cart sidebar (date/time is on separate datum page) */}
      </div>
    </section>
  );
}
