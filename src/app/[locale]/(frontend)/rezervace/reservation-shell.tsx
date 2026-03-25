"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Check, ChevronRight } from "lucide-react";
import Image from "next/image";

const allSteps = [
  { number: 1, labelKey: "booking.steps.vehicle.label", shortKey: "booking.steps.vehicle.short", subtitleKey: "booking.steps.vehicle.subtitle", path: "/rezervace/vozidlo" },
  { number: 2, labelKey: "booking.steps.program.label", shortKey: "booking.steps.program.short", subtitleKey: "booking.steps.program.subtitle", path: "/rezervace/program" },
  { number: 3, labelKey: "booking.steps.addons.label", shortKey: "booking.steps.addons.short", subtitleKey: "booking.steps.addons.subtitle", path: "/rezervace/doplnky" },
  { number: 4, labelKey: "booking.steps.datetime.label", shortKey: "booking.steps.datetime.short", subtitleKey: "booking.steps.datetime.subtitle", path: "/rezervace/datum" },
  { number: 5, labelKey: "booking.steps.contact.label", shortKey: "booking.steps.contact.short", subtitleKey: "booking.steps.contact.subtitle", path: "/rezervace/kontakt" },
];

/** Desktop shows 4 steps (date/time is in sidebar, not separate page) */
const desktopSteps = [allSteps[0], allSteps[1], allSteps[2], allSteps[4]];

export function ReservationShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const t = useTranslations();

  const isConfirmation = pathname.endsWith("/rezervace/potvrzeni");

  // Current step index for all 5 steps (mobile)
  const currentMobileIndex = allSteps.findIndex((step) =>
    pathname.includes(step.path)
  );

  // Current step index for desktop 4 steps
  const currentDesktopIndex = desktopSteps.findIndex((step) =>
    pathname.includes(step.path)
  );

  const currentStep = allSteps.find((step) => pathname.includes(step.path));
  const subtitle = currentStep ? t(currentStep.subtitleKey) : t("booking.steps.vehicle.subtitle");

  // Mobile: show window of 2 steps [current, next] or [prev, current] for last step
  const mobileWindowStart =
    currentMobileIndex >= allSteps.length - 1
      ? Math.max(0, currentMobileIndex - 1)
      : Math.max(0, currentMobileIndex);
  const mobileSteps = allSteps.slice(mobileWindowStart, mobileWindowStart + 2);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dark hero section */}
      {!isConfirmation && (
        <section className="relative bg-[#302e2f] overflow-hidden">
          {/* Decorative blur circles */}
          <div className="absolute top-[-17px] left-[calc(192px+96px)] w-[256px] h-[256px] rounded-full bg-[#f0eff0]/10 blur-[32px] pointer-events-none hidden lg:block" />
          <div className="absolute top-[-77px] right-[calc(192px+192px)] w-[256px] h-[256px] rounded-full bg-[#f0eff0]/10 blur-[32px] pointer-events-none hidden lg:block" />
          <div className="absolute top-[20px] left-[10%] w-[114px] h-[114px] rounded-full bg-[#f0eff0]/10 blur-[32px] pointer-events-none lg:hidden" />
          <div className="absolute top-[-20px] right-[5%] w-[114px] h-[114px] rounded-full bg-[#f0eff0]/10 blur-[32px] pointer-events-none lg:hidden" />

          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px] pt-[100px] pb-[40px] lg:pt-[120px] lg:pb-[100px]">
            <div className="text-center">
              <h1 className="font-clash text-[28px] lg:text-[60px] font-bold text-[#f0eff0] leading-[34px] lg:leading-[60px]">
                {t("booking.heroTitle")}
              </h1>
              <p className="font-clash text-[16px] lg:text-[60px] font-medium text-[#f0eff0] leading-[22px] lg:leading-[60px] mt-[12px] lg:mt-[24px]">
                {subtitle}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Progress bar */}
      {!isConfirmation && (
        <div className="sticky top-20 z-30 bg-[#f0eff0] border-b border-[#302e2f]/5">
          <div className="max-w-[1216px] mx-auto px-4 lg:px-0">
            <div className="flex items-center h-[72px]">
              {/* Back to vehicle category — shown on program step (desktop) */}
              {currentDesktopIndex >= 1 && (
                <Link
                  href="/rezervace/vozidlo"
                  className="hidden lg:inline-flex items-center gap-1 font-clash text-[13px] font-medium text-[#7960a9] hover:text-[#9b7ec4] transition-colors shrink-0 mr-auto"
                >
                  {"\u2190"} {t("booking.program.changeCategory")}
                </Link>
              )}

              {/* Desktop progress: 4 steps */}
              <div className={`hidden lg:flex items-center ${currentDesktopIndex >= 1 ? "mx-auto" : "mx-auto"}`}>
                {desktopSteps.map((step, index) => {
                  const isActive = index === currentDesktopIndex;
                  const isCompleted = index < currentDesktopIndex;

                  return (
                    <div key={step.number} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-clash text-[14px] font-bold leading-none transition-colors ${
                            isCompleted
                              ? "bg-[#7960a9] text-[#f0eff0]"
                              : isActive
                                ? "bg-[#7960a9] text-[#f0eff0]"
                                : "bg-[#b1b3b6]/20 text-[#b1b3b6]"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="size-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span
                          className={`font-clash text-[13px] font-medium uppercase ${
                            isActive || isCompleted
                              ? "text-[#302e2f]"
                              : "text-[#b1b3b6]"
                          }`}
                        >
                          {t(step.labelKey)}
                        </span>
                      </div>

                      {index < desktopSteps.length - 1 && (
                        <div className="mx-4">
                          <ChevronRight className={`size-4 ${
                            index < currentDesktopIndex ? "text-[#7960a9]" : "text-[#b1b3b6]/40"
                          }`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile progress: 2 steps window */}
              <div className="flex lg:hidden items-center mx-auto">
                {mobileSteps.map((step, index) => {
                  const isActive = currentMobileIndex === allSteps.indexOf(step);
                  const isCompleted = currentMobileIndex > allSteps.indexOf(step);

                  return (
                    <div key={step.number} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full font-clash text-[12px] font-bold leading-none transition-colors ${
                            isCompleted
                              ? "bg-[#7960a9] text-[#f0eff0]"
                              : isActive
                                ? "bg-[#7960a9] text-[#f0eff0]"
                                : "bg-[#b1b3b6]/20 text-[#b1b3b6]"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="size-4" />
                          ) : (
                            step.number
                          )}
                        </div>
                        <span
                          className={`font-clash text-[12px] font-medium ${
                            isActive || isCompleted
                              ? "text-[#302e2f]"
                              : "text-[#b1b3b6]"
                          }`}
                        >
                          {t(step.shortKey)}
                        </span>
                      </div>

                      {index < mobileSteps.length - 1 && (
                        <div className="mx-2">
                          <ChevronRight className={`size-4 ${
                            isCompleted ? "text-[#7960a9]" : "text-[#b1b3b6]/40"
                          }`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content — light bg + wave decoration */}
      <div className="relative flex-1 bg-[#f0eff0] overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <Image
            src="/images/wave-bg.png"
            alt=""
            fill
            className="object-cover opacity-40"
            priority={false}
          />
        </div>
        <div className="relative z-[1]">
          {children}
        </div>
      </div>
    </div>
  );
}
