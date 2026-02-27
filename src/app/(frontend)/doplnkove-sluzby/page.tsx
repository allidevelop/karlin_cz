import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getServices } from "@/lib/payload";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";

export const metadata: Metadata = {
  title: "Doplňkové služby",
  description:
    "Doplňkové služby k mytí a detailingu. Čištění kůže, keramický coating, leštění laku a další.",
};

/* ── Image mapping for addon services ── */
const IMAGE_MAP: Record<string, string> = {
  "exterior-komplet": "/images/service-exterior.jpg",
  "interior-komplet": "/images/service-interior.jpg",
  "to-go": "/images/service-togo.jpg",
  "to-glow": "/images/service-toglow.jpg",
  "to-wow": "/images/service-towow.jpg",
  "premium-detailing": "/images/service-premium.jpg",
};

/* ── Hardcoded addon services per Figma design ── */
interface AddonService {
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  image: string;
  slug: string;
}

interface AddonCategory {
  name: string;
  services: AddonService[];
}

const ADDON_CATEGORIES: AddonCategory[] = [
  {
    name: "Interiér",
    services: [
      {
        name: "Odstranění vodního kamene z oken",
        subtitle: "(1 sklo)",
        description:
          "Profesionální čištění skel od usazenin a zbytků tvrdé vody",
        price: 485,
        image: "/images/service-interior.jpg",
        slug: "odstraneni-vodniho-kamene",
      },
      {
        name: "Tekuté stěrače",
        subtitle: "(čelní sklo)",
        description:
          "Hydrofobní vrstva pro lepší odvod vody a vyšší bezpečnost",
        price: 785,
        image: "/images/service-toglow.jpg",
        slug: "tekute-sterace-celni",
      },
      {
        name: "Tekuté stěrače",
        subtitle: "(celé vozidlo)",
        description:
          "Ochranný film na všech sklech, zajišťuje samočištění vodou",
        price: 2485,
        image: "/images/service-towow.jpg",
        slug: "tekute-sterace-cele",
      },
    ],
  },
  {
    name: "Skla",
    services: [
      {
        name: "Odstranění vodního kamene z oken",
        subtitle: "(1 sklo)",
        description:
          "Profesionální čištění skel od usazenin a zbytků tvrdé vody",
        price: 485,
        image: "/images/service-interior.jpg",
        slug: "odstraneni-vodniho-kamene-skla",
      },
      {
        name: "Tekuté stěrače",
        subtitle: "(čelní sklo)",
        description:
          "Hydrofobní vrstva pro lepší odvod vody a vyšší bezpečnost",
        price: 785,
        image: "/images/service-toglow.jpg",
        slug: "tekute-sterace-celni-skla",
      },
      {
        name: "Tekuté stěrače",
        subtitle: "(celé vozidlo)",
        description:
          "Ochranný film na všech sklech, zajišťuje samočištění vodou",
        price: 2485,
        image: "/images/service-towow.jpg",
        slug: "tekute-sterace-cele-skla",
      },
    ],
  },
  {
    name: "Lak & Exteriér",
    services: [
      {
        name: "Odstranění vodního kamene z oken",
        subtitle: "(1 sklo)",
        description:
          "Profesionální čištění skel od usazenin a zbytků tvrdé vody",
        price: 485,
        image: "/images/service-exterior.jpg",
        slug: "odstraneni-vodniho-kamene-lak",
      },
      {
        name: "Tekuté stěrače",
        subtitle: "(čelní sklo)",
        description:
          "Hydrofobní vrstva pro lepší odvod vody a vyšší bezpečnost",
        price: 785,
        image: "/images/service-toglow.jpg",
        slug: "tekute-sterace-celni-lak",
      },
      {
        name: "Tekuté stěrače",
        subtitle: "(celé vozidlo)",
        description:
          "Ochranný film na všech sklech, zajišťuje samočištění vodou",
        price: 2485,
        image: "/images/service-towow.jpg",
        slug: "tekute-sterace-cele-lak",
      },
    ],
  },
];

export default async function DoplnkoveSluzbPage() {
  // Try to load addon services from CMS; fall back to hardcoded Figma data
  let addonCategories = ADDON_CATEGORIES;

  try {
    const allServices = await getServices();

    // Group services by category for addon display
    const grouped = new Map<string, { catName: string; services: AddonService[] }>();

    for (const service of allServices) {
      const cat = service.category as any;
      const catName =
        cat && typeof cat === "object" ? (cat.name as string) : null;
      const catSlug =
        cat && typeof cat === "object" ? (cat.slug as string) : null;

      if (!catName || !catSlug) continue;

      if (!grouped.has(catSlug)) {
        grouped.set(catSlug, { catName, services: [] });
      }

      const slug = service.slug as string;
      const imageSrc = IMAGE_MAP[slug] || "/images/service-interior.jpg";

      grouped.get(catSlug)!.services.push({
        name: service.name ?? "",
        subtitle: (service.subtitle as string) ?? undefined,
        description: (service.description as string) ?? "",
        price: service.price ?? 0,
        image: imageSrc,
        slug: slug,
      });
    }

    if (grouped.size > 0) {
      addonCategories = Array.from(grouped.values()).map((g) => ({
        name: g.catName,
        services: g.services,
      }));
    }
  } catch {
    // Use hardcoded fallback
  }

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Doplňkové služby"
        subtitle="Rozšiřte péči o váš vůz s našimi službami"
      />

      {/* Light bg wrapper */}
      <div className="bg-[#f0eff0]">
        {/* Tab navigation */}
        <section className="pt-[25px] lg:pt-[48px]">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <div className="flex justify-center">
              <div className="inline-flex items-center bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-[9px] overflow-x-auto">
                <Link
                  href="/sluzby"
                  className="font-clash text-[14px] font-medium text-[#302e2f] rounded-[10px] px-6 py-3 hover:text-[#7960a9] transition-colors whitespace-nowrap"
                >
                  Programy
                </Link>
                <Link
                  href="/kategorie-vozidel"
                  className="font-clash text-[14px] font-medium text-[#302e2f] rounded-[10px] px-6 py-3 hover:text-[#7960a9] transition-colors whitespace-nowrap"
                >
                  Kategorie vozidel
                </Link>
                <Link
                  href="/doplnkove-sluzby"
                  className="font-clash text-[14px] font-medium text-white bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-6 py-3 whitespace-nowrap"
                >
                  Doplňkové služby
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Addon service categories */}
        <section className="pt-[48px] lg:pt-[48px] pb-[40px] lg:pb-[80px]">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <div className="flex flex-col gap-[48px] lg:gap-[64px]">
              {addonCategories.map((category, catIdx) => (
                <div
                  key={catIdx}
                  className="flex flex-col gap-[25px] lg:gap-[32px]"
                >
                  {/* Category heading with purple line */}
                  <div className="flex items-center gap-3">
                    <span className="w-[48px] h-[4px] rounded-full bg-gradient-to-r from-[#7960a9] to-[#9b7ec4]" />
                    <h2 className="font-clash text-[20px] lg:text-[30px] font-bold text-[#302e2f] leading-[28px] lg:leading-[36px]">
                      {category.name}
                    </h2>
                  </div>

                  {/* Service cards grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-[16px] lg:gap-[100px]">
                    {category.services.map((service, svcIdx) => (
                      <div key={svcIdx} className="flex flex-col">
                        {/* Card */}
                        <div className="bg-[#f0eff0] border border-[#b1b3b6] rounded-[10px] overflow-hidden flex flex-col h-full">
                          {/* Image area */}
                          <div className="relative h-[200px] lg:h-[256px]">
                            <Image
                              src={service.image}
                              alt={service.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 50vw, 33vw"
                            />
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-[#302e2f]/50" />

                            {/* Service name overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 flex flex-col items-center gap-1 lg:gap-2">
                              <h3 className="font-clash font-bold text-[13px] lg:text-[24px] text-white text-center leading-[18px] lg:leading-[30px]">
                                {service.name}
                              </h3>
                              {service.subtitle && (
                                <p className="font-clash font-medium text-[8px] lg:text-[20px] text-white text-center leading-[12px] lg:leading-[20px]">
                                  {service.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Content area */}
                          <div className="flex flex-col flex-1 p-[10px] lg:p-6 gap-[10px] lg:gap-4">
                            {/* Description */}
                            <p className="font-clash font-medium text-[8px] lg:text-[16px] text-[#302e2f] text-center leading-normal">
                              {service.description}
                            </p>

                            {/* Price */}
                            <div className="flex items-baseline justify-center gap-2 border-b border-[#f0eff0] pb-1 lg:pb-4">
                              <span className="font-clash font-bold text-[20px] lg:text-[32px] text-[#7960a9] leading-[36px] lg:leading-[40px]">
                                {new Intl.NumberFormat("cs-CZ").format(
                                  service.price
                                )}
                              </span>
                              <span className="font-clash font-medium text-[12px] lg:text-[18px] text-[#b1b3b6] leading-[28px]">
                                Kč
                              </span>
                            </div>

                            {/* Buttons - desktop */}
                            <div className="hidden lg:flex items-center justify-center gap-[15px]">
                              <Link
                                href={`/sluzby/${service.slug}`}
                                className="inline-flex items-center justify-center bg-[#302e2f] border-2 border-[#302e2f] rounded-[10px] h-[47px] w-[180px] font-clash font-bold text-[20px] text-white uppercase hover:bg-[#302e2f]/90 transition-colors backdrop-blur-[12px]"
                              >
                                Zjistit více
                              </Link>
                              <Link
                                href="/rezervace/vozidlo"
                                className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] h-[47px] w-[180px] font-clash font-bold text-[20px] text-white uppercase shadow-[0px_25px_50px_-12px_rgba(155,126,196,0.5)] hover:opacity-90 transition-opacity"
                              >
                                Rezervace
                              </Link>
                            </div>

                            {/* Rating placeholder - desktop */}
                            <div className="hidden lg:flex items-center justify-center gap-2">
                              <span className="font-clash text-[12px] font-medium text-[#b1b3b6]">
                                Hodnocení
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Mobile bottom buttons */}
              <div className="grid grid-cols-2 gap-4 px-0 lg:hidden">
                <Link
                  href="/sluzby"
                  className="flex items-center justify-center bg-[#302e2f] rounded-[10px] px-8 py-4 font-clash font-bold text-[16px] text-white uppercase"
                >
                  Zjistit více
                </Link>
                <Link
                  href="/rezervace/vozidlo"
                  className="flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] px-8 py-4 font-clash font-bold text-[16px] text-white uppercase"
                >
                  Rezervace
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* "Nenasli jste co hledate?" CTA */}
        <NotFoundCTA />

        {/* Shared bottom: FAQ, Partners, Blog */}
        <SharedBottomSections wrapInLightBg={false} />
      </div>
    </>
  );
}
