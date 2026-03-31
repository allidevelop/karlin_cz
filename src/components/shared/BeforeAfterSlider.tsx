"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel: string
  afterLabel: string
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setPosition(percent)
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/2] lg:aspect-[16/7] rounded-[10px] overflow-hidden cursor-ew-resize select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* After image (full background) */}
      <Image
        src={afterImage}
        alt={afterLabel}
        fill
        className="object-cover brightness-110 saturate-110"
        sizes="(max-width: 1024px) 100vw, 1280px"
        draggable={false}
      />

      {/* Before image (clipped — image is full-size, only the clip changes) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt={beforeLabel}
          fill
          className="object-cover brightness-75"
          sizes="(max-width: 1024px) 100vw, 1280px"
          draggable={false}
        />
      </div>

      {/* Labels */}
      <div className="absolute left-4 lg:left-[100px] top-1/2 -translate-y-1/2 font-clash font-bold text-[48px] lg:text-[128px] text-white uppercase tracking-[0.35px] leading-none pointer-events-none">
        {beforeLabel}
      </div>
      <div className="absolute right-4 lg:right-[100px] top-1/2 -translate-y-1/2 font-clash font-bold text-[48px] lg:text-[128px] text-white uppercase tracking-[0.35px] leading-none pointer-events-none">
        {afterLabel}
      </div>

      {/* Slider line + handle */}
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-white/90 pointer-events-none"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#302e2f]"
          >
            <path
              d="M8 5L3 12L8 19M16 5L21 12L16 19"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
