"use client"

import { useState, useEffect } from "react"

interface AnimatedSubtitleProps {
  texts: string[]
  className?: string
}

export default function AnimatedSubtitle({ texts, className = "" }: AnimatedSubtitleProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (texts.length <= 1) return

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length)
        setIsVisible(true)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [texts.length])

  return (
    <span
      className={`inline-block transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${className}`}
    >
      {texts[currentIndex]}
    </span>
  )
}
