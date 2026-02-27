"use client";

import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Rezervace", href: "/rezervace/vozidlo" },
  { label: "Služby", href: "/sluzby" },
  { label: "Akce", href: "/akce" },
  { label: "Pro firmy", href: "/pro-firmy" },
  { label: "Recenze", href: "#reviews" },
  { label: "Blog", href: "/blog" },
  { label: "Kontakt", href: "#contact" },
] as const;

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-brand-black/95 backdrop-blur-md border-b border-brand-white/5">
      <div className="mx-auto h-full max-w-[1536px] px-4 sm:px-8 flex items-center justify-between">
        {/* ── Left: Logo + brand name ── */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.svg"
            alt="Automyčka Karlín logo"
            width={64}
            height={64}
            className="size-10 md:size-12 lg:size-16 object-contain"
          />
          <span className="font-clash text-lg font-bold tracking-wide text-brand-white hidden sm:inline">
            AUTOMYČKA KARLÍN
          </span>
        </Link>

        {/* ── Center: Desktop navigation ── */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-clash text-[15px] font-normal text-brand-white/80 transition-colors duration-200 hover:text-brand-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Right: Language, phone, mobile menu ── */}
        <div className="flex items-center gap-3">
          {/* Language button */}
          <button
            type="button"
            aria-label="Změnit jazyk"
            className="font-clash text-sm font-bold text-brand-white bg-brand-purple rounded-lg px-3 py-1 transition-colors duration-200 hover:bg-brand-purple-light"
          >
            CZ
          </button>

          {/* Phone link (desktop) */}
          <a
            href="tel:+420775009033"
            className="hidden md:flex items-center gap-2"
          >
            <span className="flex items-center justify-center rounded-lg bg-brand-purple p-2 transition-colors duration-200 hover:bg-brand-purple-light">
              <Phone className="size-4 text-brand-white" />
            </span>
            <span className="font-clash text-sm font-medium text-brand-white">
              +420 775 009 033
            </span>
          </a>

          {/* Phone icon only (mobile) */}
          <a
            href="tel:+420775009033"
            aria-label="Zavolat +420 775 009 033"
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
                aria-label="Otevřít menu"
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
                    alt="Automyčka Karlín logo"
                    width={40}
                    height={40}
                    className="size-10 object-contain"
                  />
                  <span className="font-clash text-base font-bold text-brand-white">
                    AUTOMYČKA KARLÍN
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4 mt-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="font-clash text-base font-normal text-brand-white/80 transition-colors duration-200 hover:text-brand-white hover:bg-brand-white/5 rounded-lg px-3 py-3"
                    >
                      {link.label}
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
                    +420 775 009 033
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
