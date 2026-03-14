"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { MapPin, Phone, Mail, CheckCircle, Clock, Calendar } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useBookingStore } from "@/stores/booking-store";

const formatDate = (dateStr: string, locale: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/** Generate ICS calendar file content */
function generateICS(opts: {
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  location: string;
  description: string;
}) {
  const { title, date, time, durationMinutes, location, description } = opts;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const pad = (n: number) => String(n).padStart(2, "0");
  const dtStart = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`;

  const endDate = new Date(year, month - 1, day, hour, minute + durationMinutes);
  const dtEnd = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;

  const now = new Date();
  const dtStamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}Z`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Automycka Karlin//Booking//CS",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `DTSTAMP:${dtStamp}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Build Google Calendar URL */
function buildGoogleCalendarUrl(opts: {
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  location: string;
  description: string;
}) {
  const { title, date, time, durationMinutes, location, description } = opts;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const pad = (n: number) => String(n).padStart(2, "0");
  const dtStart = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`;

  const endDate = new Date(year, month - 1, day, hour, minute + durationMinutes);
  const dtEnd = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${dtStart}/${dtEnd}`,
    location,
    details: description,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function ConfirmationPage() {
  const t = useTranslations();
  const locale = useLocale();
  const store = useBookingStore();

  const hasBooking = !!(store.selectedDate && (store.selectedProgram || (store.isAddonOnly && store.addons.length > 0)));

  const handleBackHome = () => {
    store.reset();
  };

  /* ─── Fallback: no booking data ─── */
  if (!hasBooking) {
    return (
      <section className="bg-[#f0eff0] min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="font-clash text-[32px] lg:text-[48px] font-bold text-[#302e2f] leading-tight">
            {t("booking.confirmation.noBookingTitle")}
          </h1>
          <p className="font-clash text-[18px] lg:text-[20px] font-medium text-[#302e2f]/70 mt-4 leading-relaxed">
            {t("booking.confirmation.noBookingText")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/rezervace/vozidlo"
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold uppercase rounded-[10px] px-8 py-4 shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity text-[14px]"
            >
              {t("booking.confirmation.goToBooking")}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-[#b1b3b6] text-[#302e2f] font-clash font-bold uppercase rounded-[10px] px-8 py-4 hover:bg-[#302e2f]/5 transition-colors text-[14px]"
            >
              {t("booking.confirmation.backHome")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const isConfirmed = store.bookingStatus === "confirmed";

  return (
    <>
      {/* ─── Dark hero banner ─── */}
      <section className="relative bg-[#302e2f] overflow-hidden">
        {/* Decorative blurred circles */}
        <div className="absolute top-[83px] left-[288px] lg:top-[-17px] lg:left-[288px] w-[114px] h-[114px] lg:w-[256px] lg:h-[256px] rounded-full bg-[#f0eff0]/10 blur-[32px] pointer-events-none" />
        <div className="absolute top-[120px] right-[-30px] lg:top-[-77px] lg:right-[200px] w-[114px] h-[114px] lg:w-[256px] lg:h-[256px] rounded-full bg-[#f0eff0]/10 blur-[32px] pointer-events-none" />

        <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px] py-[31px] lg:py-[100px]">
          <div className="text-center flex flex-col items-center gap-[15px] lg:gap-[24px]">
            <h1 className="font-clash text-[32px] lg:text-[60px] font-bold text-[#f0eff0] leading-[60px]">
              {t("booking.confirmation.done")}
            </h1>
            <p className="font-clash text-[22px] lg:text-[60px] font-medium text-[#f0eff0] leading-[25px] lg:leading-[60px]">
              {t("booking.confirmation.thankYou")}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Confirmation card ─── */}
      <section className="bg-[#f0eff0] relative">
        {/* Purple decorative wave shapes behind card */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[-5%] w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] rounded-full bg-[#9b7ec4]/20 blur-[80px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[250px] lg:w-[500px] h-[250px] lg:h-[500px] rounded-full bg-[#7960a9]/15 blur-[80px]" />
        </div>

        <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px] flex justify-center py-[25px] lg:py-[56px] relative z-10">
          <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] w-[316px] lg:w-[696px] overflow-hidden">
            {/* ─── Booking Status Badge ─── */}
            {store.bookingStatus && (
              <div className="flex justify-center pt-[24px] px-[20px] lg:px-[49px]">
                <span
                  className={`inline-flex items-center gap-[6px] font-clash text-[14px] lg:text-[16px] font-semibold uppercase px-4 py-2 rounded-full ${
                    isConfirmed
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {isConfirmed ? (
                    <CheckCircle className="size-[16px]" />
                  ) : (
                    <Clock className="size-[16px]" />
                  )}
                  {isConfirmed
                    ? t("booking.confirmation.statusConfirmed")
                    : t("booking.confirmation.statusPending")}
                </span>
              </div>
            )}

            {/* ─── Booking Reference ─── */}
            {store.bookingId && (
              <div className="text-center pt-[12px] px-[20px] lg:px-[49px]">
                <p className="font-clash text-[14px] lg:text-[16px] font-medium text-[#302e2f]/60 uppercase">
                  {t("booking.confirmation.bookingRefLabel")}:{" "}
                  <span className="text-[#302e2f] font-bold">
                    #{store.bookingId}
                  </span>
                </p>
              </div>
            )}

            {/* ─── Google Calendar button (top) ─── */}
            {store.selectedDate && store.selectedTime && (
              <div className="flex justify-center pt-[16px] px-[20px] lg:px-[49px]">
                <a
                  href={buildGoogleCalendarUrl({
                    title: t("booking.confirmation.calendarEventTitle", { service: store.selectedProgram?.name ?? t("booking.confirmation.defaultService") }),
                    date: store.selectedDate!,
                    time: store.selectedTime!,
                    durationMinutes: 60,
                    location: "Sokolovská 694/98, Karlín, 186 00 Praha",
                    description: `${store.selectedProgram?.name ?? t("booking.confirmation.defaultService")}${store.addons.length > 0 ? ` + ${store.addons.map(a => a.name).join(", ")}` : ""}`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[14px] rounded-[10px] px-6 py-3 hover:opacity-90 transition-opacity"
                >
                  <Calendar className="size-4" />
                  {t("booking.confirmation.addToGoogleCalendar")}
                </a>
              </div>
            )}

            {/* ─── Date & Time ─── */}
            <div className="text-center pt-[24px] px-[20px] lg:px-[49px]">
              <h2 className="font-clash text-[28px] lg:text-[36px] font-bold text-[#302e2f] leading-[36px]">
                {store.selectedDate ? formatDate(store.selectedDate, locale) : "—"}
              </h2>
              {store.selectedTime && (
                <p className="font-clash text-[24px] lg:text-[36px] font-medium text-[#302e2f] leading-[36px] mt-[8px]">
                  {store.selectedTime}
                </p>
              )}
            </div>

            {/* ─── Services ─── */}
            <div className="px-[20px] lg:px-[49px] mt-[24px] lg:mt-[32px]">
              <h3 className="font-clash text-[20px] lg:text-[24px] font-bold text-[#302e2f] leading-[28px]">
                {t("booking.confirmation.servicesLabel")}
              </h3>
              {store.selectedProgram && (
                <div className="flex items-center justify-between mt-[8px] py-[8px] border-b border-[#b1b3b6]/30">
                  <span className="font-clash text-[16px] lg:text-[18px] font-medium text-[#302e2f] uppercase">
                    {store.selectedProgram.name}
                  </span>
                  <span className="font-clash text-[16px] lg:text-[18px] font-bold text-[#302e2f]">
                    {store.selectedProgram.price.toLocaleString(locale)} {t("common.currency")}
                  </span>
                </div>
              )}

              {/* ─── Addons ─── */}
              {store.addons.length > 0 && (
                <div className="mt-[8px]">
                  <h4 className="font-clash text-[16px] lg:text-[18px] font-semibold text-[#302e2f]/70 leading-[24px] mb-[4px]">
                    {t("booking.confirmation.addonsLabel")}
                  </h4>
                  {store.addons.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between py-[6px] border-b border-[#b1b3b6]/30"
                    >
                      <span className="font-clash text-[16px] lg:text-[18px] font-medium text-[#302e2f]">
                        + {addon.name}
                      </span>
                      <span className="font-clash text-[16px] lg:text-[18px] font-bold text-[#302e2f]">
                        {addon.price.toLocaleString(locale)} {t("common.currency")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* ─── Total Price ─── */}
              {store.totalPrice > 0 && (
                <div className="mt-[12px] pt-[12px] border-t border-[#b1b3b6]">
                  <div className="flex items-center justify-between">
                    <span className="font-clash text-[20px] lg:text-[24px] font-bold text-[#302e2f]">
                      {t("booking.confirmation.totalLabel")}:
                    </span>
                    <span className="font-clash text-[20px] lg:text-[24px] font-bold text-[#7960a9]">
                      {store.totalPrice.toLocaleString(locale)} {t("common.currency")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Contacts ─── */}
            <div className="px-[20px] lg:px-[49px] mt-[24px] lg:mt-[32px]">
              <h3 className="font-clash text-[20px] lg:text-[24px] font-bold text-[#302e2f] leading-[28px]">
                {t("booking.confirmation.contactsLabel")}
              </h3>

              {/* Logo + business name */}
              <div className="flex items-center gap-[12px] mt-[16px]">
                <Image
                  src="/images/logo-footer.svg"
                  alt="Automycka Karlin logo"
                  width={40}
                  height={40}
                  className="size-[40px] lg:size-[48px] object-contain"
                />
                <span className="font-clash text-[16px] lg:text-[18px] font-bold text-[#302e2f] leading-[24px] uppercase">
                  {t("common.brandName")}
                </span>
              </div>

              {/* Address */}
              <div className="flex items-center gap-[8px] mt-[12px]">
                <MapPin className="size-[18px] text-[#302e2f] shrink-0" />
                <span className="font-clash text-[16px] lg:text-[18px] font-medium text-[#302e2f] leading-[24px]">
                  {t("common.address")}
                </span>
              </div>
            </div>

            {/* ─── Google Maps embed ─── */}
            <div className="mt-[16px] lg:mt-[24px] border-t border-b border-[#b1b3b6]">
              <iframe
                src="https://maps.google.com/maps?q=Sokolovsk%C3%A1+694%2F98%2C+Karl%C3%ADn%2C+Praha+8&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="193"
                className="block lg:h-[217px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Automycka Karlin mapa"
              />
            </div>

            {/* ─── Phone & Email ─── */}
            <div className="flex flex-col items-center gap-[8px] py-[16px] lg:py-[20px]">
              <a
                href="tel:+420775009033"
                className="flex items-center gap-[8px] hover:opacity-80 transition-opacity"
              >
                <Phone className="size-[18px] text-[#302e2f]" />
                <span className="font-clash text-[16px] lg:text-[18px] font-medium text-[#302e2f] leading-[24px]">
                  {t("common.phone")}
                </span>
              </a>
              <a
                href={`mailto:${t("common.email")}`}
                className="flex items-center gap-[8px] hover:opacity-80 transition-opacity"
              >
                <Mail className="size-[18px] text-[#302e2f]" />
                <span className="font-clash text-[16px] lg:text-[18px] font-medium text-[#302e2f] leading-[24px]">
                  {t("common.email")}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ─── CTA Button ─── */}
        <div className="relative z-10 flex justify-center pb-[40px] lg:pb-[64px]">
          <Link
            href="/"
            onClick={handleBackHome}
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold uppercase rounded-[10px] px-8 py-4 shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity text-[14px]"
          >
            {t("booking.confirmation.backHome")}
          </Link>
        </div>
      </section>
    </>
  );
}
