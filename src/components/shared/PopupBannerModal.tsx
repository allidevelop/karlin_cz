"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface PopupBannerModalProps {
  isActive: boolean;
  delaySeconds: number;
  desktopImageUrl: string | null;
  mobileImageUrl: string | null;
  linkUrl: string | null;
}

const SESSION_KEY = "popup-banner-shown";

export default function PopupBannerModal({
  isActive,
  delaySeconds,
  desktopImageUrl,
  mobileImageUrl,
  linkUrl,
}: PopupBannerModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isActive || (!desktopImageUrl && !mobileImageUrl)) return;

    // Check if already shown this session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, (delaySeconds || 5) * 1000);

    return () => clearTimeout(timer);
  }, [isActive, delaySeconds, desktopImageUrl, mobileImageUrl]);

  if (!isOpen) return null;

  const handleClose = () => setIsOpen(false);

  const imageContent = (
    <>
      {/* Desktop image */}
      {desktopImageUrl && (
        <Image
          src={desktopImageUrl}
          alt="Promo banner"
          width={800}
          height={600}
          className="hidden sm:block w-full h-auto rounded-[10px]"
          priority
        />
      )}
      {/* Mobile image */}
      {(mobileImageUrl || desktopImageUrl) && (
        <Image
          src={mobileImageUrl || desktopImageUrl!}
          alt="Promo banner"
          width={390}
          height={500}
          className="sm:hidden w-full h-auto rounded-[10px]"
          priority
        />
      )}
    </>
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-[#302e2f]/60 backdrop-blur-[8px]" />

      {/* Modal content */}
      <div
        className="relative max-w-[800px] w-full animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-[#302e2f] text-white shadow-lg hover:bg-[#302e2f]/80 transition-colors"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {/* Banner image — clickable if link provided */}
        {linkUrl ? (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            onClick={handleClose}
          >
            {imageContent}
          </a>
        ) : (
          imageContent
        )}
      </div>
    </div>
  );
}
