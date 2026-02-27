import { Mail, Instagram, Send } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section
      id="newsletter"
      className="bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] py-[25px] lg:py-12"
    >
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Left: Newsletter signup */}
          <div className="flex-1">
            {/* Mail icon */}
            <div className="flex justify-center lg:justify-start mb-4">
              <div className="w-12 h-12 bg-white rounded-[10px] flex items-center justify-center">
                <Mail className="size-5 text-[#7960a9]" />
              </div>
            </div>

            <h2 className="font-clash font-bold text-[24px] lg:text-[32px] leading-[32px] lg:leading-[40px] text-[#f0eff0] text-center lg:text-left mb-2">
              Newsletter
            </h2>
            <p className="font-clash font-medium text-[15.3px] leading-[24px] text-[#f0eff0] text-center lg:text-left mb-6 max-w-md mx-auto lg:mx-0">
              Přihlaste se k odběru, abyste nepropásli důležité události!
            </p>

            <form
              className="flex flex-col sm:flex-row gap-3"
              aria-label="Přihlášení k newsletteru"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                E-mailová adresa
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="newsletter-email"
                placeholder="Váš email"
                className="flex-1 bg-[#f0eff0] border-none rounded-[10px] px-5 py-[15px] text-[#302e2f] placeholder:text-[#b1b3b6] font-clash font-normal text-[15.9px] focus:outline-none focus:ring-2 focus:ring-white transition"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center bg-[#302e2f] text-[#f0eff0] font-clash font-medium text-[15px] leading-[24px] rounded-[10px] py-3 px-7 hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <Send className="size-[18px]" />
                Přihlásit se
              </button>
            </form>
          </div>

          {/* Right: Social media card */}
          <div className="flex-1 backdrop-blur-[2px] bg-white/10 border border-white/10 rounded-[10px] p-6 lg:p-[25px] flex flex-col justify-center">
            <h3 className="font-clash font-bold text-[20px] leading-[28px] text-[#f0eff0] mb-2">
              Sledujte naše sociální sítě
            </h3>
            <p className="font-clash font-medium text-[15.3px] leading-[24px] text-[#f0eff0] mb-6">
              Na nich zveřejňujeme nejnovější zprávy a také slevy a akce
            </p>
            <a
              href="https://instagram.com/automyckakarlin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#f0eff0] text-[#302e2f] font-clash font-medium text-[12.4px] leading-[20px] rounded-[10px] px-5 py-[10px] hover:opacity-90 transition-opacity w-fit"
            >
              <Instagram className="size-5" />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
