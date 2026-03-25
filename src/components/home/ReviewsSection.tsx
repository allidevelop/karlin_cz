"use client";

import { useCallback, useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

type Props = {
  reviews: Array<{
    id: string | number;
    authorName: string;
    text: string;
    rating: number;
    date?: string | null;
    source?: string;
  }>;
  cmsTitle?: string | null;
  cmsSubtitle?: string | null;
  cmsLeaveReviewButton?: string | null;
};

const sourceInitial = (source?: string) => {
  switch (source) {
    case "facebook": return "F";
    case "web": return "W";
    default: return "G";
  }
};

const arrowBtnClass =
  "flex items-center justify-center w-12 h-12 rounded-[10px] border-2 border-[#b1b3b6] bg-[#f0eff0] text-[#302e2f] transition-all hover:border-[#7960a9] hover:text-[#7960a9] hover:shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)]";

export default function ReviewsSection({ reviews, cmsTitle, cmsSubtitle, cmsLeaveReviewButton }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(locale === "cs" ? "cs-CZ" : locale === "ru" ? "ru-RU" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

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

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="relative bg-[#302e2f] py-[44px] lg:py-[44px] lg:pb-[96px] overflow-hidden">
      {/* Decorative purple glows */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute left-[25%] top-0 w-96 h-96 bg-[#7960a9] rounded-full blur-[32px]" />
        <div className="absolute right-[20%] top-[40%] w-96 h-96 bg-[#7960a9] rounded-full blur-[32px]" />
      </div>

      {/* Header inside container */}
      <div className="relative max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[30px] lg:mb-[64px] gap-4">
          <div className="text-center lg:text-left">
            <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#f0eff0] leading-[36px] lg:leading-[48px]">
              {t("reviews.title")}
            </h2>
            <p className="font-clash font-medium text-[15px] lg:text-[36px] text-[#f0eff0] leading-[24px] lg:leading-normal mt-1">
              {t("reviews.subtitle")}
            </p>
          </div>
          <div className="flex items-center justify-center lg:justify-end gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                aria-label={t("reviews.prevReview")}
                className={arrowBtnClass}
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={scrollNext}
                aria-label={t("reviews.nextReview")}
                className={arrowBtnClass}
              >
                <ChevronRight className="size-6" />
              </button>
            </div>
            <Link
              href="https://g.page/r/CSlpaM60GjnOEAE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-3 bg-[#7960a9] backdrop-blur-[8px] text-[#f0eff0] font-clash font-medium text-[14.5px] leading-[24px] rounded-[10px] px-8 py-4 hover:opacity-90 transition-opacity"
            >
              {t("reviews.leaveReview")}
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel contained in container */}
      <div className="relative max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div
          ref={emblaRef}
          className="overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)",
          }}
        >
          <div className="flex gap-4 lg:gap-[48px] items-stretch">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="min-w-0 shrink-0 grow-0 basis-[320px] lg:basis-[369px]"
              >
                {/* White review card */}
                <div className="flex flex-col h-full bg-[#f0eff0] rounded-[10px] border border-[#f0eff0] backdrop-blur-[12px] p-8">
                  {/* Stars + Source */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-5 fill-[#7960a9] text-[#7960a9]"
                          style={{ marginLeft: i > 0 ? 4 : 0 }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-[10px] border border-[#b1b3b6] bg-[#f0eff0] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
                      <span className="font-clash font-bold text-[14px] leading-[20px] text-[#7960a9]">
                        {sourceInitial(review.source)}
                      </span>
                    </div>
                  </div>

                  {/* Review text */}
                  <p className="flex-1 font-clash font-medium text-[15px] leading-[22.75px] text-[#302e2f] mb-6">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Divider + Author */}
                  <div className="border-t border-[#302e2f] pt-4 flex items-center justify-between mt-auto">
                    <p className="font-clash font-medium text-[14.9px] leading-[24px] text-[#302e2f]">
                      {review.authorName}
                    </p>
                    {review.date && (
                      <p className="font-clash font-medium text-[11.8px] leading-[16px] text-[#302e2f]">
                        {formatDate(review.date)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile "Leave review" button */}
      <div className="relative max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="lg:hidden flex justify-center mt-8">
          <Link
            href="https://g.page/r/CSlpaM60GjnOEAE/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#7960a9] text-[#f0eff0] font-clash font-medium text-[14.5px] leading-[24px] rounded-[10px] px-8 py-4 hover:opacity-90 transition-opacity"
          >
            {t("reviews.leaveReview")}
          </Link>
        </div>
      </div>
    </section>
  );
}
