"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "font-clash text-[15px] font-bold text-[#302e2f]",
        nav: "flex items-center gap-1",
        button_previous: "absolute left-1 top-0 inline-flex items-center justify-center size-8 rounded-full border border-[#b1b3b6]/50 text-[#302e2f] hover:bg-[#7960a9]/10 hover:border-[#7960a9] hover:text-[#7960a9] transition-colors",
        button_next: "absolute right-1 top-0 inline-flex items-center justify-center size-8 rounded-full border border-[#b1b3b6]/50 text-[#302e2f] hover:bg-[#7960a9]/10 hover:border-[#7960a9] hover:text-[#7960a9] transition-colors",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-[#302e2f]/50 font-clash text-[12px] font-medium w-9 text-center",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center font-clash text-[14px] focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#7960a9]/10 [&:has([aria-selected])]:rounded-md",
        day_button: "inline-flex items-center justify-center size-9 rounded-md font-clash text-[14px] font-medium text-[#302e2f] hover:bg-[#7960a9]/10 hover:text-[#7960a9] transition-colors cursor-pointer",
        selected: "[&>.rdp-day_button]:bg-[#7960a9] [&>.rdp-day_button]:text-white [&>.rdp-day_button]:hover:bg-[#7960a9]/90 [&>.rdp-day_button]:hover:text-white [&>.rdp-day_button]:font-bold",
        today: "[&>.rdp-day_button]:border [&>.rdp-day_button]:border-[#7960a9] [&>.rdp-day_button]:text-[#7960a9] [&>.rdp-day_button]:font-bold",
        outside: "[&>.rdp-day_button]:text-[#b1b3b6] [&>.rdp-day_button]:hover:text-[#302e2f]",
        disabled: "[&>.rdp-day_button]:text-[#b1b3b6]/40 [&>.rdp-day_button]:cursor-not-allowed [&>.rdp-day_button]:hover:bg-transparent",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
