import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

/**
 * "Nenašli jste co hledáte?" CTA box that appears on Služby and Akce pages.
 * Dark box with decorative blur circles and 3 action buttons.
 */
export default function NotFoundCTA() {
  return (
    <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px] py-12">
      <div className="relative bg-[#302e2f] rounded-[24px] p-8 lg:p-[48px] overflow-hidden">
        {/* Decorative blur circles */}
        <div className="absolute -top-16 -right-16 w-[256px] h-[256px] rounded-full bg-[#f0eff0]/10 blur-[32px]" />
        <div className="absolute -bottom-16 -left-16 w-[256px] h-[256px] rounded-full bg-[#f0eff0]/10 blur-[32px]" />

        <div className="relative z-10 text-center">
          <h3 className="font-clash font-bold text-[28px] lg:text-[36px] text-white leading-[40px] mb-3">
            Nenašli jste co hledáte?
          </h3>
          <p className="font-clash font-medium text-[16px] lg:text-[19.2px] text-white/90 mb-8 max-w-[600px] mx-auto">
            Podívejte se na naše služby nebo nás kontaktujte
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px] pt-[16px]">
            <Link
              href="/rezervace/vozidlo"
              className="inline-flex items-center justify-center gap-2 bg-[#302e2f] border border-[#b1b3b6] rounded-[16px] px-[41px] py-[21px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] font-clash font-bold text-[16px] text-white hover:bg-[#3a3839] transition-colors"
            >
              Rezervovat termín
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="tel:+420123456789"
              className="inline-flex items-center justify-center gap-2 bg-[#302e2f] border border-[#b1b3b6] rounded-[16px] px-[41px] py-[21px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] font-clash font-bold text-[16px] text-white hover:bg-[#3a3839] transition-colors"
            >
              Zavolejte nám
              <Phone className="size-4" />
            </Link>
            <Link
              href="/sluzby"
              className="inline-flex items-center justify-center gap-2 bg-[#302e2f] border border-[#b1b3b6] rounded-[16px] px-[41px] py-[21px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] font-clash font-bold text-[16px] text-white hover:bg-[#3a3839] transition-colors"
            >
              Všechny služby
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
