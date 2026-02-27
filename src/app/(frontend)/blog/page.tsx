import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Clock, ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/payload";
import PageHero from "@/components/shared/PageHero";
import SharedBottomSections from "@/components/shared/SharedBottomSections";

export const metadata: Metadata = {
  title: "Blog & Novinky",
  description:
    "Vše o péči o automobily, tipy a novinky z naší automyčky.",
};

const categoryLabels: Record<string, string> = {
  "car-care": "Péče o vůz",
  tips: "Tipy a rady",
  news: "Novinky",
  technology: "Technologie",
};

const dateFormatterShort = new Intl.DateTimeFormat("cs-CZ", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const blogImages = [
  "/images/blog-1.jpg",
  "/images/blog-2.jpg",
  "/images/blog-3.jpg",
  "/images/blog-4.jpg",
];

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Blog & Novinky"
        subtitle="Vše o péči o automobily, tipy a novinky z naší automyčky"
      >
        <div className="flex justify-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-medium text-[14.9px] leading-[24px] rounded-[10px] px-6 py-3 hover:opacity-90 transition-opacity"
          >
            <ChevronLeft className="size-5" />
            <span>Zpět na hlavní stránku</span>
          </Link>
        </div>
      </PageHero>

      {/* Blog listing */}
      <div className="bg-[#f0eff0]">
        <section className="py-[25px] lg:py-[48px]">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
            {/* Blog card grid */}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] lg:gap-[32px]">
                {posts.map((post, i) => {
                  const categoryLabel =
                    categoryLabels[post.category ?? ""] ??
                    post.category ??
                    "";
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
                      className="group relative block"
                    >
                      {/* Category badge (floating above card on desktop) */}
                      {categoryLabel && (
                        <div className="hidden lg:flex absolute -top-[18px] left-0 z-10">
                          <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#302643] backdrop-blur-[7.5px] rounded-full px-4 py-2 font-clash font-bold text-[16px] text-[#f0eff0] whitespace-nowrap">
                            {categoryLabel}
                          </span>
                        </div>
                      )}

                      {/* Card */}
                      <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] overflow-hidden h-full flex flex-col">
                        {/* Image */}
                        <div className="relative h-[192px] lg:h-[224px] overflow-hidden">
                          <Image
                            src={blogImages[i % blogImages.length]}
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
                              {readTime} min čtení
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
                  Zatím nejsou žádné články.
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
                  <span>Přečíst všechny články</span>
                  <ArrowRight className="size-[18px]" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Shared bottom: FAQ, Partners, Blog carousel, Newsletter */}
        <SharedBottomSections wrapInLightBg={false} />
      </div>
    </>
  );
}
