import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/payload";
import NewsletterSection from "@/components/home/NewsletterSection";

const categoryLabels: Record<string, string> = {
  "car-care": "Péče o vůz",
  tips: "Tipy a triky",
  news: "Novinky",
  technology: "Technologie",
};

const dateFormatter = new Intl.DateTimeFormat("cs-CZ", {
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

function renderContent(content: any) {
  if (!content?.root?.children) return null;
  return content.root.children.map((node: any, i: number) => {
    const text =
      node.children?.map((c: any) => c.text ?? "").join("") || "";
    if (!text) return null;

    // Handle headings
    if (node.tag === "h2" || node.type === "heading") {
      return (
        <h2
          key={i}
          className="font-clash text-[24px] font-bold text-[#302e2f] leading-[32px] text-center lg:text-left"
        >
          {text}
        </h2>
      );
    }
    if (node.tag === "h3") {
      return (
        <h3
          key={i}
          className="font-clash text-[20px] font-bold text-[#302e2f] leading-[28px] text-center lg:text-left"
        >
          {text}
        </h3>
      );
    }

    return (
      <p
        key={i}
        className="font-clash text-[15.3px] lg:text-[15.3px] font-medium text-[#302e2f] leading-[26px]"
      >
        {text}
      </p>
    );
  });
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return { title: "Článek nenalezen" };
  }
  return {
    title: post.title,
    description: post.excerpt ?? "",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const categoryLabel =
    categoryLabels[post.category ?? ""] ?? post.category ?? "";
  const readingTime = post.readingTime
    ? `${post.readingTime} min čtení`
    : "5 min čtení";
  const formattedDate = post.publishedAt
    ? dateFormatter.format(new Date(post.publishedAt))
    : "";

  // Get related posts (all posts except current, up to 3)
  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  // Determine which blog image to use for the featured image
  const postIndex = allPosts.findIndex((p) => p.slug === slug);
  const featuredImage = blogImages[postIndex >= 0 ? postIndex % blogImages.length : 0];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#302e2f] overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center gap-[10px] lg:gap-[25px] px-4 lg:px-[192px] py-[25px] lg:pt-[49px] lg:pb-[28px]">
          {/* Category badge */}
          {categoryLabel && (
            <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-[16px] py-[8px] font-clash font-medium text-[10px] lg:text-[13.3px] text-[#f0eff0] leading-[20px]">
              {categoryLabel}
            </span>
          )}

          {/* Title */}
          <div className="max-w-[1536px] w-full mx-auto px-4 lg:px-[32px] flex flex-col items-center gap-[25px]">
            <div className="text-center max-w-[768px]">
              <h1 className="font-clash font-medium text-[22px] lg:text-[60px] text-[#f0eff0] leading-[25px] lg:leading-[60px]">
                {post.title}
              </h1>
            </div>

            {/* Decorative blur circles */}
            <div className="absolute bg-[rgba(240,239,240,0.1)] blur-[32px] rounded-full size-[114px] lg:size-[256px] bottom-[53px] lg:bottom-auto lg:top-[40px] right-[30px] lg:right-auto lg:left-[288px]" />
            <div className="absolute bg-[rgba(240,239,240,0.1)] blur-[32px] rounded-full size-[114px] lg:size-[256px] bottom-0 lg:bottom-[-35px] left-0 lg:left-[1344px]" />
          </div>

          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-[8px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] lg:rounded-[13px] px-[24px] py-[16px] lg:py-[12px] font-clash font-medium text-[13px] lg:text-[14.9px] text-[#f0eff0] leading-[24px] hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="size-[18px] lg:size-[20px]" />
            <span>Zpět na hlavní stránku</span>
          </Link>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center justify-center gap-[24px]">
            {formattedDate && (
              <div className="flex items-center gap-[8px]">
                <Calendar className="size-[18px] text-[#f0eff0]" />
                <span className="font-clash font-normal text-[10px] lg:text-[14.1px] text-[#f0eff0] leading-[24px]">
                  {formattedDate}
                </span>
              </div>
            )}
            <div className="flex items-center gap-[8px]">
              <Clock className="size-[18px] text-[#f0eff0]" />
              <span className="font-clash font-normal text-[10px] lg:text-[15.3px] text-[#f0eff0] leading-[24px]">
                {readingTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="bg-[#f0eff0] py-[25px] lg:pt-[25px]">
        <div className="flex items-center justify-center px-[16px] lg:px-[384px]">
          {/* Content card */}
          <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden w-full max-w-[768px] px-[32px] lg:px-[48px] pt-[32px] lg:pt-[48px] pb-[48px] lg:pb-[64px] flex flex-col gap-[10px] lg:gap-[15px] items-center">
            {/* Featured image */}
            <div className="relative w-full h-[251px] rounded-[13px] overflow-hidden">
              <Image
                src={featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="w-full flex flex-col gap-[16px] lg:gap-[16px]">
              {renderContent(post.content)}
            </div>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#f0eff0] pb-[25px] lg:pb-[40px]">
          <div className="max-w-[1152px] mx-auto px-[16px] lg:px-[32px] flex flex-col gap-[25px] lg:gap-[48px] items-center">
            {/* Heading */}
            <div className="w-full flex flex-col gap-[12px] lg:gap-[16px]">
              <h2 className="font-clash font-bold text-[30px] lg:text-[36px] text-[#302e2f] leading-[36px] lg:leading-[40px] text-center">
                Přečíst další články
              </h2>
              <p className="font-clash font-medium text-[15.3px] lg:text-[20px] text-[#302e2f] leading-[24px] text-center">
                Další články
              </p>
            </div>

            {/* Related posts grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-[0px] lg:gap-[32px]">
              {relatedPosts.map((rel, i) => {
                const relCategoryLabel =
                  categoryLabels[rel.category ?? ""] ?? rel.category ?? "";
                const relDate = rel.publishedAt
                  ? dateFormatter.format(new Date(rel.publishedAt))
                  : "";

                return (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group relative flex flex-col items-start justify-center overflow-visible"
                  >
                    {/* Category floating badge */}
                    {relCategoryLabel && (
                      <div className="absolute -top-[38px] left-1/2 -translate-x-1/2 z-10 hidden lg:flex items-start justify-center w-[424px] h-[74px]">
                        <div className="backdrop-blur-[7.5px] bg-gradient-to-r from-[#7960a9] to-[#302643] rounded-full h-full flex flex-col items-center justify-end overflow-hidden px-[16px] py-[8px] w-[214px]">
                          <span className="font-clash font-bold text-[16px] text-[#f0eff0] leading-[20px]">
                            {relCategoryLabel}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] overflow-hidden w-full">
                      {/* Image */}
                      <div className="relative h-[192px] lg:h-[224px] overflow-hidden">
                        <Image
                          src={blogImages[(i + 1) % blogImages.length]}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-[#302e2f]/10" />
                      </div>

                      {/* Content */}
                      <div className="p-[24px]">
                        {/* Date + reading time */}
                        <div className="flex items-center justify-between mb-[12px]">
                          <span className="inline-flex items-center bg-[#7960a9] text-[#f0eff0] font-clash font-medium text-[10.1px] lg:text-[10.7px] leading-[16px] rounded-full px-[12px] py-[4px]">
                            {relDate}
                          </span>
                          <div className="flex items-center gap-[4px]">
                            <Clock className="size-[14px] text-[#302e2f]" />
                            <span className="font-clash font-medium text-[11.4px] text-[#302e2f] leading-[16px]">
                              {rel.readingTime ? `${rel.readingTime} min čtení` : "5 min čtení"}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-clash font-bold text-[18px] lg:text-[20px] text-[#302e2f] leading-[28px] group-hover:text-[#7960a9] transition-colors mb-[12px]">
                          {rel.title}
                        </h3>

                        {/* Excerpt */}
                        {rel.excerpt && (
                          <p className="font-clash font-medium text-[13.5px] lg:text-[11.4px] text-[#302e2f] leading-[22.75px] lg:leading-[16px] line-clamp-3">
                            {rel.excerpt}
                          </p>
                        )}

                        {/* Divider + arrow */}
                        <div className="border-t border-[#f0eff0] pt-[17px] mt-[16px] flex items-start justify-end">
                          <ArrowRight className="size-[20px] text-[#302e2f] group-hover:text-[#7960a9] transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Back to blog button */}
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-[12px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[14.6px] lg:text-[17.4px] leading-[24px] lg:leading-[28px] rounded-[10px] px-[32px] lg:px-[48px] py-[16px] lg:py-[20px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity"
              >
                <span>Zpět na blog</span>
                <ArrowRight className="size-[20px] lg:size-[22px]" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
}
