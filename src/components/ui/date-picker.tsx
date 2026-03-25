"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cs, enUS, ru } from "react-day-picker/locale"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const localeMap: Record<string, typeof cs> = { cs, en: enUS, ru }

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  minDate?: string
  locale?: string
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  minDate,
  locale = "cs",
  placeholder = "Vyberte datum",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const selected = value ? new Date(value + "T00:00:00") : undefined
  const disabled = minDate ? { before: new Date(minDate + "T00:00:00") } : undefined

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      const yyyy = day.getFullYear()
      const mm = String(day.getMonth() + 1).padStart(2, "0")
      const dd = String(day.getDate()).padStart(2, "0")
      onChange(`${yyyy}-${mm}-${dd}`)
      setOpen(false)
    }
  }

  const displayDate = selected
    ? selected.toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center gap-3 bg-white border border-[#b1b3b6]/50 rounded-[10px] px-4 py-3.5 font-clash text-[16px] text-[#302e2f] hover:border-[#7960a9] focus:outline-none focus:border-[#7960a9] transition-colors text-left cursor-pointer",
            !value && "text-[#b1b3b6]",
            className
          )}
        >
          <CalendarIcon className="size-5 text-[#302e2f]/50 shrink-0" />
          <span className="flex-1">{displayDate || placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          disabled={disabled}
          defaultMonth={selected || (minDate ? new Date(minDate + "T00:00:00") : undefined)}
          locale={localeMap[locale] || cs}
        />
      </PopoverContent>
    </Popover>
  )
}
