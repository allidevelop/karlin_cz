import { MapPin, Clock, Navigation, Send } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="pt-[68px]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
        {/* Section header */}
        <div className="text-center mb-[25px] lg:mb-[45px]">
          <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
            Kontakty
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: Contact form */}
          <div className="w-full lg:w-[calc(50%-16px)] min-w-0 rounded-[10px] border-2 border-[#b1b3b6] bg-[#f0eff0] p-6 lg:p-[42px] flex flex-col">
            <h3 className="font-clash font-bold text-[20px] lg:text-[24px] leading-[28px] lg:leading-[32px] text-[#302e2f] mb-2">
              Máte ještě něco na srdci?
            </h3>
            <p className="font-clash font-medium text-[13.1px] lg:text-[20px] leading-[20px] lg:leading-[24px] text-[#302e2f] mb-6">
              Hoďte nám zprávu přes formulář a my se hned ozveme!
            </p>

            <form className="space-y-5 flex-1 flex flex-col" aria-label="Kontaktní formulář">
              <div>
                <label
                  htmlFor="name"
                  className="block font-clash font-medium text-[12.3px] leading-[20px] text-[#302e2f] mb-2"
                >
                  Jméno
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Vaše jméno"
                  className="w-full bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] px-5 py-3 h-[52px] text-[#302e2f] placeholder:text-[#b1b3b6] font-clash text-sm focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block font-clash font-medium text-[12.4px] leading-[20px] text-[#302e2f] mb-2"
                >
                  Telefon
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+420 775 009 033"
                  className="w-full bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] px-5 py-3 h-[52px] text-[#302e2f] placeholder:text-[#b1b3b6] font-clash text-sm focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block font-clash font-medium text-[13.6px] leading-[20px] text-[#302e2f] mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vas@email.cz"
                  className="w-full bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] px-5 py-3 h-[52px] text-[#302e2f] placeholder:text-[#b1b3b6] font-clash text-sm focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block font-clash font-medium text-[13.1px] leading-[20px] text-[#302e2f] mb-2"
                >
                  Váš dotaz
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Vaše zpráva..."
                  className="w-full bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] px-5 py-3 h-[178px] text-[#302e2f] placeholder:text-[#b1b3b6] font-clash text-sm focus:outline-none focus:ring-2 focus:ring-[#7960a9] transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[20px] uppercase rounded-[10px] px-8 py-4 hover:opacity-90 transition-opacity"
              >
                <Send className="size-5" />
                Odeslat zprávu
              </button>
            </form>
          </div>

          {/* Right: Map + Contact info */}
          <div className="w-full lg:w-[calc(50%-16px)] min-w-0 rounded-[10px] border-2 border-[#7960a9] overflow-hidden bg-[#f0eff0] flex flex-col">
            {/* Google Maps */}
            <div className="h-[266px] lg:h-[466px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.5!2d14.4486!3d50.0921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSokolovsk%C3%A1+694%2F98%2C+186+00+Praha+8-Karl%C3%ADn!5e0!3m2!1scs!2scz!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa - Automyčka Karlín"
                className="w-full h-full"
              />
            </div>

            {/* Contact info */}
            <div className="p-6 lg:px-8 lg:py-6 space-y-5 flex-1 flex flex-col">
              <h3 className="font-clash font-bold text-[20px] lg:text-[24px] leading-[28px] lg:leading-[32px] text-[#302e2f]">
                Kontaktní informace
              </h3>

              <div className="flex flex-col lg:flex-row gap-5">
                {/* Provozní doba */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[8px] flex items-center justify-center shrink-0">
                    <Clock className="size-4 text-[#f0eff0]" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-clash font-medium text-[15px] leading-[22px] text-[#302e2f]">
                      Provozní doba
                    </p>
                    <p className="font-clash font-medium text-[13px] leading-[20px] text-[#302e2f] whitespace-nowrap">
                      Pondělí &ndash; Neděle: 7:00 &ndash; 20:00
                    </p>
                    <p className="font-clash font-medium text-[11px] leading-[16px] text-[#302e2f]">
                      Otevřeno i o víkendech
                    </p>
                  </div>
                </div>

                {/* Jak se k nám dostat */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[8px] flex items-center justify-center shrink-0">
                    <MapPin className="size-4 text-[#f0eff0]" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-clash font-medium text-[15px] leading-[22px] text-[#302e2f]">
                      Jak se k nám dostat
                    </p>
                    <p className="font-clash font-medium text-[13px] leading-[20px] text-[#302e2f]">
                      Karlín, Praha 8
                    </p>
                    <p className="font-clash font-medium text-[11px] leading-[16px] text-[#302e2f]">
                      Snadná dostupnost MHD i autem
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigate button */}
              <a
                href="https://maps.google.com/?q=Sokolovská+694/98+Praha+8+Karlín"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[20px] uppercase rounded-[10px] px-8 py-4 hover:opacity-90 transition-opacity"
              >
                <Navigation className="size-5" />
                Navigovat
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
