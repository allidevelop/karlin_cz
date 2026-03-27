import { MapPin, Clock, Navigation, Play } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ContactForm from "./ContactForm";

type Props = {
  cmsTitle?: string | null;
  cmsFormHeading?: string | null;
  cmsFormSubheading?: string | null;
  cmsSendButton?: string | null;
  cmsNavigateButton?: string | null;
};

export default async function ContactSection({ cmsTitle, cmsFormHeading, cmsFormSubheading, cmsSendButton, cmsNavigateButton }: Props) {
  const t = await getTranslations();

  return (
    <section id="contact" className="pt-[68px]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
        {/* Section header */}
        <div className="text-center mb-[25px] lg:mb-[45px]">
          <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
            {t("contactSection.title")}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left: Contact form */}
          <div className="w-full lg:w-[calc(50%-16px)] min-w-0 rounded-[10px] border-2 border-[#b1b3b6] bg-[#f0eff0] p-6 lg:p-[42px] flex flex-col">
            <h3 className="font-clash font-bold text-[20px] lg:text-[24px] leading-[28px] lg:leading-[32px] text-[#302e2f] mb-2">
              {t("contactSection.formHeading")}
            </h3>
            <p className="font-clash font-medium text-[13.1px] lg:text-[20px] leading-[20px] lg:leading-[24px] text-[#302e2f] mb-6">
              {t("contactSection.formSubheading")}
            </p>

            <ContactForm cmsSendButton={cmsSendButton} />
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
                title={t("contactSection.mapTitle")}
                className="w-full h-full"
              />
            </div>

            {/* Contact info */}
            <div className="p-6 lg:px-8 lg:pt-6 lg:pb-[42px] space-y-5 flex-1 flex flex-col">
              <h3 className="font-clash font-bold text-[20px] lg:text-[24px] leading-[28px] lg:leading-[32px] text-[#302e2f]">
                {t("contactSection.contactInfo")}
              </h3>

              <div className="flex flex-col lg:flex-row gap-5">
                {/* Provozni doba */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[8px] flex items-center justify-center shrink-0">
                    <Clock className="size-4 text-[#f0eff0]" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-clash font-medium text-[15px] leading-[22px] text-[#302e2f]">
                      {t("contactSection.operatingHours")}
                    </p>
                    <p className="font-clash font-medium text-[13px] leading-[20px] text-[#302e2f]">
                      {t("contactSection.operatingHoursValue")}
                    </p>
                    <p className="font-clash font-medium text-[11px] leading-[16px] text-[#302e2f]">
                      {t("contactSection.openWeekends")}
                    </p>
                  </div>
                </div>

                {/* Jak se k nam dostat */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[8px] flex items-center justify-center shrink-0">
                    <MapPin className="size-4 text-[#f0eff0]" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-clash font-medium text-[15px] leading-[22px] text-[#302e2f]">
                      {t("contactSection.howToReach")}
                    </p>
                    <p className="font-clash font-medium text-[13px] leading-[20px] text-[#302e2f]">
                      {t("contactSection.location")}
                    </p>
                    <p className="font-clash font-medium text-[11px] leading-[16px] text-[#302e2f]">
                      {t("contactSection.accessInfo")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigate + Video buttons */}
              <div className="mt-auto flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href="https://maps.app.goo.gl/3gRDhNv4v2ZNZQYD9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[14px] sm:text-[16px] uppercase rounded-[10px] px-6 py-4 hover:opacity-90 transition-opacity"
                >
                  <Navigation className="size-5" />
                  {t("common.navigate")}
                </a>
                <a
                  href="https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDQzMzUzNTI0MTc3OTMx?igsh=ZjZ5am9yczRrN3d0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#302e2f] border border-[#f0eff0] text-[#f0eff0] font-clash font-bold text-[14px] sm:text-[16px] uppercase rounded-[10px] px-6 py-4 hover:opacity-90 transition-opacity"
                >
                  <Play className="size-5" />
                  {t("contactSection.videoInstructions")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
