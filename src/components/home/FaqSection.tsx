"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  items: Array<{ question: string; answer: string; id: string | number }>;
};

export default function FaqSection({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section id="faq" className="pt-[25px] pb-[25px]">
      <div className="max-w-[1024px] mx-auto px-4 lg:px-[32px]">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] rounded-[10px] flex items-center justify-center">
            <HelpCircle className="size-7 text-[#f0eff0]" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-clash font-bold text-[30px] lg:text-[48px] text-[#302e2f] leading-[36px] lg:leading-[48px]">
            Často kladené otázky
          </h2>
          <p className="font-clash font-medium text-[15.5px] lg:text-[20px] text-[#302e2f] leading-[24px] lg:leading-[28px] mt-2">
            Odpovědi na nejčastější dotazy o našich službách
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              value={`item-${item.id}`}
              className="bg-[#f0eff0] border-2 border-[#b1b3b6] rounded-[10px] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              <AccordionTrigger className="font-clash font-bold text-[15px] lg:text-[17px] leading-[24px] lg:leading-[28px] text-[#302e2f] hover:no-underline px-6 py-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-clash font-medium text-[13.3px] lg:text-[15.4px] leading-[22.75px] lg:leading-[24px] text-[#302e2f] px-6 pb-5">
                <div className="border-t border-[#302e2f] pt-4">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA box */}
        <div className="mt-12 bg-[rgba(240,239,240,0.5)] border-2 border-[#b1b3b6] rounded-[10px] p-8 text-center">
          <p className="font-clash font-bold text-[15.4px] leading-[24px] text-[#302e2f] mb-4">
            Nenašli jste odpověď na svou otázku?
          </p>
          <Link
            href="#contact"
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#7960a9] to-[#9b7ec4] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1)] text-[#f0eff0] font-clash font-bold text-[15.1px] uppercase rounded-[13px] px-8 py-3 hover:opacity-90 transition-opacity"
          >
            Kontaktujte nás
          </Link>
        </div>
      </div>
    </section>
  );
}
