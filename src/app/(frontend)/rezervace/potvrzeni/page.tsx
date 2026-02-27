import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ConfirmationPage() {
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
              Hotovo
            </h1>
            <p className="font-clash text-[22px] lg:text-[60px] font-medium text-[#f0eff0] leading-[25px] lg:leading-[60px]">
              Dekujeme za rezervaci
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
            {/* ─── Date & Time ─── */}
            <div className="text-center pt-[24px] px-[20px] lg:px-[49px]">
              <h2 className="font-clash text-[32px] lg:text-[48px] font-bold text-[#302e2f] leading-[32px] lg:leading-[48px]">
                sobota, 28 unora
              </h2>
              <p className="font-clash text-[24px] lg:text-[48px] font-medium text-[#302e2f] leading-[32px] mt-[10px] lg:mt-[16px]">
                17:00-17:45
              </p>
            </div>

            {/* ─── Services ─── */}
            <div className="px-[20px] lg:px-[49px] mt-[32px] lg:mt-[48px]">
              <h3 className="font-clash text-[28px] lg:text-[48px] font-bold text-[#302e2f] leading-[32px]">
                Sluzby
              </h3>
              <p className="font-clash text-[20px] lg:text-[32px] font-medium text-[#302e2f] leading-[32px] mt-[8px] lg:mt-[12px] uppercase">
                EXTERIER KOMPLET
              </p>
              <p className="font-clash text-[20px] lg:text-[24px] font-medium text-[#302e2f] leading-[32px] mt-[4px] lg:mt-[8px] uppercase">
                45 MIN
              </p>
            </div>

            {/* ─── Contacts ─── */}
            <div className="px-[20px] lg:px-[49px] mt-[24px] lg:mt-[32px]">
              <h3 className="font-clash text-[28px] lg:text-[48px] font-bold text-[#302e2f] leading-[32px]">
                Kontakty
              </h3>

              {/* Logo + business name */}
              <div className="flex items-center gap-[8px] mt-[16px] lg:mt-[24px]">
                <Image
                  src="/images/logo.png"
                  alt="Automycka Karlin logo"
                  width={70}
                  height={70}
                  className="size-[70px] lg:size-[85px] object-contain"
                />
                <span className="font-clash text-[16px] lg:text-[24px] font-bold text-[#302e2f] leading-[28px] uppercase">
                  AUTOMYCKA KARLIN
                </span>
              </div>

              {/* Address */}
              <div className="flex items-center gap-[4px] lg:gap-[8px] mt-[16px]">
                <MapPin className="size-[20px] lg:size-[25px] text-[#302e2f] shrink-0" />
                <span className="font-clash text-[20px] lg:text-[24px] font-medium text-[#302e2f] leading-[32px]">
                  Sokolovska, 98
                </span>
              </div>
            </div>

            {/* ─── Google Maps embed ─── */}
            <div className="mt-[16px] lg:mt-[24px] border-t border-b border-[#b1b3b6]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.2!2d14.4478!3d50.0921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b94a0f89e5b8d%3A0x400af0f6614d970!2sSokolovsk%C3%A1%20694%2F98%2C%20186%2000%20Praha%208-Karl%C3%ADn!5e0!3m2!1scs!2scz!4v1"
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
            <div className="flex flex-col items-center gap-[12px] py-[20px] lg:py-[24px]">
              <a
                href="tel:+420775009033"
                className="flex items-center gap-[8px] hover:opacity-80 transition-opacity"
              >
                <Phone className="size-[20px] lg:size-[25px] text-[#302e2f]" />
                <span className="font-clash text-[20px] lg:text-[24px] font-medium text-[#302e2f] leading-[32px]">
                  +420 775-009-033
                </span>
              </a>
              <a
                href="mailto:automyckakarlin@email.cz"
                className="flex items-center gap-[8px] hover:opacity-80 transition-opacity"
              >
                <Mail className="size-[20px] lg:size-[25px] text-[#302e2f]" />
                <span className="font-clash text-[20px] lg:text-[24px] font-medium text-[#302e2f] leading-[32px]">
                  automyckakarlin@email.cz
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ─── CTA Button ─── */}
        <div className="relative z-10 flex justify-center pb-[40px] lg:pb-[64px]">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold uppercase rounded-[10px] px-8 py-4 shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity text-[14px]"
          >
            Zpet na hlavni stranku
          </Link>
        </div>
      </section>
    </>
  );
}
