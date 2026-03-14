"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BannerItem {
  id: string;
  title: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  linkUrl: string | null;
  displayMode: "always" | "rotation" | "ab-test";
}

interface BannerCarouselProps {
  banners: BannerItem[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [abVariant, setAbVariant] = useState<"a" | "b">("a");

  // A/B test: assign variant from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("automycka-ab-variant");
    if (stored === "a" || stored === "b") {
      setAbVariant(stored);
    } else {
      const variant = Math.random() < 0.5 ? "a" : "b";
      localStorage.setItem("automycka-ab-variant", variant);
      setAbVariant(variant);
    }
  }, []);

  // Filter banners based on display mode
  const visibleBanners = banners.filter((b) => {
    if (b.displayMode === "ab-test") {
      const index = banners.indexOf(b);
      return abVariant === "a" ? index % 2 === 0 : index % 2 === 1;
    }
    return true;
  });

  // Auto-rotate every 5 seconds for rotation mode
  useEffect(() => {
    if (visibleBanners.length <= 1) return;
    const hasRotation = visibleBanners.some((b) => b.displayMode === "rotation");
    if (!hasRotation) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [visibleBanners.length, visibleBanners]);

  const goTo = useCallback(
    (dir: "prev" | "next") => {
      setCurrentIndex((prev) =>
        dir === "prev"
          ? (prev - 1 + visibleBanners.length) % visibleBanners.length
          : (prev + 1) % visibleBanners.length
      );
    },
    [visibleBanners.length]
  );

  if (visibleBanners.length === 0) return null;

  const handleClick = async (bannerId: string) => {
    // Track click
    try {
      await fetch(`/api/banner-click?id=${bannerId}`, { method: "POST" });
    } catch {
      // Silently fail
    }
  };

  const banner = visibleBanners[currentIndex];
  if (!banner) return null;

  const Wrapper = banner.linkUrl ? "a" : "div";
  const wrapperProps = banner.linkUrl
    ? {
        href: banner.linkUrl,
        target: "_blank" as const,
        rel: "noopener noreferrer",
        onClick: () => handleClick(banner.id),
      }
    : {};

  return (
    <section className="relative">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        <div className="relative rounded-[16px] overflow-hidden">
          <Wrapper {...wrapperProps} className="block relative">
            {/* Desktop image */}
            <div className="hidden lg:block relative aspect-[1536/400]">
              <Image
                src={banner.desktopImageUrl}
                alt={banner.title}
                fill
                className="object-cover"
                sizes="1536px"
              />
            </div>
            {/* Mobile image */}
            <div className="lg:hidden relative aspect-[390/300]">
              <Image
                src={banner.mobileImageUrl}
                alt={banner.title}
                fill
                className="object-cover"
                sizes="390px"
              />
            </div>
          </Wrapper>

          {/* Navigation arrows (only if multiple banners) */}
          {visibleBanners.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo("prev")}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-[36px] h-[36px] rounded-full bg-[#302e2f]/60 hover:bg-[#302e2f]/80 transition-colors"
              >
                <ChevronLeft className="size-5 text-white" />
              </button>
              <button
                type="button"
                onClick={() => goTo("next")}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-[36px] h-[36px] rounded-full bg-[#302e2f]/60 hover:bg-[#302e2f]/80 transition-colors"
              >
                <ChevronRight className="size-5 text-white" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {visibleBanners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {visibleBanners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? "bg-white w-6"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
