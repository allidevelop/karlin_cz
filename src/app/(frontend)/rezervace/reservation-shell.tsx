"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { Phone, Check } from "lucide-react";

const steps = [
  { number: 1, label: "Vozidlo", path: "/rezervace/vozidlo" },
  { number: 2, label: "Program", path: "/rezervace/program" },
  { number: 3, label: "Doplňky", path: "/rezervace/doplnky" },
  { number: 4, label: "Kontakt", path: "/rezervace/kontakt" },
];

export function ReservationShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isConfirmation = pathname === "/rezervace/potvrzeni";

  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.path)
  );

  return (
    <div className="min-h-screen bg-[#f0eff0] flex flex-col">
      {/* Minimal header */}
      <header className="bg-[#302e2f] h-16 shrink-0">
        <div className="max-w-[1536px] mx-auto px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.svg"
              alt="Automyčka Karlín logo"
              width={40}
              height={40}
              className="size-8 object-contain"
            />
            <span className="font-clash text-[15px] font-bold text-[#f0eff0] hidden sm:inline">
              AUTOMYČKA KARLÍN
            </span>
          </Link>

          <a
            href="tel:+420775009033"
            className="flex items-center gap-2"
          >
            <span className="flex items-center justify-center rounded-lg bg-[#7960a9] p-2">
              <Phone className="size-4 text-[#f0eff0]" />
            </span>
            <span className="font-clash text-sm font-medium text-[#f0eff0] hidden sm:inline">
              +420 775 009 033
            </span>
          </a>
        </div>
      </header>

      {/* Progress bar */}
      {!isConfirmation && (
        <div className="bg-white border-b border-[#302e2f]/5 py-6">
          <div className="max-w-[1536px] mx-auto px-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-0 sm:gap-2">
                {steps.map((step, index) => {
                  const isActive = index === currentStepIndex;
                  const isCompleted = index < currentStepIndex;

                  return (
                    <div key={step.number} className="flex items-center">
                      {/* Step */}
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center justify-center w-9 h-9 rounded-full font-clash text-[14px] font-bold transition-colors ${
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
                            step.number
                          )}
                        </div>
                        <span
                          className={`font-clash text-[14px] font-medium hidden sm:inline ${
                            isActive || isCompleted
                              ? "text-[#302e2f]"
                              : "text-[#b1b3b6]"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>

                      {/* Connector line */}
                      {index < steps.length - 1 && (
                        <div
                          className={`w-8 sm:w-16 h-[2px] mx-2 sm:mx-4 ${
                            index < currentStepIndex
                              ? "bg-[#7960a9]"
                              : "bg-[#b1b3b6]/20"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
