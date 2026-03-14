"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X } from "lucide-react"

export interface PopupItem {
  id: string
  title: string
  imageUrl: string
  imageWidth: number
  imageHeight: number
  buttonText: string | null
  buttonLink: string | null
  delaySeconds: number
  showOnce: boolean
}

interface PopupBannerProps {
  popups: PopupItem[]
}

export default function PopupBanner({ popups }: PopupBannerProps) {
  const [visible, setVisible] = useState(false)
  const [activePopup, setActivePopup] = useState<PopupItem | null>(null)

  useEffect(() => {
    // Find the first popup that hasn't been dismissed
    const popup = popups.find((p) => {
      if (p.showOnce) {
        const seen = localStorage.getItem(`popup-seen-${p.id}`)
        if (seen) return false
      }
      return true
    })

    if (!popup) return

    setActivePopup(popup)

    const timer = setTimeout(() => {
      setVisible(true)
    }, popup.delaySeconds * 1000)

    return () => clearTimeout(timer)
  }, [popups])

  const close = useCallback(() => {
    if (activePopup?.showOnce) {
      localStorage.setItem(`popup-seen-${activePopup.id}`, "1")
    }
    setVisible(false)
  }, [activePopup])

  const handleButtonClick = useCallback(async () => {
    if (!activePopup) return
    // Track click
    try {
      await fetch(`/api/popup-click?id=${activePopup.id}`, { method: "POST" })
    } catch {
      // Silently fail
    }
    if (activePopup.buttonLink) {
      window.open(activePopup.buttonLink, "_blank", "noopener,noreferrer")
    }
    close()
  }, [activePopup, close])

  if (!visible || !activePopup) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 animate-in fade-in duration-300"
      onClick={close}
    >
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#302e2f] hover:bg-[#302e2f]/80 transition-colors border border-white/20"
        >
          <X className="size-4 text-white" />
        </button>

        {/* Image */}
        <div className="rounded-xl overflow-hidden">
          <Image
            src={activePopup.imageUrl}
            alt={activePopup.title}
            width={activePopup.imageWidth}
            height={activePopup.imageHeight}
            className="max-w-[90vw] max-h-[70vh] w-auto h-auto object-contain"
          />
        </div>

        {/* CTA Button */}
        {activePopup.buttonText && (
          <button
            type="button"
            onClick={handleButtonClick}
            className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-white font-medium text-lg hover:opacity-90 transition-opacity"
          >
            {activePopup.buttonText}
          </button>
        )}
      </div>
    </div>
  )
}
