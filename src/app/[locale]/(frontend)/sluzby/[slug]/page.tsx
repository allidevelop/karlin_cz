import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  Check,
  ArrowRight,
  Droplets,
  SprayCan,
  Armchair,
  Sparkles,
  ShieldCheck,
  Leaf,
  FileCheck2,
  Star,
  Car,
  ClipboardList,
  Gauge,
  Wrench,
  MapPin,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getServices, getServiceBySlug, getTranslations as getCmsTranslations } from "@/lib/payload";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";
import ReviewsSection from "@/components/home/ReviewsSection";
import BeforeAfterSlider from "@/components/shared/BeforeAfterSlider";

/* ── Image map for service hero/detail images ── */

const FALLBACK_IMAGE_MAP: Record<string, string> = {
  "exterior-komplet": "/images/service-exterior.jpg",
  "interior-komplet": "/images/service-interior.jpg",
  "to-go": "/images/service-togo.jpg",
  "to-glow": "/images/service-toglow.jpg",
  "to-wow": "/images/service-towow.jpg",
  "premium-detailing": "/images/service-premium.jpg",
  "premium-detailing-komplet": "/images/service-premium.jpg",
  "komplexni-myti": "/images/service-togo.jpg",
};

/* ── Static params ── */

export async function generateStaticParams() {
  const services = await getServices();
  return services.flatMap((s) =>
    ['cs', 'en', 'ru'].map((locale) => ({ locale, slug: s.slug }))
  );
}

/* ── Metadata ── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) {
    return { title: "Služba nenalezena" };
  }
  return {
    title: service.name,
    description: service.description ?? "",
  };
}

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [service, cmsTranslations] = await Promise.all([
    getServiceBySlug(slug, locale),
    getCmsTranslations(locale),
  ]);
  const t = await getTranslations();

  if (!service) {
    notFound();
  }

  // Extract features
  const features: string[] =
    (service.features as { feature: string }[] | undefined)?.map(
      (f) => f.feature
    ) ?? [];

  // Extract pricing by vehicle
  const pricing: { category: string; price: number }[] =
    (
      service.pricingByVehicle as
        | { vehicleCategory: any; price: number }[]
        | undefined
    )?.map((p) => ({
      category:
        typeof p.vehicleCategory === "object" && p.vehicleCategory !== null
          ? p.vehicleCategory.name ?? "---"
          : "---",
      price: p.price,
    })) ?? [];

  // Service image — prefer CMS, fallback to static
  const imageObj = service.image as { url?: string } | null | undefined;
  const heroImage = (typeof imageObj === "object" && imageObj?.url) ? imageObj.url : (FALLBACK_IMAGE_MAP[slug] ?? null);

  // Before/After slider images — CMS fields, fallback to hero or default
  const beforeImageObj = (service as Record<string, unknown>).beforeImage as { url?: string } | null | undefined;
  const afterImageObj = (service as Record<string, unknown>).afterImage as { url?: string } | null | undefined;
  const defaultSliderImage = heroImage ?? "/images/hero-bg.jpg";
  const beforeImg = (typeof beforeImageObj === "object" && beforeImageObj?.url) ? beforeImageObj.url : defaultSliderImage;
  const afterImg = (typeof afterImageObj === "object" && afterImageObj?.url) ? afterImageObj.url : defaultSliderImage;

  // Related services (all except current, up to 3)
  const allServices = await getServices();
  const relatedServices = allServices
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  /* ── Price formatter ── */
  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return "---";
    return `${new Intl.NumberFormat(locale).format(price)} ${t("common.currency")}`;
  };

  /* ── Hardcoded section data (matches Figma) ── */
  const serviceTypes = [
    {
      icon: Droplets,
      title: t("serviceDetail.serviceTypes.handWash.title"),
      description: t("serviceDetail.serviceTypes.handWash.description"),
    },
    {
      icon: SprayCan,
      title: t("serviceDetail.serviceTypes.contactless.title"),
      description: t("serviceDetail.serviceTypes.contactless.description"),
    },
    {
      icon: Armchair,
      title: t("serviceDetail.serviceTypes.interiorCleaning.title"),
      description: t("serviceDetail.serviceTypes.interiorCleaning.description"),
    },
    {
      icon: Sparkles,
      title: t("serviceDetail.serviceTypes.complete.title"),
      description: t("serviceDetail.serviceTypes.complete.description"),
    },
  ];

  const competitorPoints = t.raw("serviceDetail.advantages.competitors") as string[];

  const ourAdvantages = t.raw("serviceDetail.advantages.ours") as string[];

  const whyChooseUs = [
    {
      icon: ShieldCheck,
      title: t("serviceDetail.whyChooseUs.noScratches.title"),
      description: t("serviceDetail.whyChooseUs.noScratches.description"),
    },
    {
      icon: ClipboardList,
      title: t("serviceDetail.whyChooseUs.qualityControl.title"),
      description: t("serviceDetail.whyChooseUs.qualityControl.description"),
    },
    {
      icon: Star,
      title: t("serviceDetail.whyChooseUs.individual.title"),
      description: t("serviceDetail.whyChooseUs.individual.description"),
    },
    {
      icon: Sparkles,
      title: t("serviceDetail.whyChooseUs.premium.title"),
      description: t("serviceDetail.whyChooseUs.premium.description"),
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: t("serviceDetail.howItWorks.step1.title"),
      description: t("serviceDetail.howItWorks.step1.description"),
    },
    {
      step: 2,
      title: t("serviceDetail.howItWorks.step2.title"),
      description: t("serviceDetail.howItWorks.step2.description"),
    },
    {
      step: 3,
      title: t("serviceDetail.howItWorks.step3.title"),
      description: t("serviceDetail.howItWorks.step3.description"),
    },
    {
      step: 4,
      title: t("serviceDetail.howItWorks.step4.title"),
      description: t("serviceDetail.howItWorks.step4.description"),
    },
  ];

  const safetyCards = [
    {
      icon: FileCheck2,
      title: t("serviceDetail.safety.certifiedChemistry.title"),
      description: t("serviceDetail.safety.certifiedChemistry.description"),
    },
    {
      icon: Leaf,
      title: t("serviceDetail.safety.ecoStandards.title"),
      description: t("serviceDetail.safety.ecoStandards.description"),
    },
    {
      icon: ShieldCheck,
      title: t("serviceDetail.safety.insurance.title"),
      description: t("serviceDetail.safety.insurance.description"),
    },
    {
      icon: Star,
      title: t("serviceDetail.safety.premiumCars.title"),
      description: t("serviceDetail.safety.premiumCars.description"),
    },
  ];

  const pricingFactors = [
    {
      icon: Car,
      title: t("serviceDetail.pricing.vehicleType.title"),
      description: t("serviceDetail.pricing.vehicleType.description"),
    },
    {
      icon: Armchair,
      title: t("serviceDetail.pricing.chosenService.title"),
      description: t("serviceDetail.pricing.chosenService.description"),
    },
    {
      icon: Gauge,
      title: t("serviceDetail.pricing.dirtLevel.title"),
      description: t("serviceDetail.pricing.dirtLevel.description"),
    },
    {
      icon: Wrench,
      title: t("serviceDetail.pricing.additionalServices.title"),
      description: t("serviceDetail.pricing.additionalServices.description"),
    },
  ];

  return (
    <>
      {/* ─── Hero with background image ─── */}
      <section className="relative bg-[#302e2f] overflow-hidden">
        {/* Background image */}
        {heroImage && (
          <Image
            src={heroImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#302e2f] via-[#302e2f]/85 to-[#302e2f]/60" />

        {/* Decorative bokeh circles */}
        <div className="absolute top-[40px] left-[15%] w-64 h-64 bg-[#f0eff0]/10 rounded-full blur-[32px]" />
        <div className="absolute top-[-40px] right-[20%] w-64 h-64 bg-[#f0eff0]/10 rounded-full blur-[32px]" />

        <div className="relative z-10 max-w-[1536px] mx-auto px-4 lg:px-[32px] pt-28 pb-12 lg:pt-32 lg:pb-16">
          <Link
            href="/sluzby"
            className="inline-flex items-center gap-1 font-clash text-[14px] font-medium text-[#b1b3b6] hover:text-[#f0eff0] transition-colors mb-6"
          >
            <ArrowRight className="size-4 rotate-180" />
            {t("serviceDetail.backToServices")}
          </Link>

          <div className="text-center">
            <h1 className="font-clash text-[36px] lg:text-[60px] font-bold text-[#f0eff0] leading-tight">
              {service.name ?? t("serviceDetail.notFound")}
            </h1>
            {service.description && (
              <p className="font-clash text-[22px] lg:text-[60px] font-medium text-[#f0eff0] mt-2 lg:mt-3 max-w-[960px] mx-auto leading-tight lg:leading-[60px]">
                {service.description}
              </p>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/rezervace/vozidlo"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-[28px] py-[17px] font-clash font-bold text-[20px] text-[#f0eff0] uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
            >
              {t("serviceDetail.quickBooking")}
            </Link>
            <Link
              href="https://maps.google.com/?q=Sokolovská+694/98+Praha+Karlín"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 backdrop-blur-[12px] bg-[#302e2f] border border-[#f0eff0] rounded-[10px] px-[29px] py-[17px] font-clash font-bold text-[20px] text-[#f0eff0] uppercase hover:bg-[#3a3839] transition-colors"
            >
              <MapPin className="size-5" />
              {t("common.navigate")}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Light bg wrapper ─── */}
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
        {/* ─── 1. Naše služby (Service Type Cards) ─── */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
            {/* Section header */}
            <div className="text-center mb-6">
              <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
                {t("serviceDetail.ourServicesTitle")}
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[20px] text-[#1a1a1a] leading-[24px] lg:leading-[28px] mt-4">
                {t("serviceDetail.ourServicesSubtitle")}
              </p>
            </div>

            {/* 4 service type cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-8">
              {serviceTypes.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden p-6 lg:p-[34px] text-center group hover:bg-[#7960a9] transition-colors"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] flex items-center justify-center">
                      <item.icon className="size-6 text-[#f0eff0]" />
                    </div>
                  </div>
                  <h3 className="font-clash font-bold text-[16px] lg:text-[24px] text-[#1a1a1a] leading-[20px] lg:leading-[32px] group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-clash font-medium text-[13px] lg:text-[16px] text-[#1a1a1a] leading-[20px] lg:leading-[26px] mt-2 group-hover:text-white/90 transition-colors">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA banner */}
            <div className="mt-8 backdrop-blur-[12.5px] bg-[#f0eff0]/10 border border-[#b1b3b6] rounded-[10px] p-6 lg:py-4 lg:px-8 text-center flex flex-col items-center gap-3">
              <p className="font-clash font-bold text-[14px] lg:text-[17px] text-[#302e2f] leading-[24px] lg:leading-[28px]">
                {t("serviceDetail.ctaBanner1")}
              </p>
              <p className="font-clash font-bold text-[14px] lg:text-[17.2px] text-[#7960a9] leading-[24px] lg:leading-[28px]">
                {t("serviceDetail.ctaBanner2")}
              </p>
              <Link
                href="/rezervace/vozidlo"
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-[28px] py-[17px] font-clash font-bold text-[20px] text-[#f0eff0] uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
              >
                {t("serviceDetail.order")}
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 2. Naše výhody (Comparison Section) ─── */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
            {/* Section header */}
            <div className="text-center mb-8 lg:mb-16">
              <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
                {t("serviceDetail.advantages.title")}
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[20px] text-[#1a1a1a] leading-[24px] lg:leading-[28px] mt-4">
                {t("serviceDetail.advantages.subtitle")}
              </p>
            </div>

            {/* Comparison cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Competitor card */}
              <div className="bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] p-6 lg:p-[34px]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="size-7 rounded-full bg-[#302e2f] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">X</span>
                  </div>
                  <h3 className="font-clash font-bold text-[20px] lg:text-[24px] text-[#302e2f] leading-[32px]">
                    {t("serviceDetail.advantages.competitorTitle")}
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  {competitorPoints.map((point: string) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="mt-[2px] shrink-0">
                        <div className="size-6 bg-[#f0eff0] rounded-full flex items-center justify-center">
                          <div className="size-2 bg-[#302e2f] rounded-full" />
                        </div>
                      </div>
                      <span className="font-clash font-medium text-[14px] lg:text-[15px] text-[#302e2f] leading-[26px]">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Our card */}
              <div className="bg-[#f0eff0] border-2 border-[#7960a9] rounded-[10px] p-6 lg:p-[34px] shadow-[0px_25px_50px_-12px_rgba(179,148,217,0.2)]">
                <div className="flex items-center gap-3 mb-8">
                  <Image
                    src="/images/logo.png"
                    alt={t("common.brandName")}
                    width={64}
                    height={64}
                    className="size-12 lg:size-16"
                  />
                  <h3 className="font-clash font-bold text-[20px] lg:text-[24px] text-[#7960a9] leading-[32px]">
                    {t("common.brandName")}
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  {ourAdvantages.map((point: string) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="mt-[2px] shrink-0">
                        <Check className="size-6 text-[#7960a9]" />
                      </div>
                      <span className="font-clash font-medium text-[14px] lg:text-[15px] text-[#1a1a1a] leading-[26px]">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. Before / After Slider ─── */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
            <BeforeAfterSlider
              beforeImage={beforeImg}
              afterImage={afterImg}
              beforeLabel={t("serviceDetail.beforeAfter.beforeLabel")}
              afterLabel={t("serviceDetail.beforeAfter.afterLabel")}
            />
          </div>
        </section>

        {/* ─── 4. Proč si vybrat AUTOMYČKA KARLÍN ─── */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
            {/* Section header */}
            <div className="text-center mb-6 lg:mb-10">
              <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
                {t("serviceDetail.whyChooseUs.title")}
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[20px] text-[#1a1a1a] leading-[24px] lg:leading-[28px] mt-4">
                {t("serviceDetail.whyChooseUs.subtitle")}
              </p>
            </div>

            {/* 4 cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {whyChooseUs.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden p-6 lg:p-8 text-center"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] flex items-center justify-center">
                      <item.icon className="size-6 text-[#f0eff0]" />
                    </div>
                  </div>
                  <h3 className="font-clash font-bold text-[16px] lg:text-[24px] text-[#1a1a1a] leading-[22px] lg:leading-[28px]">
                    {item.title}
                  </h3>
                  <p className="font-clash font-medium text-[13px] lg:text-[16px] text-[#1a1a1a] leading-[20px] lg:leading-[24px] mt-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Tagline */}
            <div className="mt-6 backdrop-blur-[12.5px] bg-[#f0eff0]/10 border border-[#b1b3b6] rounded-[10px] p-[25px] text-center">
              <p className="font-clash font-bold text-[14px] lg:text-[17px] text-[#7960a9] leading-[24px] lg:leading-[28px]">
                {t("serviceDetail.tagline")}
              </p>
            </div>
          </div>
        </section>

        {/* ─── 5. Jak to funguje (Dark bg) ─── */}
        <section className="bg-[#302e2f] py-16 lg:py-24 overflow-hidden relative">
          {/* Decorative circles */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bg-[#7960a9] blur-[32px] rounded-full size-96 right-[25%] top-0" />
            <div className="absolute bg-[#7960a9] blur-[32px] rounded-full size-96 left-[25%] bottom-0" />
          </div>

          <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px] relative z-10">
            {/* Section header */}
            <div className="text-center mb-10 lg:mb-16">
              <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#f0eff0] leading-[36px] lg:leading-[48px]">
                {t("serviceDetail.howItWorks.title")}
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[18.4px] text-[#f0eff0] leading-[24px] lg:leading-[28px] mt-4">
                {t("serviceDetail.howItWorks.subtitle")}
              </p>
            </div>

            {/* 4 steps */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {howItWorks.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-full flex items-center justify-center shadow-[0px_25px_50px_-12px_rgba(179,148,217,0.3)]">
                      <span className="font-clash font-bold text-[28px] lg:text-[36px] text-[#f0eff0]">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-clash font-bold text-[16px] lg:text-[20px] text-[#f0eff0] leading-[22px] lg:leading-[28px]">
                    {item.title}
                  </h3>
                  <p className="font-clash font-medium text-[13px] lg:text-[15.5px] text-[#f0eff0] leading-[20px] lg:leading-[26px] mt-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div className="flex justify-center mt-10 lg:mt-12">
              <Link
                href="/rezervace/vozidlo"
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-[28px] py-[17px] font-clash font-bold text-[20px] text-[#f0eff0] uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
              >
                {t("serviceDetail.order")}
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 6. Bezpečnost a zodpovědnost ─── */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
            {/* Section header */}
            <div className="text-center mb-6 lg:mb-16">
              <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#1a1a1a] leading-[36px] lg:leading-[48px]">
                {t("serviceDetail.safety.title")}
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[20px] text-[#1a1a1a] leading-[24px] lg:leading-[28px] mt-4">
                {t("serviceDetail.safety.subtitle")}
              </p>
            </div>

            {/* 4 safety cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {safetyCards.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden p-6 lg:p-8 text-center"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[16px] flex items-center justify-center">
                      <item.icon className="size-6 text-[#f0eff0]" />
                    </div>
                  </div>
                  <h3 className="font-clash font-bold text-[16px] lg:text-[20px] text-[#302e2f] leading-[22px] lg:leading-[28px]">
                    {item.title}
                  </h3>
                  <p className="font-clash font-medium text-[13px] lg:text-[15.3px] text-[#1a1a1a] leading-[20px] lg:leading-[26px] mt-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 7. Ceník a faktory ovlivňující cenu ─── */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
            {/* Section header */}
            <div className="text-center mb-6 lg:mb-10">
              <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#1a1a1a] leading-[36px] lg:leading-[48px]">
                {t("serviceDetail.pricing.title")}
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[20px] text-[#1a1a1a] leading-[24px] lg:leading-[28px] mt-4">
                {t("serviceDetail.pricing.subtitle")}
              </p>
            </div>

            {/* 4 pricing factor cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {pricingFactors.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden p-6 lg:p-8 text-center"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[16px] flex items-center justify-center">
                      <item.icon className="size-6 text-[#f0eff0]" />
                    </div>
                  </div>
                  <h3 className="font-clash font-bold text-[16px] lg:text-[20px] text-[#302e2f] leading-[22px] lg:leading-[28px]">
                    {item.title}
                  </h3>
                  <p className="font-clash font-medium text-[13px] lg:text-[15.4px] text-[#1a1a1a] leading-[20px] lg:leading-[26px] mt-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Price tagline */}
            <div className="mt-6 backdrop-blur-[12.5px] bg-[#f0eff0]/10 border border-[#b1b3b6] rounded-[10px] p-[25px] text-center">
              <p className="font-clash font-bold text-[14px] lg:text-[17.3px] text-[#7960a9] leading-[24px] lg:leading-[28px]">
                {t("serviceDetail.pricing.basePrice")} {formatPrice(service.price)}
              </p>
            </div>
          </div>
        </section>

        {/* ─── 8. Service Features + Pricing (Dynamic Data) ─── */}
        {(features.length > 0 || pricing.length > 0) && (
          <section className="pb-16 lg:pb-24">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Features list */}
                {features.length > 0 && (
                  <div className="bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] p-6 lg:p-[34px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
                    <h3 className="font-clash font-bold text-[20px] lg:text-[24px] text-[#302e2f] leading-[28px] lg:leading-[32px] mb-6 flex items-center gap-3">
                      <div className="w-8 h-1 bg-[#7960a9] rounded-full" />
                      {t("serviceDetail.pricing.whatsIncluded")}
                    </h3>
                    <div className="flex flex-col gap-4">
                      {features.map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <div className="mt-[2px] shrink-0">
                            <Check className="size-5 text-[#7960a9]" />
                          </div>
                          <span className="font-clash font-medium text-[14px] lg:text-[15px] text-[#1a1a1a] leading-[26px]">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing by vehicle */}
                {pricing.length > 0 && (
                  <div className="bg-[#f0eff0] border-2 border-[#7960a9] rounded-[10px] p-6 lg:p-[34px] shadow-[0px_25px_50px_-12px_rgba(179,148,217,0.2)]">
                    <h3 className="font-clash font-bold text-[20px] lg:text-[24px] text-[#7960a9] leading-[28px] lg:leading-[32px] mb-6 flex items-center gap-3">
                      <div className="w-8 h-1 bg-[#7960a9] rounded-full" />
                      {t("serviceDetail.pricing.pricingByCategory")}
                    </h3>
                    <div className="flex flex-col gap-4">
                      {pricing.map((row) => (
                        <div
                          key={row.category}
                          className="flex items-center justify-between py-3 border-b border-[#302e2f]/10 last:border-0"
                        >
                          <span className="font-clash font-medium text-[14px] lg:text-[15px] text-[#302e2f] leading-[26px]">
                            {row.category}
                          </span>
                          <span className="font-clash font-bold text-[16px] lg:text-[18px] text-[#7960a9]">
                            {formatPrice(row.price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Book button */}
                    <Link
                      href="/rezervace/vozidlo"
                      className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-[28px] py-[17px] font-clash font-bold text-[18px] text-[#f0eff0] uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
                    >
                      {t("serviceDetail.pricing.bookAppointment")}
                      <ArrowRight className="size-5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ─── 9. Related Services ─── */}
        {relatedServices.length > 0 && (
          <section className="pb-16 lg:pb-24">
            <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
              <h2 className="font-clash font-bold text-[28px] lg:text-[36px] text-[#302e2f] text-center mb-8">
                {t("serviceDetail.otherServices")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {relatedServices.map((rel) => {
                  const relSlug = rel.slug as string;
                  const relImageObj = rel.image as { url?: string } | null | undefined;
                  const relImage = (typeof relImageObj === "object" && relImageObj?.url) ? relImageObj.url : FALLBACK_IMAGE_MAP[relSlug];
                  return (
                    <Link
                      key={relSlug}
                      href={`/sluzby/${relSlug}`}
                      className="bg-[#f0eff0] rounded-[10px] overflow-hidden border border-[#b1b3b6] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg transition-shadow group"
                    >
                      {/* Image */}
                      <div className="relative h-[200px] lg:h-[256px]">
                        {relImage ? (
                          <Image
                            src={relImage}
                            alt={rel.name ?? ""}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#302e2f] to-[#302e2f]/80" />
                        )}
                        <div className="absolute inset-0 bg-[#302e2f]/40" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                          <h3 className="font-clash font-bold text-[16px] lg:text-[24px] text-white uppercase leading-[20px] lg:leading-[32px]">
                            {rel.name}
                          </h3>
                          <div className="flex items-baseline gap-1 mt-1 lg:mt-2">
                            <span className="font-clash text-[10px] lg:text-[12px] font-normal text-[#b1b3b6] uppercase tracking-[0.6px]">
                              {t("common.priceFrom")}
                            </span>
                            <span className="font-clash font-bold text-[18px] lg:text-[29px] text-white">
                              {rel.price != null
                                ? new Intl.NumberFormat(locale).format(
                                    rel.price
                                  )
                                : ""}
                            </span>
                            <span className="font-clash font-normal text-[14px] lg:text-[18.8px] text-white">
                              {t("common.currency")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="p-4 lg:p-6 flex items-center justify-center gap-[15px]">
                        <span className="inline-flex items-center justify-center bg-[#302e2f] border-2 border-[#302e2f] rounded-[10px] h-[40px] lg:h-[47px] px-4 lg:px-6 font-clash font-bold text-[14px] lg:text-[20px] text-white uppercase">
                          {t("common.learnMore")}
                        </span>
                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] h-[40px] lg:h-[47px] px-4 lg:px-6 font-clash font-bold text-[14px] lg:text-[20px] text-white uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)]">
                          {t("common.bookNow")}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ─── 10. Co říkají naši klienti (Reviews) ─── */}
        <ReviewsSection
          reviews={[
            {
              id: "r1",
              authorName: "Pavel Novák",
              text: "Výborná kvalita mytí. Auto vypadalo jako nové. Personál velmi příjemný a profesionální.",
              rating: 5,
              date: "2024-12-15",
              source: "google",
            },
            {
              id: "r2",
              authorName: "Jana Dvořáková",
              text: "Nejlepší automyčka v Praze. Skvělé výsledky, rychlé a za rozumnou cenu.",
              rating: 5,
              date: "2024-11-20",
              source: "google",
            },
            {
              id: "r3",
              authorName: "Martin Horák",
              text: "Profesionální přístup a perfektní výsledek. Doporučuji všem.",
              rating: 5,
              date: "2024-10-08",
              source: "firmy",
            },
            {
              id: "r4",
              authorName: "Lucie Procházková",
              text: "Konečně automyčka, které mohu důvěřovat se svým novým autem.",
              rating: 5,
              date: "2024-09-12",
              source: "firmy",
            },
          ]}
        />

        {/* ─── 11. "Nenašli jste co hledáte?" CTA ─── */}
        <NotFoundCTA
          cmsBookNowButton={cmsTranslations?.notFoundBookButton}
          cmsCallUsButton={cmsTranslations?.notFoundCallButton}
        />

        {/* ─── 11. Shared bottom: FAQ, Partners, Blog ─── */}
        <SharedBottomSections wrapInLightBg={false} pageSlug="services" />
        </div>
      </div>
    </>
  );
}
