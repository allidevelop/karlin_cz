import type { Metadata } from "next";
import Image from "next/image";
import { getPromotions } from "@/lib/payload";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";
import PromoCarousel from "@/components/akce/PromoCarousel";

export const metadata: Metadata = {
  title: "Speciální akce",
  description:
    "Využijte naše exkluzivní nabídky a ušetřete na prémiových službách péče o váš vůz.",
};

export default async function AkcePage() {
  const promotions = await getPromotions();

  /* Map CMS promotions to the shape PromoCarousel expects */
  const promoItems = promotions.map((promo) => {
    /* Resolve the image URL from the Payload media relation */
    let imageUrl: string | null = null;
    if (promo.image && typeof promo.image === "object" && "url" in promo.image) {
      imageUrl = (promo.image as { url?: string }).url ?? null;
    }

    return {
      title: promo.title,
      slug: promo.slug as string,
      description: promo.description as string | null | undefined,
      discountedPrice: promo.discountedPrice as number | null | undefined,
      originalPrice: promo.originalPrice as number | null | undefined,
      badge: promo.badge as string | null | undefined,
      validTo: promo.validTo as string | null | undefined,
      imageUrl,
    };
  });

  return (
    <>
      {/* Hero — dark bg matching Figma node 1:6910 */}
      <PageHero
        title="Speciální akce"
        subtitle="Využijte naše exkluzivní nabídky"
      />

      {/* Light bg wrapper — promotions + NotFoundCTA + shared sections */}
      <div className="relative bg-[#f0eff0] overflow-hidden">
        {/* Background wave decoration at 40% opacity, per Figma */}
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
          {/* Promo cards carousel / grid */}
          <PromoCarousel promotions={promoItems} />

          {/* "Nenašli jste co hledáte?" CTA */}
          <NotFoundCTA />

          {/* Shared bottom: FAQ, Partners, Blog */}
          <SharedBottomSections wrapInLightBg={false} />
        </div>
      </div>
    </>
  );
}
