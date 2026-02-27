import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "sedan",
    name: "Hatchback / Sedan",
    description: "Osobní vozy, kombi, kupé",
    image: "/images/vehicle-hatchback.png",
    mobileImage: "/images/vehicle-hatchback-mobile.png",
    price: 985,
  },
  {
    id: "suv",
    name: "SUV",
    description: "Crossovery a sportovně-užitková vozidla",
    image: "/images/vehicle-suv-1.png",
    mobileImage: "/images/vehicle-suv-mobile.png",
    price: 1085,
  },
  {
    id: "g-class",
    name: "G-Class / V-Class / Pickup",
    description: "Velká SUV, dodávky, MPV, pickupy",
    image: "/images/vehicle-gclass-1.png",
    mobileImage: "/images/vehicle-gclass-mobile.png",
    price: 1085,
  },
  {
    id: "motocykly",
    name: "Motocykly",
    description: "Silniční, enduro, skútry",
    image: "/images/vehicle-moto-1.png",
    mobileImage: "/images/vehicle-moto-mobile.png",
    price: 985,
  },
];

export default function VehicleStepPage() {
  return (
    <section className="py-8 lg:py-12">
      <div className="max-w-[1536px] mx-auto px-4 lg:px-[32px]">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-6 lg:mb-[30px] gap-3 lg:gap-4">
          <div>
            <h2 className="font-clash font-bold text-[28px] lg:text-[48px] text-[#302e2f] leading-[34px] lg:leading-[48px]">
              Naše služby
            </h2>
            <p className="font-clash font-medium text-[14px] lg:text-[36px] text-[#302e2f] leading-[22px] lg:leading-normal mt-1">
              Vyberte si program pro vaše vozidlo
            </p>
          </div>
          <Link
            href="/sluzby"
            className="inline-flex items-center gap-2 bg-[#302e2f] text-[#f0eff0] font-clash font-medium text-[12px] lg:text-[14.6px] leading-[24px] rounded-[10px] px-5 lg:px-6 py-2.5 lg:py-3 hover:opacity-90 transition-opacity self-start lg:self-auto"
          >
            <span>Všechny služby</span>
            <ArrowRight className="size-[16px] lg:size-[18px]" />
          </Link>
        </div>

        {/* Vehicle category cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[24px]">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/rezervace/program?vehicle=${cat.id}`}
              className="group relative rounded-[10px] overflow-hidden border border-[#b1b3b6] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-[2px] bg-[#f0eff0] h-[241px] lg:h-[480px] flex flex-col"
            >
              {/* Hover glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[32px] blur-[12px] opacity-0 group-hover:opacity-30 transition-opacity -z-10" />

              {/* Top: Image */}
              <div className="relative flex-1 lg:h-[240px] overflow-hidden">
                {/* Desktop image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover hidden lg:block"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                {/* Mobile image */}
                <Image
                  src={cat.mobileImage}
                  alt={cat.name}
                  fill
                  className="object-cover lg:hidden"
                  sizes="50vw"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-[#302e2f]/40 mix-blend-multiply" />

                {/* Category label */}
                <div className="absolute bottom-0 left-0 right-0 px-4 lg:px-6 pb-4 lg:pb-6">
                  <h3 className="font-clash font-bold text-[13px] lg:text-[14px] text-[#f0eff0] uppercase tracking-[0.35px] leading-[17.5px]">
                    {cat.name}
                  </h3>
                </div>

                {/* Purple gradient overlay on mobile */}
                <div className="lg:hidden absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#7960a9]/60 to-transparent" />
              </div>

              {/* Bottom: Price + CTA */}
              <div className="p-3 lg:p-6 lg:h-[240px] flex flex-col items-center justify-center backdrop-blur-[5px]">
                {/* Mobile price layout */}
                <div className="lg:hidden text-center mb-2">
                  <span className="font-clash font-bold text-[10px] text-[#b1b3b6] uppercase tracking-[0.6px] block mb-0.5">
                    ceny od
                  </span>
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className="font-clash font-bold text-[28px] leading-[28px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] bg-clip-text text-transparent">
                      {cat.price}
                    </span>
                    <span className="font-clash font-bold text-[14px] text-[#7960a9]">
                      Kč
                    </span>
                  </div>
                </div>

                {/* Desktop price layout */}
                <div className="hidden lg:flex flex-col items-center gap-2 flex-1 justify-center">
                  <span className="font-clash font-bold text-[12px] text-[#b1b3b6] uppercase tracking-[0.6px] leading-[16px]">
                    ceny od
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-clash font-bold text-[60px] leading-[60px] bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] bg-clip-text text-transparent">
                      {cat.price}
                    </span>
                    <span className="font-clash font-bold text-[22.9px] leading-[32px] text-[#7960a9]">
                      Kč
                    </span>
                  </div>
                </div>

                {/* CTA button */}
                <div className="w-full bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[11px] lg:text-[14px] uppercase leading-[24px] rounded-[8px] lg:rounded-[10px] py-2 lg:py-[14px] text-center hover:opacity-90 transition-opacity">
                  Zvolit program
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
