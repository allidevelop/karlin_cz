import { Mail, Instagram } from "lucide-react";
import { getTranslations } from "next-intl/server";
import NewsletterForm from "./NewsletterForm";

type Props = {
  cmsTitle?: string | null;
  cmsSubtitle?: string | null;
  cmsSubscribeButton?: string | null;
};

export default async function NewsletterSection({ cmsTitle, cmsSubtitle, cmsSubscribeButton }: Props) {
  const t = await getTranslations();

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
              {t("newsletter.title")}
            </h2>
            <p className="font-clash font-medium text-[15.3px] leading-[24px] text-[#f0eff0] text-center lg:text-left mb-6 max-w-md mx-auto lg:mx-0">
              {t("newsletter.subtitle")}
            </p>

            <NewsletterForm cmsSubscribeButton={cmsSubscribeButton} />
          </div>

          {/* Right: Social media card */}
          <div className="flex-1 backdrop-blur-[2px] bg-white/10 border border-white/10 rounded-[10px] p-6 lg:p-[25px] flex flex-col justify-center">
            <h3 className="font-clash font-bold text-[20px] leading-[28px] text-[#f0eff0] mb-2">
              {t("newsletter.socialHeading")}
            </h3>
            <p className="font-clash font-medium text-[15.3px] leading-[24px] text-[#f0eff0] mb-2">
              {t("newsletter.socialText")}
            </p>
            <a
              href="https://www.instagram.com/automycka.karlin/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#f0eff0] text-[#302e2f] font-clash font-medium text-[12.4px] leading-[20px] rounded-[10px] px-5 py-[10px] hover:opacity-90 transition-opacity w-fit"
            >
              <Instagram className="size-5" />
              {t("newsletter.instagram")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
