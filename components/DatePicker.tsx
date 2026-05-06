"use client"

import { useEffect, useMemo, useState } from "react"

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate()
}

const selectClass =
  "w-full border border-[#a0b8cc] bg-white px-3 h-11 text-base focus:outline-none focus:border-[#205493] cursor-pointer"

interface DatePickerProps {
  value: string
  onChange: (isoDate: string) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const today = new Date()
  const currentYear = today.getFullYear()
  const years = useMemo(() => {
    const list: number[] = []
    for (let y = currentYear; y <= currentYear + 1; y++) {
      list.push(y)
    }
    return list
  }, [currentYear])

  // Parse existing value
  const [month, setMonth] = useState("")
  const [day, setDay] = useState("")
  const [year, setYear] = useState("")

  // Sync from external value (e.g. form reset)
  useEffect(() => {
    if (value && value.includes("-")) {
      const [y, m, d] = value.split("-")
      setYear(y)
      setMonth(m)
      setDay(d)
    }
  }, [value])

  // Calculate available days based on month/year selection
  const daysInMonth = useMemo(() => {
    if (!month || !year) return 31
    return getDaysInMonth(parseInt(month), parseInt(year))
  }, [month, year])

  const days = useMemo(() => {
    const list: string[] = []
    for (let d = 1; d <= daysInMonth; d++) {
      list.push(d.toString().padStart(2, "0"))
    }
    return list
  }, [daysInMonth])

  // Clamp day if month changes and day is out of range
  useEffect(() => {
    if (day && parseInt(day) > daysInMonth) {
      setDay(daysInMonth.toString().padStart(2, "0"))
    }
  }, [daysInMonth, day])

  // Emit combined value when all three are set
  useEffect(() => {
    if (month && day && year) {
      onChange(`${year}-${month}-${day}`)
    } else if (!month && !day && !year) {
      onChange("")
    }
  }, [month, day, year, onChange])

  return (
    <div className="grid grid-cols-3 gap-2">
      <select
        aria-label="Month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className={selectClass}
      >
        <option value="">Month</option>
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Day"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        className={selectClass}
      >
        <option value="">Day</option>
        {days.map((d) => (
          <option key={d} value={d}>
            {parseInt(d)}
          </option>
        ))}
      </select>
      <select
        aria-label="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className={selectClass}
      >
        <option value="">Year</option>
        {years.map((y) => (
          <option key={y} value={y.toString()}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}
