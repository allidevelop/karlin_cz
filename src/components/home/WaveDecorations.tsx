/**
 * Decorative wave/ribbon background for light sections.
 *
 * Uses the actual purple wave PNG (/images/wave-bg.png) from the design,
 * displayed at 20% opacity, full-width, single image (no repeats).
 */

import Image from "next/image";

/* ────────────────────────────────────────────────────────────
   Upper light section decoration
   Contains: Services, Promotions, Express Wash
   ──────────────────────────────────────────────────────────── */

export function UpperWaveDecoration() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <Image
        src="/images/wave-bg.png"
        alt=""
        fill
        className="object-cover opacity-20"
        priority={false}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Lower light section decoration
   Contains: Contact, FAQ, Partners, Blog
   ──────────────────────────────────────────────────────────── */

export function LowerWaveDecoration() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <Image
        src="/images/wave-bg.png"
        alt=""
        fill
        className="object-cover opacity-20"
        priority={false}
      />
    </div>
  );
}
