"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TimeGroup {
  label: string
  times: string[]
}

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  groups: TimeGroup[]
  placeholder?: string
  className?: string
}

export function TimePicker({
  value,
  onChange,
  groups,
  placeholder = "Vyberte čas",
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (time: string) => {
    onChange(time)
    setOpen(false)
  }

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
          <Clock className="size-5 text-[#302e2f]/50 shrink-0" />
          <span className="flex-1">{value || placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-3" align="start">
        <div className="space-y-3">
          {groups.map((group) =>
            group.times.length > 0 ? (
              <div key={group.label}>
                <p className="font-clash text-[11px] font-bold text-[#302e2f]/50 uppercase tracking-wider mb-1.5">
                  {group.label}
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {group.times.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleSelect(time)}
                      className={cn(
                        "font-clash text-[14px] font-medium rounded-md px-2 py-2 transition-colors text-center cursor-pointer",
                        value === time
                          ? "bg-[#7960a9] text-white font-bold"
                          : "text-[#302e2f] hover:bg-[#7960a9]/10 hover:text-[#7960a9]"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
