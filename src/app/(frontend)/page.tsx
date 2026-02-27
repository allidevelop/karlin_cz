import {
  getFAQ,
  getReviews,
  getPromotions,
  getBlogPosts,
  getPartners,
  getExpressWashSettings,
} from "@/lib/payload";

import {
  HeroSection,
  ServicesSection,
  PromotionsSection,
  ExpressWashSection,
  ReviewsSection,
  ContactSection,
  FaqSection,
  PartnersSection,
  BlogSection,
  NewsletterSection,
} from "@/components/home";
import {
  UpperWaveDecoration,
  LowerWaveDecoration,
} from "@/components/home/WaveDecorations";

export default async function HomePage() {
  const [faq, reviews, promotions, blogPosts, partners, expressWashSettings] =
    await Promise.all([
      getFAQ(),
      getReviews(),
      getPromotions(),
      getBlogPosts(8),
      getPartners(),
      getExpressWashSettings(),
    ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Automyčka Karlín',
            description:
              'Profesionální ruční mytí a detailing vozidel v Praze Karlíně.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Sokolovská 694/98',
              addressLocality: 'Praha',
              postalCode: '186 00',
              addressCountry: 'CZ',
            },
            telephone: '+420775009033',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3231',
            openingHours: ['Mo-Su 07:00-20:00'],
            priceRange: '$$',
          }),
        }}
      />

      {/* Hero (dark with image + wave to light) */}
      <HeroSection />

      {/* ══ Light sections wrapper with decorative purple wave ribbons ══ */}
      <div className="relative bg-[#f0eff0] overflow-hidden mt-[-2px]">
        <UpperWaveDecoration />

        {/* Content sections */}
        <div className="relative z-[1]">
          <ServicesSection />
          <PromotionsSection
            promotions={promotions.map((p) => ({
              title: p.title,
              slug: p.slug,
              description: p.description ?? null,
              discountedPrice: p.discountedPrice ?? null,
            }))}
          />
          <ExpressWashSection
            showLoyaltyCta={expressWashSettings.showLoyaltyCta}
            showVoucherCta={expressWashSettings.showVoucherCta}
          />
        </div>
      </div>

      {/* Reviews (dark bg #302e2f) */}
      <ReviewsSection
        reviews={reviews.map((r) => ({
          id: r.id,
          authorName: r.authorName,
          text: r.text,
          rating: r.rating,
          date: r.date ?? null,
          source: r.source ?? "google",
        }))}
      />

      {/* ══ Contact mega-section with decorative purple wave ribbons ══ */}
      <div className="relative bg-[#f0eff0] overflow-hidden">
        <LowerWaveDecoration />

        <div className="relative z-[1]">
          <ContactSection />
          <FaqSection
            items={faq.map((f) => ({
              id: f.id,
              question: f.question,
              answer: f.answer,
            }))}
          />
          <PartnersSection
            partners={partners.map((p) => ({
              name: p.name,
              website: p.website ?? null,
            }))}
          />
          <BlogSection
            posts={blogPosts.map((bp) => ({
              title: bp.title,
              slug: bp.slug,
              excerpt: bp.excerpt ?? null,
              category: bp.category ?? null,
              publishedAt: bp.publishedAt ?? null,
            }))}
          />
        </div>
      </div>

      {/* Newsletter (purple gradient) */}
      <NewsletterSection />
    </>
  );
}
