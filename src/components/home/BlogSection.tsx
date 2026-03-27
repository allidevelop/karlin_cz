"use client";

import { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, ArrowRight, Clock } from "lucide-react";

type Props = {
  posts: Array<{
    title: string;
    slug: string;
    excerpt?: string | null;
    category?: string | null;
    publishedAt?: string | null;
    imageUrl?: string | null;
  }>;
  cmsTitle?: string | null;
  cmsSubtitle?: string | null;
  cmsReadAllButton?: string | null;
};

const fallbackImages = [
  "/images/blog-1.jpg",
  "/images/blog-2.jpg",
  "/images/blog-3.jpg",
  "/images/blog-4.jpg",
];

const arrowBtnClass =
  "flex items-center justify-center w-12 h-12 rounded-[10px] border-2 border-[#b1b3b6] bg-[#f0eff0] text-[#302e2f] transition-all hover:border-[#7960a9] hover:text-[#7960a9] hover:shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)]";

export default function BlogSection({ posts, cmsTitle, cmsSubtitle, cmsReadAllButton }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-[25px]">
      {/* Header inside container */}
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[25px] gap-4">
          <div className="text-center lg:text-left">
            <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
              {t("blog.title")}
            </h2>
            <p className="font-clash font-medium text-[15.3px] lg:text-[36px] text-[#302e2f] leading-[24px] lg:leading-normal mt-1">
              {t("blog.subtitle")}
            </p>
          </div>
          <div className="flex items-center justify-center lg:justify-end gap-2">
            <button
              onClick={scrollPrev}
              aria-label={t("blog.prevArticle")}
              className={arrowBtnClass}
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={scrollNext}
              aria-label={t("blog.nextArticle")}
              className={arrowBtnClass}
            >
              <ChevronRight className="size-6" />
            </button>
            <Link
              href="/blog"
              className="hidden lg:inline-flex items-center gap-2 bg-[#302e2f] border border-[#f0eff0] text-[#f0eff0] font-clash font-medium text-[14.6px] leading-[24px] rounded-[10px] px-6 py-3 hover:opacity-90 transition-opacity ml-2"
            >
              {t("blog.readAll")}
              <ArrowRight className="size-[18px]" />
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
          <div className="flex gap-4 lg:gap-[48px]">
            {posts.map((post, i) => (
              <div
                key={post.slug}
                className="min-w-0 shrink-0 grow-0 basis-full lg:basis-[344px] self-stretch"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="card-hover-tint group relative flex flex-col rounded-[10px] overflow-hidden border border-[#b1b3b6] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-[2px] bg-[#f0eff0] transition-all duration-300 hover:border-[#7960a9] hover:shadow-[0_0_30px_-5px_rgba(121,96,169,0.3)] h-full"
                >
                  {/* Hover glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[32px] blur-[12px] opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
                  {/* Image */}
                  <div className="relative h-[192px] lg:h-[220px] overflow-hidden">
                    <Image
                      src={post.imageUrl || fallbackImages[i % fallbackImages.length]}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Body */}
                  <div className="p-5 lg:p-6 flex-1">
                    {/* Date + read time */}
                    <div className="flex items-center gap-3 mb-3">
                      {post.publishedAt && (
                        <span className="inline-flex items-center bg-[#7960a9] text-[#f0eff0] font-clash font-medium text-[10.1px] lg:text-[11px] leading-[16px] rounded-[10px] px-3 py-1">
                          {dateFormatter.format(new Date(post.publishedAt))}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 font-clash font-medium text-[11.4px] leading-[16px] text-[#b1b3b6]">
                        <Clock className="size-[14px]" />
                        {t("common.minRead", { count: 5 })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-clash font-bold text-[18px] leading-[28px] text-[#302e2f] group-hover:text-[#7960a9] transition-colors mb-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="font-clash font-medium text-[13.5px] leading-[22.75px] text-[#b1b3b6] line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* "All articles" button (mobile only) */}
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="lg:hidden flex justify-center mt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-[#302e2f] text-[#f0eff0] font-clash font-medium text-[14.6px] leading-[24px] rounded-[10px] px-8 py-4 hover:opacity-90 transition-opacity w-full justify-center"
          >
            {t("blog.readAll")}
            <ArrowRight className="size-[18px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
