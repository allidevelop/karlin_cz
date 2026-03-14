"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Phone, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const navKeys = [
  { key: "booking" as const, href: "/rezervace/vozidlo" as const },
  { key: "services" as const, href: "/sluzby" as const },
  { key: "promotions" as const, href: "/akce" as const },
  { key: "forBusiness" as const, href: "/pro-firmy" as const },
  { key: "reviews" as const, href: "/#reviews" as const },
  { key: "blog" as const, href: "/blog" as const },
  { key: "contact" as const, href: "/#contact" as const },
];

const locales = [
  { code: "cs" as const, display: "CZ", label: "czech" as const },
  { code: "en" as const, display: "EN", label: "english" as const },
  { code: "ru" as const, display: "RU", label: "russian" as const },
];

// Vehicle category submenu items
const vehicleSubItems = [
  { slugKey: "hatchback", vehicleParam: "sedan" },
  { slugKey: "suv", vehicleParam: "suv" },
  { slugKey: "gclass", vehicleParam: "g-class" },
  { slugKey: "motorcycle", vehicleParam: "motocykly" },
] as const;

// Service program submenu items
const serviceSubItems = [
  { labelKey: "toGo", href: "/sluzby/to-go" },
  { labelKey: "toGlow", href: "/sluzby/to-glow" },
  { labelKey: "toWow", href: "/sluzby/to-wow" },
  { labelKey: "premiumDetailing", href: "/sluzby/premium-detailing" },
  { labelKey: "allServices", href: "/sluzby" },
] as const;

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (newLocale: "cs" | "en" | "ru") => {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
  };

  const currentDisplay = locales.find((l) => l.code === locale)?.display ?? "CZ";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-brand-black/95 backdrop-blur-md border-b border-brand-white/5">
      <div className="mx-auto h-full max-w-[1536px] px-4 sm:px-8 flex items-center justify-between">
        {/* ── Left: Logo + brand name ── */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.svg"
            alt={t("header.logoAlt")}
            width={64}
            height={64}
            className="size-10 md:size-12 lg:size-16 object-contain"
          />
          <span className="font-clash text-lg font-bold tracking-wide text-brand-white hidden sm:inline">
            {t("common.brandName")}
          </span>
        </Link>

        {/* ── Center: Desktop navigation ── */}
        <nav className="hidden lg:flex items-center gap-8">
          {navKeys.map((link) => {
            const hasDropdown = link.key === "services" || link.key === "booking";

            if (hasDropdown) {
              return (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className="font-clash text-[15px] font-normal text-brand-white/80 transition-colors duration-200 hover:text-brand-white flex items-center gap-1 uppercase"
                  >
                    {t(`navigation.${link.key}`)}
                    <ChevronDown className="size-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </Link>

                  {/* Dropdown */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-[#302e2f] border border-[#b1b3b6]/20 rounded-[10px] shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.4)] overflow-hidden min-w-[200px]">
                      {link.key === "booking" ? (
                        vehicleSubItems.map((item) => (
                          <Link
                            key={item.slugKey}
                            href={`/rezervace/program?vehicle=${item.vehicleParam}`}
                            className="block px-4 py-2.5 font-clash text-[13px] font-medium text-brand-white/70 hover:text-brand-white hover:bg-brand-white/5 transition-colors"
                          >
                            {t(`services.vehicles.${item.slugKey}`)}
                          </Link>
                        ))
                      ) : (
                        serviceSubItems.map((item) => (
                          <Link
                            key={item.labelKey}
                            href={item.href}
                            className="block px-4 py-2.5 font-clash text-[13px] font-medium text-brand-white/70 hover:text-brand-white hover:bg-brand-white/5 transition-colors"
                          >
                            {t(`navigation.serviceMenu.${item.labelKey}`)}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className="font-clash text-[15px] font-normal text-brand-white/80 transition-colors duration-200 hover:text-brand-white uppercase"
              >
                {t(`navigation.${link.key}`)}
              </Link>
            );
          })}
        </nav>

        {/* ── Right: Language, phone, mobile menu ── */}
        <div className="flex items-center gap-3">
          {/* Language dropdown */}
          <div ref={langRef} className="relative">
            <button
              type="button"
              aria-label={t("header.changeLanguage")}
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 font-clash text-sm font-bold text-brand-white bg-brand-purple rounded-lg px-3 py-1.5 transition-colors duration-200 hover:bg-brand-purple-light"
            >
              {currentDisplay}
              <ChevronDown className={`size-3.5 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-[#302e2f] border border-[#b1b3b6]/30 rounded-[10px] shadow-[0px_10px_25px_-5px_rgba(0,0,0,0.3)] overflow-hidden min-w-[140px] z-50">
                {locales.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => switchLocale(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 font-clash text-[13px] font-medium transition-colors ${
                      locale === lang.code
                        ? "text-brand-white bg-brand-purple/20"
                        : "text-brand-white/70 hover:text-brand-white hover:bg-brand-white/5"
                    }`}
                  >
                    <span className="font-bold text-[12px] w-[24px]">{lang.display}</span>
                    <span>{t(`header.${lang.label}`)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone link (desktop) — plain clickable number */}
          <a
            href="tel:+420775009033"
            className="hidden md:flex items-center font-clash text-[15px] font-medium text-brand-white hover:text-brand-purple-light transition-colors duration-200"
          >
            {t("common.phone")}
          </a>

          {/* Phone icon only (mobile) */}
          <a
            href="tel:+420775009033"
            aria-label={t("header.callPhone", { phone: t("common.phone") })}
            className="flex md:hidden items-center justify-center rounded-lg bg-brand-purple p-2 transition-colors duration-200 hover:bg-brand-purple-light"
          >
            <Phone className="size-4 text-brand-white" />
          </a>

          {/* Mobile hamburger menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="lg:hidden flex items-center justify-center rounded-lg p-2 text-brand-white transition-colors duration-200 hover:bg-brand-white/10"
                aria-label={t("header.openMenu")}
              >
                <Menu className="size-6" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="bg-brand-black border-brand-white/10 w-[300px]"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo.svg"
                    alt={t("header.logoAlt")}
                    width={40}
                    height={40}
                    className="size-10 object-contain"
                  />
                  <span className="font-clash text-base font-bold text-brand-white">
                    {t("common.brandName")}
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4 mt-4">
                {navKeys.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="font-clash text-base font-normal text-brand-white/80 transition-colors duration-200 hover:text-brand-white hover:bg-brand-white/5 rounded-lg px-3 py-3 uppercase"
                    >
                      {t(`navigation.${link.key}`)}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto px-4 pb-6">
                <a
                  href="tel:+420775009033"
                  className="flex items-center gap-3 rounded-lg bg-brand-purple/10 px-4 py-3 transition-colors duration-200 hover:bg-brand-purple/20"
                >
                  <span className="flex items-center justify-center rounded-lg bg-brand-purple p-2">
                    <Phone className="size-4 text-brand-white" />
                  </span>
                  <span className="font-clash text-sm font-medium text-brand-white">
                    {t("common.phone")}
                  </span>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
