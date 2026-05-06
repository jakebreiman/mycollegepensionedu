"use client"

import { useMemo } from "react"

const selectClass =
  "w-full border border-[#a0b8cc] bg-white px-3 h-11 text-base focus:outline-none focus:border-[#205493] cursor-pointer"

function getNext7Days(): { value: string; label: string }[] {
  const days: { value: string; label: string }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

    const label =
      i === 0
        ? `Today — ${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
        : i === 1
          ? `Tomorrow — ${date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
          : date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

    days.push({ value: iso, label })
  }

  return days
}

interface DatePickerProps {
  value: string
  onChange: (isoDate: string) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const options = useMemo(() => getNext7Days(), [])

  return (
    <select
      aria-label="Meeting Date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={selectClass}
    >
      <option value="">Select a Date</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
