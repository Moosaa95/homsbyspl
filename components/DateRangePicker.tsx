"use client"

import { useState, useCallback } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  isWithinInterval,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DateRange {
  start: string
  end: string
}

interface Props {
  checkIn: Date | null
  checkOut: Date | null
  onChange: (checkIn: Date | null, checkOut: Date | null) => void
  disabledRanges?: DateRange[]
}

const DAY_NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

export default function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  disabledRanges = [],
}: Props) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const parsedRanges = disabledRanges.map((r) => ({
    start: new Date(r.start),
    end: new Date(r.end),
  }))

  const isDisabled = useCallback(
    (date: Date) => {
      if (isBefore(date, today)) return true
      return parsedRanges.some((range) =>
        isWithinInterval(date, { start: range.start, end: range.end })
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabledRanges]
  )

  const isSelected = (date: Date) =>
    (checkIn && isSameDay(date, checkIn)) ||
    (checkOut && isSameDay(date, checkOut)) ||
    false

  const isInRange = (date: Date) => {
    const end = checkOut ?? hoverDate
    if (!checkIn || !end) return false
    const rangeStart = isBefore(checkIn, end) ? checkIn : end
    const rangeEnd = isBefore(checkIn, end) ? end : checkIn
    return isWithinInterval(date, { start: rangeStart, end: rangeEnd })
  }

  const isRangeStart = (date: Date) => checkIn != null && isSameDay(date, checkIn)
  const isRangeEnd = (date: Date) => checkOut != null && isSameDay(date, checkOut)

  const handleClick = (date: Date) => {
    if (isDisabled(date)) return
    if (!checkIn || (checkIn && checkOut)) {
      onChange(date, null)
    } else {
      if (isSameDay(date, checkIn)) {
        onChange(null, null)
      } else if (isBefore(date, checkIn)) {
        onChange(date, checkIn)
      } else {
        // Check if any disabled dates fall in the range
        const rangeHasDisabled = parsedRanges.some((r) =>
          isWithinInterval(r.start, { start: checkIn, end: date }) ||
          isWithinInterval(r.end, { start: checkIn, end: date })
        )
        if (rangeHasDisabled) {
          onChange(date, null)
        } else {
          onChange(checkIn, date)
        }
      }
    }
  }

  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setViewDate((d) => subMonths(d, 1))}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-gray-800">
          {format(viewDate, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={() => setViewDate((d) => addMonths(d, 1))}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const isCurrentMonth = day.getMonth() === viewDate.getMonth()
          const disabled = isDisabled(day)
          const selected = isSelected(day)
          const inRange = isInRange(day)
          const start = isRangeStart(day)
          const end = isRangeEnd(day)
          const todayDay = isToday(day)

          return (
            <div
              key={i}
              onClick={() => isCurrentMonth && handleClick(day)}
              onMouseEnter={() => {
                if (checkIn && !checkOut && !disabled) setHoverDate(day)
              }}
              onMouseLeave={() => setHoverDate(null)}
              className={`
                relative h-9 flex items-center justify-center text-[13px] transition-all
                ${!isCurrentMonth ? "opacity-20 pointer-events-none" : ""}
                ${disabled && isCurrentMonth ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                ${selected
                  ? "bg-emerald-600 text-white font-semibold z-10"
                  : inRange && !disabled
                  ? "bg-emerald-100 text-emerald-800"
                  : ""}
                ${start ? "rounded-l-full" : ""}
                ${end ? "rounded-r-full" : ""}
                ${selected && !start && !end ? "rounded-full" : ""}
                ${!selected && !inRange && isCurrentMonth && !disabled
                  ? "hover:bg-gray-100 rounded-full"
                  : ""}
                ${todayDay && !selected ? "font-bold text-emerald-600 underline underline-offset-2" : ""}
              `}
            >
              {format(day, "d")}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div
          className={`p-2.5 rounded-xl text-center border text-sm transition-colors ${
            checkIn ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="text-[11px] text-gray-500 mb-0.5">Check-in</div>
          <div className={`font-semibold ${checkIn ? "text-emerald-700" : "text-gray-400"}`}>
            {checkIn ? format(checkIn, "MMM d, yyyy") : "Select"}
          </div>
        </div>
        <div
          className={`p-2.5 rounded-xl text-center border text-sm transition-colors ${
            checkOut ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="text-[11px] text-gray-500 mb-0.5">Check-out</div>
          <div className={`font-semibold ${checkOut ? "text-emerald-700" : "text-gray-400"}`}>
            {checkOut ? format(checkOut, "MMM d, yyyy") : "Select"}
          </div>
        </div>
      </div>
    </div>
  )
}
