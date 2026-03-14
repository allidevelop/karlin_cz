import { getActivePopups } from '@/lib/payload'
import { getMediaUrl } from '@/lib/payload'
import { getLocale } from 'next-intl/server'
import PopupBanner from './PopupBanner'
import type { PopupItem } from './PopupBanner'

export default async function PopupBannerLoader() {
  const locale = await getLocale()
  const popups = await getActivePopups(locale)

  if (!popups.length) return null

  const items: PopupItem[] = popups.map((p) => ({
    id: String(p.id),
    title: (p.title as string) ?? '',
    imageUrl: getMediaUrl(p.image) ?? '',
    imageWidth: (p.image as { width?: number })?.width ?? 500,
    imageHeight: (p.image as { height?: number })?.height ?? 500,
    buttonText: (p.buttonText as string) ?? null,
    buttonLink: (p.buttonLink as string) ?? null,
    delaySeconds: (p.delaySeconds as number) ?? 5,
    showOnce: (p.showOnce as boolean) ?? true,
  })).filter((item) => item.imageUrl)

  if (!items.length) return null

  return <PopupBanner popups={items} />
}
