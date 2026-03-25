"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";

type Reel = {
  videoUrl: string;
  instagramLink?: string | null;
  caption?: string | null;
};

type Props = {
  reels: Reel[];
  title?: string | null;
  subtitle?: string | null;
  instagramUrl?: string | null;
};

const arrowBtnClass =
  "flex items-center justify-center w-12 h-12 rounded-[10px] border-2 border-[#b1b3b6] bg-[#f0eff0] text-[#302e2f] transition-all hover:border-[#7960a9] hover:text-[#7960a9] hover:shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)]";

export default function InstagramReelsSection({ reels, subtitle, instagramUrl }: Props) {
  const t = useTranslations();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [unmutedIndex, setUnmutedIndex] = useState<number | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 2 },
    },
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on("scroll", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("scroll", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  const toggleSound = useCallback((index: number) => {
    if (unmutedIndex === index) {
      // Re-mute: resume playback on all videos
      videoRefs.current.forEach((video) => {
        if (video) {
          video.muted = true;
          video.play().catch(() => {});
        }
      });
      setUnmutedIndex(null);
    } else {
      // Unmute this video, pause all others
      videoRefs.current.forEach((video, i) => {
        if (video) {
          if (i === index) {
            video.muted = false;
          } else {
            video.muted = true;
            video.pause();
          }
        }
      });
      setUnmutedIndex(index);
    }
  }, [unmutedIndex]);

  if (reels.length === 0) return null;

  return (
    <section className="py-[40px] lg:py-[64px]">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[30px] gap-4">
          <div>
            <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
              {t("instagram.title")}
            </h2>
            {subtitle && (
              <p className="font-clash font-normal text-[14.8px] lg:text-[24px] text-[#302e2f]/70 leading-[24px] lg:leading-normal mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={scrollPrev} aria-label="Previous" className={arrowBtnClass}>
              <ChevronLeft className="size-6" />
            </button>
            <button onClick={scrollNext} aria-label="Next" className={arrowBtnClass}>
              <ChevronRight className="size-6" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={emblaRef}
          className="overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)",
          }}
        >
          <div className="flex gap-4 lg:gap-6">
            {reels.map((reel, i) => (
              <div
                key={reel.videoUrl}
                className="min-w-0 shrink-0 grow-0 basis-[55vw] sm:basis-[240px] lg:basis-[280px] relative"
              >
                {/* NEW badge on first reel */}
                {i === 0 && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-full px-4 py-1.5 font-clash font-bold text-[12px] text-white uppercase tracking-wider shadow-lg">
                      NEW
                    </span>
                  </div>
                )}

                {/* Video card */}
                <div className="rounded-[10px] overflow-hidden border border-[#b1b3b6] bg-[#302e2f] aspect-[9/16] relative group">
                  {reel.instagramLink ? (
                    <a href={reel.instagramLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                      <video
                        ref={(el) => { videoRefs.current[i] = el; }}
                        src={reel.videoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ) : (
                    <video
                      ref={(el) => { videoRefs.current[i] = el; }}
                      src={reel.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Sound toggle button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSound(i);
                    }}
                    className="absolute bottom-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-[#302e2f]/60 backdrop-blur-sm text-white/80 hover:text-white hover:bg-[#302e2f]/80 transition-all"
                    aria-label={unmutedIndex === i ? "Mute" : "Unmute"}
                  >
                    {unmutedIndex === i ? (
                      <Volume2 className="size-4" />
                    ) : (
                      <VolumeX className="size-4" />
                    )}
                  </button>
                </div>

                {/* Caption */}
                {reel.caption && (
                  <p className="font-clash text-[13px] font-medium text-[#302e2f]/70 mt-2 line-clamp-2">
                    {reel.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Follow link */}
        {instagramUrl && (
          <div className="flex justify-center mt-8">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#302e2f] border border-[#f0eff0] text-[#f0eff0] font-clash font-medium text-[14.6px] leading-[24px] rounded-[10px] px-6 py-3 hover:opacity-90 transition-opacity"
            >
              {t("instagram.follow")}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
