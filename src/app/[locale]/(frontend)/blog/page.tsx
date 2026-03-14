import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ChevronLeft, Clock, ArrowRight } from "lucide-react";
import { getBlogPosts, getMediaUrl } from "@/lib/payload";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import SharedBottomSections from "@/components/shared/SharedBottomSections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.blogTitle"),
    description: t("metadata.blogDescription"),
  };
}

const categoryKeyMap: Record<string, string> = {
  "car-care": "blog.categories.carCare",
  tips: "blog.categories.tips",
  news: "blog.categories.news",
  technology: "blog.categories.technology",
};

function createDateFormatterShort(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const fallbackImages = [
  "/images/blog-1.jpg",
  "/images/blog-2.jpg",
  "/images/blog-3.jpg",
  "/images/blog-4.jpg",
];

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = await getBlogPosts();
  const t = await getTranslations();
  const dateFormatterShort = createDateFormatterShort(locale);

  return (
    <>
      {/* Hero */}
      <PageHero
        title={t("blog.pageTitle")}
        subtitle={t("blog.pageSubtitle")}
      >
        <div className="flex justify-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-medium text-[14.9px] leading-[24px] rounded-[10px] px-6 py-3 hover:opacity-90 transition-opacity"
          >
            <ChevronLeft className="size-5" />
            <span>{t("blog.backHome")}</span>
          </Link>
        </div>
      </PageHero>

      {/* Blog listing */}
      <div className="relative bg-[#f0eff0] overflow-hidden">
        {/* Background wave decoration at 40% opacity, matching akce page */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <Image
            src="/images/wave-bg.png"
            alt=""
            fill
            className="object-cover opacity-40"
            priority={false}
          />
        </div>

        <div className="relative z-[1]">
        <section className="py-[25px] lg:py-[48px]">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
            {/* Blog card grid */}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] lg:gap-[32px]">
                {posts.map((post, i) => {
                  const categoryLabel = categoryKeyMap[post.category ?? ""]
                    ? t(categoryKeyMap[post.category ?? ""])
                    : post.category ?? "";
                  const readTime = post.readingTime ?? 5;
                  const formattedDate = post.publishedAt
                    ? dateFormatterShort
                        .format(new Date(post.publishedAt))
                        .replace(/\./g, "/")
                    : "";

                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group block"
                    >
                      {/* Card */}
                      <div className="relative bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] overflow-hidden h-full flex flex-col">
                        {/* Category badge — notch effect: flat top, rounded bottom */}
                        {categoryLabel && (
                          <div className="hidden lg:flex absolute top-0 left-1/2 -translate-x-1/2 z-10 items-start justify-center">
                            <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] backdrop-blur-[7.5px] text-[#f0eff0] font-clash font-bold text-[18px] leading-[24px] rounded-b-full px-6 pb-3 pt-2 whitespace-nowrap">
                              {categoryLabel}
                            </span>
                          </div>
                        )}
                        {/* Image */}
                        <div className="relative h-[192px] lg:h-[224px] overflow-hidden">
                          <Image
                            src={getMediaUrl(post.featuredImage) || fallbackImages[i % fallbackImages.length]}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                          {/* Dark overlay */}
                          <div className="absolute inset-0 bg-[#302e2f]/10" />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-1">
                          {/* Date + Read time */}
                          <div className="flex items-center justify-between mb-3">
                            {formattedDate && (
                              <span className="inline-flex items-center bg-[#7960a9] text-[#f0eff0] font-clash font-medium text-[10.1px] lg:text-[10.7px] leading-[16px] rounded-full px-3 py-1">
                                {formattedDate}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 font-clash font-medium text-[11.4px] leading-[16px] text-[#302e2f]">
                              <Clock className="size-[14px]" />
                              {readTime} {t("common.minRead")}
                            </span>
                          </div>

                          {/* Mobile category badge */}
                          {categoryLabel && (
                            <span className="lg:hidden inline-flex self-start items-center bg-gradient-to-r from-[#7960a9] to-[#302643] backdrop-blur-[7.5px] rounded-full px-3 py-1 font-clash font-bold text-[12px] text-[#f0eff0] mb-2">
                              {categoryLabel}
                            </span>
                          )}

                          {/* Title */}
                          <h3 className="font-clash font-bold text-[18px] lg:text-[20px] leading-[28px] text-[#302e2f] group-hover:text-[#7960a9] transition-colors mb-3">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="font-clash font-medium text-[13.5px] lg:text-[11.4px] leading-[22.75px] lg:leading-[16px] text-[#302e2f] line-clamp-3 mb-4">
                              {post.excerpt}
                            </p>
                          )}

                          {/* Spacer */}
                          <div className="flex-1" />

                          {/* Divider + Arrow (desktop) */}
                          <div className="hidden lg:flex items-center justify-end border-t border-[#f0eff0] pt-4">
                            <ArrowRight className="size-5 text-[#302e2f] group-hover:text-[#7960a9] transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="font-clash font-medium text-[16px] text-[#302e2f]">
                  {t("blog.noArticles")}
                </p>
              </div>
            )}

            {/* "Read all articles" button */}
            {posts.length > 0 && (
              <div className="flex justify-center mt-[25px] lg:mt-[48px]">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 bg-[#302e2f] border border-[#f0eff0] text-[#f0eff0] font-clash font-medium text-[14.6px] leading-[24px] rounded-[10px] px-6 lg:px-8 py-3 lg:py-4 hover:opacity-90 transition-opacity w-full lg:w-auto justify-center"
                >
                  <span>{t("blog.readAll")}</span>
                  <ArrowRight className="size-[18px]" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Shared bottom: FAQ, Partners, Blog carousel, Newsletter */}
        <SharedBottomSections wrapInLightBg={false} pageSlug="blog" />
        </div>
      </div>
    </>
  );
}
