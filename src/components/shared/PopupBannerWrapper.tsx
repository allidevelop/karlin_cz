import { getLocale } from "next-intl/server";
import { getActivePopups } from "@/lib/payload";
import PopupBannerModal from "./PopupBannerModal";

function getMediaUrl(field: unknown): string | null {
  if (typeof field === "object" && field !== null && "url" in field) {
    return (field as { url: string }).url;
  }
  return null;
}

export default async function PopupBannerWrapper() {
  const locale = await getLocale();
  const popups = await getActivePopups(locale);

  if (!popups || popups.length === 0) return null;

  // Use the highest-priority popup
  const popup = popups[0];

  return (
    <PopupBannerModal
      isActive={true}
      delaySeconds={(popup.delaySeconds as number) ?? 5}
      desktopImageUrl={getMediaUrl(popup.image)}
      mobileImageUrl={getMediaUrl(popup.mobileImage)}
      linkUrl={(popup.buttonLink as string) || null}
    />
  );
}
