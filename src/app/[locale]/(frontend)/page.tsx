import {
  getFAQ,
  getReviews,
  getPromotions,
  getBlogPosts,
  getPartners,
  getExpressWashSettings,
  getInstagramReels,
  getHomePageContent,
  getActiveBanners,
  getMediaUrl,
  getTranslations as getCmsTranslations,
} from "@/lib/payload";
import { getLocale } from "next-intl/server";

import {
  HeroSection,
  ServicesSection,
  PromotionsSection,
  ExpressWashSection,
  InstagramReelsSection,
  ReviewsSection,
  ContactSection,
  FaqSection,
  PartnersSection,
  BlogSection,
  NewsletterSection,
} from "@/components/home";
import { Link } from "@/i18n/navigation";
import {
  UpperWaveDecoration,
  LowerWaveDecoration,
} from "@/components/home/WaveDecorations";
import BannerCarousel from "@/components/shared/BannerCarousel";

export default async function HomePage() {
  const locale = await getLocale();
  const [faq, reviews, promotions, blogPosts, partners, expressWashSettings, instagramReels, cmsContent, heroBelowBanners, footerAboveBanners, cmsTranslations] =
    await Promise.all([
      getFAQ('home'),
      getReviews(),
      getPromotions(),
      getBlogPosts(8),
      getPartners(),
      getExpressWashSettings(locale),
      getInstagramReels(locale),
      getHomePageContent(locale),
      getActiveBanners('hero-below', locale),
      getActiveBanners('footer-above', locale),
      getCmsTranslations(locale),
    ]);

  const mapBanners = (banners: Awaited<ReturnType<typeof getActiveBanners>>) =>
    banners.map((b) => ({
      id: String(b.id),
      title: (b.title as string) ?? "",
      desktopImageUrl: getMediaUrl(b.desktopImage) ?? "",
      mobileImageUrl: getMediaUrl(b.mobileImage) ?? "",
      linkUrl: (b.linkUrl as string) ?? null,
      displayMode: (b.displayMode as "always" | "rotation" | "ab-test") ?? "always",
    })).filter((b) => b.desktopImageUrl && b.mobileImageUrl);

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
      <HeroSection
        cmsTitle={cmsContent?.heroTitle}
        cmsSubtitle={cmsContent?.heroSubtitle}
        cmsSubtitles={cmsContent?.heroSubtitles}
        cmsCtaText={cmsContent?.heroCtaText}
        cmsHeroImageUrl={getMediaUrl(cmsContent?.heroImage)}
        cmsHeroVideoId={cmsContent?.heroVideoId}
        cmsNavigateButton={cmsTranslations?.heroNavigateButton}
      />

      {/* Banners: hero-below position */}
      {mapBanners(heroBelowBanners).length > 0 && (
        <div className="bg-[#f0eff0] py-6">
          <BannerCarousel banners={mapBanners(heroBelowBanners)} />
        </div>
      )}

      {/* ══ Light sections wrapper with decorative purple wave ribbons ══ */}
      <div className="relative bg-[#f0eff0] overflow-hidden mt-[-2px]">
        {/* Purple gradient transition from hero */}
        <div className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-[#9b7ec4]/30 to-transparent z-[2] pointer-events-none" />
        <UpperWaveDecoration />

        {/* Content sections */}
        <div className="relative z-[1]">
          <ServicesSection
            cmsTitle={cmsContent?.servicesTitle}
            cmsSubtitle={cmsContent?.servicesSubtitle}
            cmsChooseProgramButton={cmsTranslations?.servicesChooseProgramButton}
            cmsAllServicesButton={cmsTranslations?.servicesAllButton}
          />
          <PromotionsSection
            promotions={promotions.map((p) => ({
              title: p.title,
              slug: p.slug,
              description: p.description ?? null,
              discountedPrice: p.discountedPrice ?? null,
              originalPrice: p.originalPrice ?? null,
              badge: p.badge ?? null,
              validUntil: p.validTo ?? null,
              imageUrl: getMediaUrl(p.image),
            }))}
            cmsTitle={cmsContent?.promotionsTitle}
            cmsSubtitle={cmsContent?.promotionsSubtitle}
            cmsViewDetailButton={cmsTranslations?.promotionsViewDetailButton}
            cmsAllPromotionsButton={cmsTranslations?.promotionsAllButton}
          />
          {instagramReels && instagramReels.reels.length > 0 && (
            <InstagramReelsSection
              reels={instagramReels.reels}
              title={instagramReels.title}
              subtitle={instagramReels.subtitle}
              instagramUrl={instagramReels.instagramUrl}
            />
          )}
          <ExpressWashSection
            showLoyaltyCta={expressWashSettings.showLoyaltyCta}
            showVoucherCta={expressWashSettings.showVoucherCta}
            desktopBannerUrl={expressWashSettings.desktopBannerUrl}
            mobileBannerUrl={expressWashSettings.mobileBannerUrl}
            bannerLink={expressWashSettings.bannerLink}
            cmsStartButton={cmsTranslations?.expressWashStartButton}
          />
        </div>

        {/* CTA: Rychlá Rezervace */}
        <div className="relative z-[1] max-w-[1536px] mx-auto px-4 lg:px-[32px] pb-[25px]">
          <div className="flex justify-center">
            <Link
              href="/rezervace/vozidlo"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[16px] lg:text-[20px] uppercase rounded-[10px] px-10 py-4 lg:py-5 shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
            >
              {cmsTranslations?.heroCtaText || "Rychlá Rezervace"}
            </Link>
          </div>
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
        cmsTitle={cmsContent?.reviewsTitle}
        cmsSubtitle={cmsContent?.reviewsSubtitle}
        cmsLeaveReviewButton={cmsTranslations?.reviewsLeaveReviewButton}
      />

      {/* ══ Contact mega-section with decorative purple wave ribbons ══ */}
      <div className="relative bg-[#f0eff0] overflow-hidden">
        <LowerWaveDecoration />

        <div className="relative z-[1]">
          <ContactSection
            cmsTitle={cmsContent?.contactTitle}
            cmsFormHeading={cmsContent?.contactFormHeading}
            cmsFormSubheading={cmsContent?.contactFormSubheading}
            cmsSendButton={cmsTranslations?.contactSendButton}
            cmsNavigateButton={cmsTranslations?.contactNavigateButton}
          />
          <FaqSection
            items={faq.map((f) => ({
              id: f.id,
              question: f.question,
              answer: f.answer,
            }))}
            cmsTitle={cmsContent?.faqTitle}
            cmsSubtitle={cmsContent?.faqSubtitle}
            cmsContactUsButton={cmsTranslations?.faqContactUsButton}
          />
          <PartnersSection
            partners={partners.map((p) => ({
              name: p.name,
              website: p.website ?? null,
              logoUrl: getMediaUrl(p.logo),
            }))}
            cmsTitle={cmsContent?.partnersTitle}
            cmsSubtitle={cmsContent?.partnersSubtitle}
          />
          <BlogSection
            posts={blogPosts.map((bp) => ({
              title: bp.title,
              slug: bp.slug,
              excerpt: bp.excerpt ?? null,
              category: bp.category ?? null,
              publishedAt: bp.publishedAt ?? null,
              imageUrl: getMediaUrl(bp.featuredImage),
            }))}
            cmsTitle={cmsContent?.blogTitle}
            cmsSubtitle={cmsContent?.blogSubtitle}
            cmsReadAllButton={cmsTranslations?.blogReadAllButton}
          />
        </div>
      </div>

      {/* Banners: footer-above position */}
      {mapBanners(footerAboveBanners).length > 0 && (
        <div className="bg-[#f0eff0] py-6">
          <BannerCarousel banners={mapBanners(footerAboveBanners)} />
        </div>
      )}

      {/* Newsletter (purple gradient) */}
      <NewsletterSection
        cmsTitle={cmsContent?.newsletterTitle}
        cmsSubtitle={cmsContent?.newsletterSubtitle}
        cmsSubscribeButton={cmsTranslations?.newsletterSubscribeButton}
      />
    </>
  );
}
