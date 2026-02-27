import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

const quickLinks = [
  { label: "Služby", href: "/sluzby" },
  { label: "Akce", href: "/akce" },
  { label: "Pro firmy", href: "/pro-firmy" },
  { label: "Kontakt", href: "#contact" },
];

const serviceLinks = [
  { label: "To Go", href: "/sluzby#to-go" },
  { label: "To Glow", href: "/sluzby#to-glow" },
  { label: "To Wow", href: "/sluzby#to-wow" },
  { label: "Kontakt", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-gray">
      <div className="mx-auto max-w-[1536px] px-8 py-16">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Column 1 – Logo & description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo-footer.svg"
                alt="Automyčka Karlín logo"
                width={60}
                height={30}
                className="h-[30px] w-[60px]"
              />
              <span className="text-lg font-bold text-brand-white">
                AUTOMYČKA KARLÍN
              </span>
            </Link>
            <p className="mt-4 text-brand-gray">
              Profesionální autopéče na Karlíně. Moderní technologie, ekologické
              přípravky, zkušený tým.
            </p>
          </div>

          {/* Column 2 – Rychlé odkazy */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-brand-white">
              Rychlé odkazy
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
            <h3 className="mb-4 text-lg font-bold text-brand-white">Služby</h3>
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
              Kontakt
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <MapPin className="size-[18px] shrink-0 text-brand-gray" />
                <span>Sokolovská 694/98, Karlin, 186 00 Praha Karlín</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-[18px] shrink-0 text-brand-gray" />
                <Link
                  href="tel:+420775009033"
                  className="font-medium text-brand-gray transition-colors hover:text-brand-white"
                >
                  +420 775 009 033
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-[18px] shrink-0 text-brand-gray" />
                <Link
                  href="mailto:automyckakarlin@email.cz"
                  className="font-medium text-brand-gray transition-colors hover:text-brand-white"
                >
                  automyckakarlin@email.cz
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 – Pracovní doba */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-brand-white">
              Pracovní doba
            </h3>
            <p className="text-brand-gray">Po - Ne: 7:00 - 20:00</p>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-brand-black pt-8 sm:flex-row">
          <p className="text-sm text-brand-gray">
            &copy; 2026 AUTOMYČKA KARLÍN. Všechna práva vyhrazena
          </p>
          <div className="flex gap-6">
            <Link
              href="/zasady-ochrany-osobnich-udaju"
              className="text-sm text-brand-gray transition-colors hover:text-brand-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/obchodni-podminky"
              className="text-sm text-brand-gray transition-colors hover:text-brand-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
