import {
  getFAQ,
  getPartners,
  getBlogPosts,
} from "@/lib/payload";
import FaqSection from "@/components/home/FaqSection";
import PartnersSection from "@/components/home/PartnersSection";
import BlogSection from "@/components/home/BlogSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import {
  LowerWaveDecoration,
} from "@/components/home/WaveDecorations";

/**
 * Shared bottom sections that appear on all subpages per Figma design:
 * FAQ → Partners → Blog (on light bg with wave decorations) → Newsletter (purple gradient)
 *
 * This is a server component that fetches its own data.
 * Can be embedded inside an existing light-bg wrapper, or used standalone.
 */
export default async function SharedBottomSections({
  wrapInLightBg = true,
}: {
  /** If true, wraps FAQ/Partners/Blog in a light bg with wave decorations.
   *  Set false when embedding inside an already-light section. */
  wrapInLightBg?: boolean;
}) {
  const [faq, partners, blogPosts] = await Promise.all([
    getFAQ(),
    getPartners(),
    getBlogPosts(4),
  ]);

  const faqItems = faq.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));

  const partnerItems = partners.map((p) => ({
    name: p.name,
    website: p.website ?? null,
  }));

  const blogItems = blogPosts.map((bp) => ({
    title: bp.title,
    slug: bp.slug,
    excerpt: bp.excerpt ?? null,
    category: bp.category ?? null,
    publishedAt: bp.publishedAt ?? null,
  }));

  const sections = (
    <>
      <FaqSection items={faqItems} />
      <PartnersSection partners={partnerItems} />
      <BlogSection posts={blogItems} />
    </>
  );

  return (
    <>
      {wrapInLightBg ? (
        <div className="relative bg-[#f0eff0] overflow-hidden">
          <LowerWaveDecoration />
          <div className="relative z-[1]">{sections}</div>
        </div>
      ) : (
        sections
      )}
      <NewsletterSection />
    </>
  );
}
