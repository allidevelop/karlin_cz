import { Suspense } from "react";
import { getPrograms, getVehicleCategories } from "@/lib/payload";
import { getTranslations } from "next-intl/server";
import ProgramSelector, { type CMSProgram, type CMSVehicleCategory } from "./program-selector";

export default async function ProgramStepPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const [rawPrograms, rawVehicleCategories] = await Promise.all([
    getPrograms(100, locale),
    getVehicleCategories(),
  ]);

  // Serialize CMS data for client component
  const programs: CMSProgram[] = rawPrograms.map((p) => {
    const imageObj = p.image as { url?: string } | null | undefined;
    const features = (p.features as { feature: string }[] | undefined) ?? [];
    const pricingByVehicle = (
      p.pricingByVehicle as Array<{
        vehicleCategory: { slug?: string; altegioCategoryId?: number } | string | number;
        price: number;
        altegioServiceId?: number;
      }> | undefined
    ) ?? [];

    return {
      id: String(p.id),
      slug: p.slug as string,
      name: p.name ?? "",
      price: p.price ?? 0,
      duration: (p.duration as string) ?? null,
      imageUrl: typeof imageObj === "object" && imageObj?.url ? imageObj.url : null,
      badge: (p as Record<string, unknown>).badge as string | null ?? null,
      features: features.map((f) => f.feature),
      pricingByVehicle: pricingByVehicle.map((pv) => {
        const vc = typeof pv.vehicleCategory === "object" && pv.vehicleCategory !== null
          ? pv.vehicleCategory
          : null;
        return {
          vehicleCategorySlug: vc?.slug ?? "",
          altegioCategoryId: (vc as Record<string, unknown>)?.altegioCategoryId as number | null ?? null,
          price: pv.price,
          altegioServiceId: pv.altegioServiceId ?? null,
        };
      }),
      altegioId: (p.altegioId as number) ?? null,
    };
  });

  const vehicleCategories: CMSVehicleCategory[] = rawVehicleCategories.map((vc) => ({
    id: String(vc.id),
    slug: vc.slug as string,
    name: vc.name ?? "",
    altegioCategoryId: (vc as Record<string, unknown>).altegioCategoryId as number | null ?? null,
  }));

  return (
    <Suspense
      fallback={
        <div className="py-12 lg:py-16 text-center">
          <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
            <p className="font-clash text-[16px] font-medium text-[#302e2f]/70">
              {t("common.loading")}
            </p>
          </div>
        </div>
      }
    >
      <ProgramSelector
        programs={programs}
        vehicleCategories={vehicleCategories}
      />
    </Suspense>
  );
}
