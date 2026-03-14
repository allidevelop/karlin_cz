"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");

  const quickLinks = [
    { label: tNav("services"), href: "/sluzby" as const },
    { label: tNav("promotions"), href: "/akce" as const },
    { label: tNav("forBusiness"), href: "/pro-firmy" as const },
    { label: tNav("blog"), href: "/blog" as const },
  ];

  const serviceLinks = [
    { label: "To Go", href: "/sluzby#to-go" as const },
    { label: "To Glow", href: "/sluzby#to-glow" as const },
    { label: "To Wow", href: "/sluzby#to-wow" as const },
  ];

  return (
    <footer className="bg-brand-black text-brand-gray">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-8 py-16">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Column 1 – Logo & description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo-footer.svg"
                alt={tCommon("brandName")}
                width={60}
                height={30}
                className="h-[30px] w-[60px]"
              />
              <span className="text-lg font-bold text-brand-white">
                {tCommon("brandName")}
              </span>
            </Link>
            <p className="mt-4 text-brand-gray">
              {t("description")}
            </p>
          </div>

          {/* Column 2 – Rychlé odkazy */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-brand-white">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-medium text-brand-gray transition-colors hover:text-brand-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Služby */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-brand-white">
              {t("servicesHeading")}
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-medium text-brand-gray transition-colors hover:text-brand-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Kontakt */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-brand-white">
              {t("contactHeading")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <MapPin className="size-[18px] shrink-0 text-brand-gray" />
                <span>{tCommon("address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-[18px] shrink-0 text-brand-gray" />
                <a
                  href="tel:+420775009033"
                  className="font-medium text-brand-gray transition-colors hover:text-brand-white"
                >
                  {tCommon("phone")}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-[18px] shrink-0 text-brand-gray" />
                <a
                  href="mailto:automyckakarlin@email.cz"
                  className="font-medium text-brand-gray transition-colors hover:text-brand-white"
                >
                  {tCommon("email")}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 – Pracovní doba */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-brand-white">
              {t("workingHoursHeading")}
            </h3>
            <p className="text-brand-gray">{t("workingHours")}</p>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-brand-black pt-8 sm:flex-row">
          <p className="text-sm text-brand-gray">
            {t("copyright")}
          </p>
          <div className="flex gap-6">
            <Link
              href="/zasady-ochrany-osobnich-udaju"
              className="text-sm text-brand-gray transition-colors hover:text-brand-white"
            >
              {t("privacyPolicy")}
            </Link>
            <Link
              href="/obchodni-podminky"
              className="text-sm text-brand-gray transition-colors hover:text-brand-white"
            >
              {t("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
