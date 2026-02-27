import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const vehicleCards = [
  {
    id: "sedan",
    name: "Hatchback / Sedan",
    image: "/images/vehicle-hatchback.png",
    price: 985,
    href: "/rezervace/program?vehicle=sedan",
  },
  {
    id: "suv",
    name: "SUV",
    image: "/images/vehicle-suv-1.png",
    price: 1085,
    href: "/rezervace/program?vehicle=suv",
  },
  {
    id: "g-class",
    name: "G-Class / V-Class / Pickup",
    image: "/images/vehicle-gclass-1.png",
    price: 1085,
    href: "/rezervace/program?vehicle=g-class",
  },
  {
    id: "motocykly",
    name: "Motocykly",
    image: "/images/vehicle-moto-1.png",
    price: 985,
    href: "/rezervace/program?vehicle=motocykly",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="pb-[80px]">
      <div className="max-w-[1536px] mx-auto pt-[25px] px-4 lg:px-[32px]">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[30px] gap-4">
          <div>
            <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
              Naše služby
            </h2>
            <p className="font-clash font-normal text-[14.8px] lg:text-[36px] lg:font-medium text-[#302e2f] leading-[24px] lg:leading-normal mt-1">
              Vyberte si program pro vaše vozidlo
            </p>
          </div>
          <Link
            href="/sluzby"
            className="inline-flex items-center gap-2 bg-[#302e2f] border border-[#f0eff0] text-[#f0eff0] font-clash font-medium text-[14.6px] leading-[24px] rounded-[10px] px-6 py-3 hover:opacity-90 transition-opacity self-start lg:self-auto"
          >
            Všechny služby
            <ArrowRight className="size-[18px]" />
          </Link>
        </div>

        {/* Vehicle category cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[25px]">
          {vehicleCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group relative rounded-[10px] overflow-hidden border border-[#b1b3b6] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-[2px] bg-[#f0eff0] h-[241px] lg:h-[480px] flex flex-col"
            >
              {/* Hover glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[32px] blur-[12px] opacity-0 group-hover:opacity-30 transition-opacity -z-10" />

              {/* Top: Image */}
              <div className="relative flex-1 lg:h-[240px] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#302e2f]/40 mix-blend-multiply" />
                {/* Category label */}
                <div className="absolute bottom-0 left-0 right-0 px-4 lg:px-6 pb-4 lg:pb-6">
                  <span className="font-clash font-bold text-[13px] lg:text-[14px] text-[#f0eff0] uppercase tracking-[0.35px] leading-[17.5px]">
                    {card.name}
                  </span>
                </div>
                {/* Purple gradient overlay on mobile */}
                <div className="lg:hidden absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#7960a9] to-transparent" />
              </div>

              {/* Bottom: Price + CTA */}
              <div className="p-4 lg:p-6 lg:h-[240px] flex flex-col items-center justify-center backdrop-blur-[5px]">
                {/* Mobile price layout */}
                <div className="lg:hidden text-center">
                  <span className="font-clash font-normal text-[15px] text-[#302e2f]">od </span>
                  <span className="font-clash font-bold text-[20px] text-[#7960a9]">{card.price}</span>
                  <span className="font-clash font-normal text-[15px] text-[#7960a9]"> Kč</span>
                </div>

                {/* Desktop price layout */}
                <div className="hidden lg:flex flex-col items-center gap-2 flex-1 justify-center">
                  <span className="font-clash font-bold text-[12px] text-[#b1b3b6] uppercase tracking-[0.6px] leading-[16px]">
                    ceny od
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-clash font-bold text-[60px] leading-[60px] text-[#7960a9]">
                      {card.price}
                    </span>
                    <span className="font-clash font-bold text-[22.9px] leading-[32px] text-[#7960a9]">
                      Kč
                    </span>
                  </div>
                </div>

                {/* CTA button (desktop only) */}
                <button className="hidden lg:flex w-full items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] text-[#f0eff0] font-clash font-bold text-[14px] uppercase leading-[24px] rounded-[10px] py-[14px] hover:opacity-90 transition-opacity">
                  Zvolit program
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
