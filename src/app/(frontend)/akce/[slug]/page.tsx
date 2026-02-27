import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { getPromotions, getPromotionBySlug } from "@/lib/payload";
import PageHero from "@/components/shared/PageHero";
import NotFoundCTA from "@/components/shared/NotFoundCTA";
import SharedBottomSections from "@/components/shared/SharedBottomSections";
import { LowerWaveDecoration } from "@/components/home/WaveDecorations";

const formatPrice = (price: number | null | undefined) => {
  if (price == null) return "";
  return `${new Intl.NumberFormat("cs-CZ").format(price)} Kč`;
};

const dateFormatter = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

export async function generateStaticParams() {
  const promotions = await getPromotions();
  return promotions.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const promo = await getPromotionBySlug(slug);
  if (!promo) {
    return { title: "Akce nenalezena" };
  }
  return {
    title: promo.title,
    description: promo.description ?? "",
  };
}

export default async function PromoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const promo = await getPromotionBySlug(slug);

  if (!promo) {
    notFound();
  }

  const originalPriceStr = formatPrice(promo.originalPrice);
  const discountedPriceStr = formatPrice(promo.discountedPrice);
  const validUntilStr = promo.validTo
    ? dateFormatter.format(new Date(promo.validTo))
    : "Stálá nabídka";

  // Extract terms from the array field
  const terms: string[] =
    (promo.terms as { term: string }[] | undefined)?.map((t) => t.term) ?? [];

  // Extract included items from the array field
  const includes: string[] =
    (promo.includedItems as { item: string }[] | undefined)?.map(
      (i) => i.item
    ) ?? [];

  // Extract full description from richText (Lexical JSON)
  const contentRoot = (promo.content as any)?.root?.children;
  const fullDescription = contentRoot
    ? contentRoot
        .map((node: any) =>
          (node.children ?? []).map((c: any) => c.text ?? "").join("")
        )
        .filter((t: string) => t.length > 0)
        .join(" ")
    : promo.description ?? "";

  // Image URL
  const imageUrl =
    typeof promo.image === "object" && promo.image !== null
      ? (promo.image as any).url ?? null
      : null;

  // Related promotions
  const allPromos = await getPromotions();
  const relatedPromos = allPromos.filter((p) => p.slug !== slug).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Speciální akce"
        subtitle="Využijte naše exkluzivní nabídky"
        backLink={{ href: "/akce", label: "Zpět na akce" }}
      />

      {/* Light sections */}
      <div className="relative bg-[#f0eff0] overflow-hidden">
        <LowerWaveDecoration />

        <div className="relative z-[1]">
          {/* Promo detail card */}
          <section className="pt-[48px] lg:pt-[64px] pb-[32px]">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-[32px]">
              <div className="bg-white rounded-[16px] overflow-hidden border border-[#b1b3b6]/20 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.05)]">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Left: Image */}
                  <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px] bg-gradient-to-br from-[#302e2f] to-[#302e2f]/80 overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={promo.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-clash text-[14px] font-medium text-[#b1b3b6]">
                          Foto
                        </span>
                      </div>
                    )}
                    {promo.badge && (
                      <span className="absolute top-[16px] left-[16px] font-clash text-[12px] font-bold text-[#f0eff0] bg-[#7960a9] rounded-[10px] px-[16px] py-[8px] uppercase tracking-wide">
                        {promo.badge}
                      </span>
                    )}
                  </div>

                  {/* Right: Details */}
                  <div className="p-[24px] lg:p-[40px] flex flex-col">
                    {/* Title */}
                    <h2 className="font-clash text-[28px] lg:text-[36px] font-bold text-[#302e2f] leading-tight">
                      {promo.title}
                    </h2>

                    {/* Subtitle / description */}
                    <p className="font-clash text-[14px] lg:text-[16px] font-medium text-[#302e2f]/60 mt-[8px] leading-relaxed">
                      {promo.description ?? ""}
                    </p>

                    {/* Validity date */}
                    <div className="flex items-center gap-[8px] mt-[16px]">
                      <Calendar className="size-[16px] text-[#b1b3b6]" />
                      <span className="font-clash text-[14px] font-medium text-[#b1b3b6]">
                        Platná do {validUntilStr}
                      </span>
                    </div>

                    {/* Long description */}
                    {fullDescription && fullDescription !== promo.description && (
                      <p className="font-clash text-[14px] font-medium text-[#302e2f]/70 leading-relaxed mt-[16px]">
                        {fullDescription}
                      </p>
                    )}

                    {/* Spacer */}
                    <div className="flex-1 min-h-[16px]" />

                    {/* Price box */}
                    <div className="bg-[#302e2f] rounded-[12px] p-[24px] mt-[16px]">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-[4px]">
                          <span className="font-clash text-[36px] lg:text-[42px] font-bold text-[#f0eff0] leading-none">
                            {discountedPriceStr.replace(" Kč", "")}
                          </span>
                          <span className="font-clash text-[18px] lg:text-[20px] font-medium text-[#f0eff0]/80 leading-none">
                            Kč
                          </span>
                        </div>
                        {originalPriceStr && (
                          <span className="font-clash text-[18px] lg:text-[20px] font-medium text-[#b1b3b6] line-through">
                            {originalPriceStr}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reserve button */}
                    <Link
                      href="/rezervace/vozidlo"
                      className="inline-flex items-center justify-center gap-[8px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[16px] rounded-[12px] px-[32px] py-[16px] hover:opacity-90 transition-opacity w-full mt-[16px]"
                    >
                      Rezervovat na tuto akci
                      <ArrowRight className="size-[18px]" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Included items and Terms - two columns below */}
              {(includes.length > 0 || terms.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] mt-[32px]">
                  {includes.length > 0 && (
                    <div className="bg-white rounded-[16px] p-[24px] lg:p-[32px] border border-[#b1b3b6]/20 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.05)]">
                      <h3 className="font-clash text-[20px] lg:text-[22px] font-bold text-[#302e2f] mb-[20px] flex items-center gap-[12px]">
                        <span className="w-[32px] h-[3px] bg-[#7960a9] rounded-full" />
                        Co je zahrnuto
                      </h3>
                      <ul className="space-y-[16px]">
                        {includes.map((item) => (
                          <li key={item} className="flex items-start gap-[12px]">
                            <div className="mt-[2px] flex items-center justify-center size-[20px] rounded-full bg-[#7960a9]/10 shrink-0">
                              <Check className="size-[12px] text-[#7960a9]" />
                            </div>
                            <span className="font-clash text-[14px] lg:text-[15px] font-medium text-[#302e2f]/80 leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {terms.length > 0 && (
                    <div className="bg-white rounded-[16px] p-[24px] lg:p-[32px] border border-[#b1b3b6]/20 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.05)]">
                      <h3 className="font-clash text-[20px] lg:text-[22px] font-bold text-[#302e2f] mb-[20px] flex items-center gap-[12px]">
                        <span className="w-[32px] h-[3px] bg-[#7960a9] rounded-full" />
                        Podmínky akce
                      </h3>
                      <ul className="space-y-[16px]">
                        {terms.map((term) => (
                          <li key={term} className="flex items-start gap-[12px]">
                            <div className="mt-[2px] flex items-center justify-center size-[20px] rounded-full bg-[#7960a9]/10 shrink-0">
                              <Check className="size-[12px] text-[#7960a9]" />
                            </div>
                            <span className="font-clash text-[14px] lg:text-[15px] font-medium text-[#302e2f]/80 leading-relaxed">
                              {term}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* "Nenašli jste co hledáte?" CTA */}
          <NotFoundCTA />

          {/* Related promotions */}
          {relatedPromos.length > 0 && (
            <section className="py-[48px]">
              <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
                <div className="flex items-center justify-between mb-[32px]">
                  <h2 className="font-clash font-bold text-[28px] lg:text-[36px] text-[#302e2f]">
                    Další akce
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
                  {relatedPromos.map((p) => {
                    const pImageUrl =
                      typeof p.image === "object" && p.image !== null
                        ? (p.image as any).url ?? null
                        : null;

                    return (
                      <Link
                        key={p.slug}
                        href={`/akce/${p.slug}`}
                        className="bg-white rounded-[16px] overflow-hidden border border-[#b1b3b6]/20 hover:shadow-lg transition-shadow group flex flex-col shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.05)]"
                      >
                        {/* Image */}
                        <div className="relative aspect-[16/10] bg-gradient-to-br from-[#302e2f] to-[#302e2f]/80 overflow-hidden">
                          {pImageUrl ? (
                            <Image
                              src={pImageUrl}
                              alt={p.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="font-clash text-[14px] font-medium text-[#b1b3b6]">
                                Foto
                              </span>
                            </div>
                          )}
                          {/* Title overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-[16px]">
                            <span className="font-clash text-[14px] font-bold text-[#f0eff0] uppercase leading-tight">
                              {p.title}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-[16px] lg:p-[20px] flex flex-col flex-1">
                          <p className="font-clash text-[13px] font-medium text-[#302e2f]/60 leading-relaxed mb-[16px] flex-1 line-clamp-3">
                            {p.description ?? ""}
                          </p>

                          {/* Price */}
                          <div className="flex items-baseline gap-[8px] mb-[16px]">
                            <span className="font-clash text-[24px] font-bold text-[#7960a9]">
                              {formatPrice(p.discountedPrice)}
                            </span>
                            {p.originalPrice && (
                              <span className="font-clash text-[14px] font-medium text-[#b1b3b6] line-through">
                                {formatPrice(p.originalPrice)}
                              </span>
                            )}
                          </div>

                          {/* Validity */}
                          {p.validTo && (
                            <p className="font-clash text-[12px] font-medium text-[#b1b3b6] mb-[16px]">
                              Platná do {dateFormatter.format(new Date(p.validTo))}
                            </p>
                          )}

                          {/* Buttons */}
                          <div className="flex gap-[8px]">
                            <span className="inline-flex items-center font-clash text-[12px] font-bold text-[#f0eff0] bg-[#7960a9] rounded-[10px] px-[16px] py-[10px] uppercase">
                              Zobrazit detail
                            </span>
                            <span className="inline-flex items-center font-clash text-[12px] font-bold text-[#302e2f] border border-[#302e2f] rounded-[10px] px-[16px] py-[10px] group-hover:bg-[#302e2f] group-hover:text-[#f0eff0] transition-colors uppercase">
                              Rezervace
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Shared bottom: FAQ, Partners, Blog */}
          <SharedBottomSections wrapInLightBg={false} />
        </div>
      </div>
    </>
  );
}
