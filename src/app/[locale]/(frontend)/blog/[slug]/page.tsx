import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getBlogPosts, getBlogPostBySlug, getMediaUrl } from "@/lib/payload";
import { getTranslations } from "next-intl/server";
import NewsletterSection from "@/components/home/NewsletterSection";

const categoryKeyMap: Record<string, string> = {
  "car-care": "blog.categories.carCare",
  tips: "blog.categories.tips",
  news: "blog.categories.news",
  technology: "blog.categories.technology",
};

function createDateFormatter(locale: string) {
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

function renderInlineChildren(children: any[]): React.ReactNode[] {
  if (!children) return [];
  return children.map((child: any, idx: number) => {
    if (child.type === 'link' || child.type === 'autolink') {
      const url = child.fields?.url || child.url || '#';
      return (
        <a
          key={idx}
          href={url}
          target={child.fields?.newTab ? '_blank' : undefined}
          rel={child.fields?.newTab ? 'noopener noreferrer' : undefined}
          className="text-[#7960a9] underline hover:text-[#9b7ec4] transition-colors"
        >
          {renderInlineChildren(child.children || [])}
        </a>
      );
    }

    let content: React.ReactNode = child.text ?? '';
    if (!content && !child.children) return null;

    if (child.children) {
      content = <>{renderInlineChildren(child.children)}</>;
    }

    if (child.format) {
      const fmt = typeof child.format === 'number' ? child.format : 0;
      if (fmt & 1) content = <strong key={`b-${idx}`}>{content}</strong>;
      if (fmt & 2) content = <em key={`i-${idx}`}>{content}</em>;
      if (fmt & 4) content = <s key={`s-${idx}`}>{content}</s>;
      if (fmt & 8) content = <u key={`u-${idx}`}>{content}</u>;
      if (fmt & 16) content = <code key={`c-${idx}`} className="bg-[#e5e4e5] rounded px-1.5 py-0.5 text-[14px] font-mono">{content}</code>;
    }
    if (child.bold) content = <strong key={`b-${idx}`}>{content}</strong>;
    if (child.italic) content = <em key={`i-${idx}`}>{content}</em>;
    if (child.underline) content = <u key={`u-${idx}`}>{content}</u>;
    if (child.strikethrough) content = <s key={`s-${idx}`}>{content}</s>;
    if (child.code) content = <code key={`c-${idx}`} className="bg-[#e5e4e5] rounded px-1.5 py-0.5 text-[14px] font-mono">{content}</code>;

    return <span key={idx}>{content}</span>;
  });
}

function renderContent(content: any) {
  if (!content?.root?.children) return null;
  return content.root.children.map((node: any, i: number) => {
    // Handle headings
    if (node.type === 'heading') {
      const tag = node.tag || 'h2';
      const inline = renderInlineChildren(node.children || []);
      if (tag === 'h3') {
        return (
          <h3 key={i} className="font-clash text-[20px] font-bold text-[#302e2f] leading-[28px] text-center lg:text-left">
            {inline}
          </h3>
        );
      }
      if (tag === 'h4') {
        return (
          <h4 key={i} className="font-clash text-[18px] font-bold text-[#302e2f] leading-[26px] text-center lg:text-left">
            {inline}
          </h4>
        );
      }
      return (
        <h2 key={i} className="font-clash text-[24px] font-bold text-[#302e2f] leading-[32px] text-center lg:text-left">
          {inline}
        </h2>
      );
    }

    // Handle lists
    if (node.type === 'list') {
      const items = (node.children || []).map((li: any, liIdx: number) => (
        <li key={liIdx}>{renderInlineChildren(li.children || [])}</li>
      ));
      if (node.listType === 'number') {
        return (
          <ol key={i} className="font-clash text-[15.3px] font-medium text-[#302e2f] leading-[26px] list-decimal list-inside space-y-1 ml-2">
            {items}
          </ol>
        );
      }
      return (
        <ul key={i} className="font-clash text-[15.3px] font-medium text-[#302e2f] leading-[26px] list-disc list-inside space-y-1 ml-2">
          {items}
        </ul>
      );
    }

    // Handle blockquote
    if (node.type === 'quote') {
      return (
        <blockquote key={i} className="border-l-4 border-[#7960a9] pl-4 font-clash text-[15.3px] font-medium text-[#302e2f]/80 leading-[26px] italic">
          {renderInlineChildren(node.children || [])}
        </blockquote>
      );
    }

    // Default: paragraph
    const inline = renderInlineChildren(node.children || []);
    const hasContent = node.children?.some((c: any) => c.text || c.children);
    if (!hasContent) return null;

    return (
      <p key={i} className="font-clash text-[15.3px] lg:text-[15.3px] font-medium text-[#302e2f] leading-[26px]">
        {inline}
      </p>
    );
  });
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.flatMap((p) =>
    ['cs', 'en', 'ru'].map((locale) => ({ locale, slug: p.slug }))
  );
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
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = await getBlogPostBySlug(slug);
  const t = await getTranslations();
  const dateFormatter = createDateFormatter(locale);

  if (!post) {
    notFound();
  }

  const categoryLabel = categoryKeyMap[post.category ?? ""]
    ? t(categoryKeyMap[post.category ?? ""])
    : post.category ?? "";
  const readingTime = post.readingTime
    ? `${post.readingTime} ${t("common.minRead")}`
    : `5 ${t("common.minRead")}`;
  const formattedDate = post.publishedAt
    ? dateFormatter.format(new Date(post.publishedAt)).replace(/\./g, "/")
    : "";

  // Get related posts (all posts except current, up to 3)
  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  // Use CMS featured image if available, otherwise fall back to placeholder
  const postIndex = allPosts.findIndex((p) => p.slug === slug);
  const featuredImage = getMediaUrl(post.featuredImage) || fallbackImages[postIndex >= 0 ? postIndex % fallbackImages.length : 0];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#302e2f] overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center gap-[10px] lg:gap-[25px] px-4 lg:px-[64px] pt-20 pb-8 lg:pt-24 lg:pb-12">
          {/* Category badge */}
          {categoryLabel && (
            <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-[16px] py-[8px] font-clash font-medium text-[10px] lg:text-[13.3px] text-[#f0eff0] leading-[20px]">
              {categoryLabel}
            </span>
          )}

          {/* Title */}
          <div className="max-w-[1536px] w-full mx-auto px-4 lg:px-[32px] flex flex-col items-center gap-[25px]">
            <div className="text-center max-w-[960px]">
              <h1 className="font-clash font-bold text-[22px] lg:text-[60px] text-[#f0eff0] leading-[25px] lg:leading-[60px]">
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
            <span>{t("blog.backToBlog")}</span>
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
      <div className="relative bg-[#f0eff0] overflow-hidden">
        {/* Background wave decoration at 40% opacity */}
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
      <section className="py-[25px] lg:pt-[25px]">
        <div className="flex items-center justify-center px-[16px] lg:px-[128px]">
          {/* Content card */}
          <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden w-full max-w-[960px] px-[24px] lg:px-[64px] pt-[32px] lg:pt-[48px] pb-[48px] lg:pb-[64px] flex flex-col gap-[10px] lg:gap-[15px] items-center">
            {/* Featured image */}
            <div className="relative w-full h-[251px] rounded-[13px] overflow-hidden">
              <Image
                src={featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content with inline gallery images */}
            <div className="w-full flex flex-col gap-[16px] lg:gap-[16px]">
              {(() => {
                const contentNodes = renderContent(post.content);
                const galleryItems = ((post as Record<string, unknown>).gallery as Array<{ image: { url?: string } | null; caption?: string }> | undefined) ?? [];
                if (!contentNodes || galleryItems.length === 0) return contentNodes;

                // Distribute gallery images evenly throughout content
                const nodes = Array.isArray(contentNodes) ? contentNodes : [contentNodes];
                const totalNodes = nodes.length;
                const result: React.ReactNode[] = [];

                galleryItems.forEach((item, gi) => {
                  const imgUrl = typeof item.image === 'object' && item.image?.url ? item.image.url : null;
                  if (!imgUrl) return;
                  // Insert after: 1st image after 1/4, 2nd after 1/2, 3rd after 3/4
                  const insertAfter = Math.floor(((gi + 1) / (galleryItems.length + 1)) * totalNodes);

                  // Find the right position and mark it
                  if (!result[insertAfter]) result[insertAfter] = [];
                  (result[insertAfter] as React.ReactNode[]).push(
                    <div key={`gallery-${gi}`} className="relative w-full h-[200px] lg:h-[350px] rounded-[13px] overflow-hidden my-4">
                      <Image src={imgUrl} alt={item.caption || ''} fill className="object-cover" />
                      {item.caption && (
                        <p className="absolute bottom-0 left-0 right-0 bg-[#302e2f]/60 px-4 py-2 font-clash text-[12px] text-white text-center">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  );
                });

                // Merge nodes with gallery images
                const merged: React.ReactNode[] = [];
                nodes.forEach((node, i) => {
                  merged.push(node);
                  if (result[i]) {
                    merged.push(...(Array.isArray(result[i]) ? (result[i] as React.ReactNode[]) : [result[i]]));
                  }
                });
                return merged;
              })()}
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
                {t("blog.readMoreArticles")}
              </h2>
              <p className="font-clash font-medium text-[15.3px] lg:text-[20px] text-[#302e2f] leading-[24px] text-center">
                {t("blog.moreArticles")}
              </p>
            </div>

            {/* Related posts grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-[16px] lg:gap-[32px]">
              {relatedPosts.map((rel, i) => {
                const relCategoryLabel = categoryKeyMap[rel.category ?? ""]
                  ? t(categoryKeyMap[rel.category ?? ""])
                  : rel.category ?? "";
                const relDate = rel.publishedAt
                  ? dateFormatter.format(new Date(rel.publishedAt)).replace(/\./g, "/")
                  : "";

                return (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group block"
                  >
                    <div className="relative bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] overflow-hidden w-full">
                      {/* Category badge — notch effect: flat top, rounded bottom */}
                      {relCategoryLabel && (
                        <div className="hidden lg:flex absolute top-0 left-1/2 -translate-x-1/2 z-10 items-start justify-center">
                          <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] backdrop-blur-[7.5px] text-[#f0eff0] font-clash font-bold text-[18px] leading-[24px] rounded-b-full px-6 pb-3 pt-2 whitespace-nowrap">
                            {relCategoryLabel}
                          </span>
                        </div>
                      )}
                      {/* Image */}
                      <div className="relative h-[192px] lg:h-[224px] overflow-hidden">
                        <Image
                          src={getMediaUrl(rel.featuredImage) || fallbackImages[(i + 1) % fallbackImages.length]}
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
                              {rel.readingTime ? `${rel.readingTime} ${t("common.minRead")}` : `5 ${t("common.minRead")}`}
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
                <span>{t("blog.backToBlog")}</span>
                <ArrowRight className="size-[20px] lg:size-[22px]" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <NewsletterSection />
        </div>
      </div>
    </>
  );
}
