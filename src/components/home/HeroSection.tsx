import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Navigation } from "lucide-react";
import { getTranslations } from "next-intl/server";
import AnimatedSubtitle from "./AnimatedSubtitle";

type Props = {
  cmsTitle?: string | null;
  cmsSubtitle?: string | null;
  cmsCtaText?: string | null;
  cmsHeroImageUrl?: string | null;
  cmsNavigateButton?: string | null;
  cmsSubtitles?: string | null;
  cmsHeroVideoId?: string | null;
};

export default async function HeroSection({ cmsTitle, cmsSubtitle, cmsCtaText, cmsHeroImageUrl, cmsNavigateButton, cmsSubtitles, cmsHeroVideoId }: Props) {
  const t = await getTranslations();

  // Parse subtitle texts: from CMS pipe-separated or fallback to single subtitle
  const subtitleTexts = cmsSubtitles
    ? cmsSubtitles.split("|").map((s) => s.trim()).filter(Boolean)
    : [cmsSubtitle || t("hero.subtitle")];
  return (
    <section
      id="hero"
      className="relative min-h-[520px] lg:min-h-[672px] w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background video or photo */}
      {(cmsHeroVideoId || "Q4SuUYmRnkk") ? (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${cmsHeroVideoId || "Q4SuUYmRnkk"}?autoplay=1&mute=1&loop=1&playlist=${cmsHeroVideoId || "Q4SuUYmRnkk"}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&iv_load_policy=3`}
              loading="eager"
              allow="autoplay; encrypted-media"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full border-0"
              title="Background video"
            />
          </div>
          {/* Fallback image for slow connections */}
          <Image
            src={cmsHeroImageUrl || "/images/hero-bg.jpg"}
            alt={t("hero.imageAlt")}
            fill
            className="object-cover -z-10"
            priority
          />
        </>
      ) : (
        <Image
          src={cmsHeroImageUrl || "/images/hero-bg.jpg"}
          alt={t("hero.imageAlt")}
          fill
          className="object-cover"
          priority
        />
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 lg:px-8 pt-24 lg:pt-0">
        <div className="max-w-[1536px] mx-auto text-center">
          <h1
            className="font-clash text-[36px] lg:text-[60px] font-bold text-[#f0eff0] uppercase leading-[40px] lg:leading-[60px]"
            style={{
              WebkitTextStroke: "0.5px rgba(240, 239, 240, 0.4)",
            }}
          >
            {t("hero.title")}
          </h1>
          <p
            className="font-clash text-[36px] lg:text-[60px] font-bold text-[#7960a9] uppercase leading-[40px] lg:leading-[60px] mt-4"
            style={{
              WebkitTextStroke: "0.5px rgba(240, 239, 240, 0.4)",
            }}
          >
            {subtitleTexts.length > 1 ? (
              <AnimatedSubtitle texts={subtitleTexts} />
            ) : (
              subtitleTexts[0]
            )}
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 lg:mt-10 flex flex-col lg:flex-row items-center justify-center gap-4 w-[340px] lg:w-auto mx-auto">
            <Link
              href="/rezervace/vozidlo"
              className="w-full lg:w-auto inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[20px] uppercase rounded-[10px] px-7 py-[17px] shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
            >
              {t("hero.cta")}
            </Link>
            <Link
              href="https://maps.google.com/?q=Sokolovsk%C3%A1+694/98+Praha+8+Karl%C3%ADn"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 backdrop-blur-[12px] bg-[rgba(177,179,182,0.1)] border border-[#f0eff0] text-[#f0eff0] font-clash font-bold text-[20px] uppercase rounded-[10px] px-[29px] py-[17px] hover:bg-white/20 transition-colors"
            >
              <Navigation className="size-5" />
              {cmsNavigateButton || t("hero.navigate")}
            </Link>
          </div>
        </div>
      </div>

      {/* Wave divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <Image
          src="/images/hero-wave.png"
          alt=""
          width={1920}
          height={54}
          className="w-full h-auto block"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
