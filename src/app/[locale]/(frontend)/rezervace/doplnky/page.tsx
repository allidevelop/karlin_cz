import { getAddons } from "@/lib/payload";
import AddonSelector, { type CMSAddon } from "./addon-selector";

export default async function AddonsStepPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rawAddons = await getAddons(100, locale);

  // Serialize CMS data for client component
  const addons: CMSAddon[] = rawAddons.map((a) => {
    const imageObj = a.image as { url?: string } | null | undefined;
    return {
      id: String(a.altegioId ?? a.id),
      slug: a.slug as string,
      name: a.name ?? "",
      price: a.price ?? 0,
      altegioId: (a.altegioId as number) ?? 0,
      duration: (a.duration as string) ?? null,
      description: (a.description as string) ?? "",
      imageUrl: typeof imageObj === "object" && imageObj?.url ? imageObj.url : null,
      addonCategory: (a as Record<string, unknown>).addonCategory as CMSAddon["addonCategory"] ?? null,
    };
  });

  return <AddonSelector addons={addons} />;
}
