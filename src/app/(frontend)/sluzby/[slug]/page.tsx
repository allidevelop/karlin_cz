import type { Metadata } from "next";
import Link from "next/link";
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
} from "lucide-react";
import { notFound } from "next/navigation";
import { getServices, getServiceBySlug } from "@/lib/payload";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";

/* ── Image map for service hero/detail images ── */

const IMAGE_MAP: Record<string, string> = {
  "exterior-komplet": "/images/service-exterior.jpg",
  "interior-komplet": "/images/service-interior.jpg",
  "to-go": "/images/service-togo.jpg",
  "to-glow": "/images/service-toglow.jpg",
  "to-wow": "/images/service-towow.jpg",
  "premium-detailing": "/images/service-premium.jpg",
};

/* ── Price formatter ── */

const formatPrice = (price: number | null | undefined) => {
  if (price == null) return "---";
  return `${new Intl.NumberFormat("cs-CZ").format(price)} Kč`;
};

/* ── Static params ── */

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
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

/* ── Hardcoded section data (matches Figma) ── */

const serviceTypes = [
  {
    icon: Droplets,
    title: "Ručné mytí",
    description: "Důkladné ruční mytí s prémiovou autochemií",
  },
  {
    icon: SprayCan,
    title: "Bezkontaktní mytí",
    description: "Šetrné mytí vysokotlakým proudem vody",
  },
  {
    icon: Armchair,
    title: "Čištění interiéru",
    description: "Profesionální vysávání a čištění sedadel",
  },
  {
    icon: Sparkles,
    title: "Komplexní mytí",
    description: "Kompletní péče - exteriér i interiér",
  },
];

const competitorPoints = [
  "Standardní autochemie",
  "Různá kvalita personálu",
  "Bez záruky na ochranu laku",
  "Průměrná doba mytí 30-45 minut",
  "Složitá dostupnost",
  "Agresivní chemikálie",
];

const ourAdvantages = [
  "Prémiová autochemie nejvyšší kvality",
  "Zkušený tým profesionálů",
  "100% ochrana laku",
  "Express mytí 15-20 minut",
  "Skvělá lokalita v centru Karlína",
  "Ekologické přípravky",
  "Online rezervační systém 24/7",
  "Věrnostní program s bonusy",
  "Bezplatné parkování",
  "Kontrola kvality po každém mytí",
  "Pojištění vozidla během mytí",
  "Moderní technologie a vybavení",
];

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Bez škrábanců",
    description: "Garantujeme šetrné mytí bez poškození",
  },
  {
    icon: ClipboardList,
    title: "Kontrola kvality",
    description: "Každé auto kontrolujeme před předáním",
  },
  {
    icon: Star,
    title: "Individuální přístup",
    description: "Každé auto vyžaduje specifickou péči",
  },
  {
    icon: Sparkles,
    title: "Premium služby",
    description: "Používáme jen ty nejlepší produkty",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Příjezd nebo rezervace",
    description: "Přijeďte bez objednání nebo si rezervujte termín online",
  },
  {
    step: 2,
    title: "Výběr služby",
    description: "Vyberte si vhodný balíček nebo jednotlivé služby",
  },
  {
    step: 3,
    title: "Mytí a péče",
    description: "Necháme váš vůz zářit jako nový",
  },
  {
    step: 4,
    title: "Převzetí a platba",
    description: "Zkontrolujte výsledek a zaplaťte",
  },
];

const safetyCards = [
  {
    icon: FileCheck2,
    title: "Certifikovaná autochemie",
    description: "Používáme pouze schválené a testované přípravky",
  },
  {
    icon: Leaf,
    title: "Ekologické normy",
    description: "Dodržujeme všechny environmentální předpisy",
  },
  {
    icon: ShieldCheck,
    title: "Pojištění",
    description: "Každé vozidlo je během mytí plně pojištěno",
  },
  {
    icon: Star,
    title: "Pro prémiové vozy",
    description: "Vhodné i pro nové a luxusní automobily",
  },
];

const pricingFactors = [
  {
    icon: Car,
    title: "Typ vozidla",
    description: "Osobní, SUV, dodávka - každý typ má svou cenu",
  },
  {
    icon: Armchair,
    title: "Zvolená služba",
    description: "Od rychlého mytí po kompletní detailing",
  },
  {
    icon: Gauge,
    title: "Stupeň znečištění",
    description: "Silně znečištěná vozidla vyžadují více péče",
  },
  {
    icon: Wrench,
    title: "Doplňkové služby",
    description: "Vosk, černění pneumatik, čištění interiéru",
  },
];

/* ═══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

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

  // Service image
  const heroImage = IMAGE_MAP[slug] ?? null;

  // Related services (all except current, up to 3)
  const allServices = await getServices();
  const relatedServices = allServices
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  return (
    <>
      {/* ─── Hero ─── */}
      <PageHero
        title={service.name ?? "Služba"}
        subtitle={service.description ?? undefined}
        backLink={{ href: "/sluzby", label: "Zpět na služby" }}
      >
        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            href="/rezervace/vozidlo"
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-[28px] py-[17px] font-clash font-bold text-[20px] text-[#f0eff0] uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
          >
            Rychla Rezervace
          </Link>
          <Link
            href="https://maps.google.com/?q=Sokolovská+694/98+Praha+Karlín"
            target="_blank"
            className="inline-flex items-center justify-center backdrop-blur-[12px] bg-[#302e2f] border border-[#f0eff0] rounded-[10px] px-[29px] py-[17px] font-clash font-bold text-[20px] text-[#f0eff0] uppercase hover:bg-[#3a3839] transition-colors"
          >
            Navigovat
          </Link>
        </div>
      </PageHero>

      {/* ─── Light bg wrapper ─── */}
      <div className="bg-[#f0eff0]">
        {/* ─── 1. Naše služby (Service Type Cards) ─── */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
            {/* Section header */}
            <div className="text-center mb-6">
              <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
                Naše služby
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[20px] text-[#1a1a1a] leading-[24px] lg:leading-[28px] mt-4">
                Kompletní péče o váš automobil
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
                Mytí pro všechny typy vozidel: osobní auta, SUV, dodávky
              </p>
              <p className="font-clash font-bold text-[14px] lg:text-[17.2px] text-[#7960a9] leading-[24px] lg:leading-[28px]">
                Maximální péče a ochrana vašeho vozidla
              </p>
              <Link
                href="/rezervace/vozidlo"
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-[28px] py-[17px] font-clash font-bold text-[20px] text-[#f0eff0] uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
              >
                Objednat
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
                Naše výhody
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[20px] text-[#1a1a1a] leading-[24px] lg:leading-[28px] mt-4">
                AUTOMYČKA KARLÍN vs ostatní
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
                    Ostatní autopračky
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  {competitorPoints.map((point) => (
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
                    alt="Automyčka Karlín"
                    width={64}
                    height={64}
                    className="size-12 lg:size-16"
                  />
                  <h3 className="font-clash font-bold text-[20px] lg:text-[24px] text-[#7960a9] leading-[32px]">
                    AUTOMYČKA KARLÍN
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  {ourAdvantages.map((point) => (
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

        {/* ─── 3. Before / After Section ─── */}
        {heroImage && (
          <section className="pb-16 lg:pb-24">
            <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
              <div className="relative w-full aspect-[3/2] lg:aspect-[16/7] rounded-[10px] overflow-hidden">
                {/* Before image (left) */}
                <div className="absolute inset-0 w-[55%]">
                  <Image
                    src={heroImage}
                    alt="Před mytím"
                    fill
                    className="object-cover rounded-l-[10px] brightness-75"
                    sizes="(max-width: 1024px) 100vw, 700px"
                  />
                </div>
                {/* After image (right) */}
                <div className="absolute right-0 top-0 bottom-0 w-[55%]">
                  <Image
                    src={heroImage}
                    alt="Po mytí"
                    fill
                    className="object-cover rounded-r-[10px] brightness-110 saturate-110"
                    sizes="(max-width: 1024px) 100vw, 700px"
                  />
                </div>
                {/* DO / PO labels */}
                <div className="absolute left-4 lg:left-[100px] top-1/2 -translate-y-1/2 font-clash font-bold text-[48px] lg:text-[128px] text-white uppercase tracking-[0.35px] leading-none">
                  DO
                </div>
                <div className="absolute right-4 lg:right-[100px] top-1/2 -translate-y-1/2 font-clash font-bold text-[48px] lg:text-[128px] text-white uppercase tracking-[0.35px] leading-none">
                  PO
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── 4. Proč si vybrat AUTOMYČKA KARLÍN ─── */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-[32px]">
            {/* Section header */}
            <div className="text-center mb-6 lg:mb-10">
              <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
                Proč si vybrat AUTOMYČKA KARLÍN
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[20px] text-[#1a1a1a] leading-[24px] lg:leading-[28px] mt-4">
                Naše konkurenční výhody
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
                Perfektní pro každodenní mytí i prémiovou péči o váš vůz
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
                Jak to funguje
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[18.4px] text-[#f0eff0] leading-[24px] lg:leading-[28px] mt-4">
                Jednoduchý proces ve 4 krocích
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
                Objednat
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
                Bezpečnost a zodpovědnost
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[20px] text-[#1a1a1a] leading-[24px] lg:leading-[28px] mt-4">
                Vaše důvěra je naší prioritou
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
                Ceník a faktory ovlivňující cenu
              </h2>
              <p className="font-clash font-medium text-[16px] lg:text-[20px] text-[#1a1a1a] leading-[24px] lg:leading-[28px] mt-4">
                Transparentní cenotvorba
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
                Základní mytí osobního vozu od {formatPrice(service.price)}
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
                      Co je zahrnuto
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
                      Ceník dle kategorie
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
                      Rezervovat termín
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
                Další služby
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {relatedServices.map((rel) => {
                  const relSlug = rel.slug as string;
                  const relImage = IMAGE_MAP[relSlug];
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
                              od
                            </span>
                            <span className="font-clash font-bold text-[18px] lg:text-[29px] text-white">
                              {rel.price != null
                                ? new Intl.NumberFormat("cs-CZ").format(
                                    rel.price
                                  )
                                : ""}
                            </span>
                            <span className="font-clash font-normal text-[14px] lg:text-[18.8px] text-white">
                              Kč
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="p-4 lg:p-6 flex items-center justify-center gap-[15px]">
                        <span className="inline-flex items-center justify-center bg-[#302e2f] border-2 border-[#302e2f] rounded-[10px] h-[40px] lg:h-[47px] px-4 lg:px-6 font-clash font-bold text-[14px] lg:text-[20px] text-white uppercase">
                          Zjistit více
                        </span>
                        <span className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] h-[40px] lg:h-[47px] px-4 lg:px-6 font-clash font-bold text-[14px] lg:text-[20px] text-white uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)]">
                          Rezervace
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ─── 10. "Nenašli jste co hledáte?" CTA ─── */}
        <NotFoundCTA />

        {/* ─── 11. Shared bottom: FAQ, Partners, Blog ─── */}
        <SharedBottomSections wrapInLightBg={false} />
      </div>
    </>
  );
}
