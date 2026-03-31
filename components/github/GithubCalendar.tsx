"use client"
import React from "react"

type ContributionDay = {
  date: string
  count: number
}

type Props = {
  data: ContributionDay[]
  colorScheme?: "green" | "blue"
}

export default function GithubCalendar({ data, colorScheme = "green" }: Props) {
  const getColor = (count: number) => {
    if (colorScheme === "green") {
      if (count === 0) return "bg-gray-800"
      if (count <= 2) return "bg-green-200"
      if (count <= 5) return "bg-green-400"
      if (count <= 10) return "bg-green-600"
      return "bg-green-800"
    } else {
      if (count === 0) return "bg-gray-800"
      if (count <= 2) return "bg-blue-200"
      if (count <= 5) return "bg-blue-400"
      if (count <= 10) return "bg-blue-600"
      return "bg-blue-800"
    }
  }

  const parseDate = (dateStr: string) => new Date(dateStr)

  // Group per minggu
  const weeks: ContributionDay[][] = []
  data.forEach((day, idx) => {
    const weekIndex = Math.floor(idx / 7)
    if (!weeks[weekIndex]) weeks[weekIndex] = []
    weeks[weekIndex].push(day)
  })

  // Tentukan bulan pertama tiap minggu
  const monthsMap: { [key: number]: string } = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  }

  const monthLabels: (string | null)[] = []
  let lastMonth = -1
  weeks.forEach((week) => {
    const firstDay = parseDate(week[0].date)
    const month = firstDay.getMonth()
    if (month !== lastMonth) {
      monthLabels.push(monthsMap[month]) // tampilkan nama bulan
      lastMonth = month
    } else {
      monthLabels.push("") // kosong kalau masih bulan sama
    }
  })

  // Hari di kiri (Mon, Wed, Fri)
  const dayLabels = ["Mon", "Wed", "Fri"]

  return (
    <div className="flex flex-col text-xs text-gray-300">
      {/* Label bulan */}
      <div className="mb-1 ml-10 flex space-x-[2px]">
        {monthLabels.map((m, idx) => (
          <span key={idx} className="w-[10px] text-center">
            {m}
          </span>
        ))}
      </div>

      <div className="flex">
        {/* Label hari */}
        <div className="mr-1 flex h-[70px] flex-col justify-between">
          {dayLabels.map((d, idx) => (
            <span key={idx} className="text-[10px]">
              {d}
            </span>
          ))}
        </div>

        {/* Kalender */}
        <div className="flex space-x-[2px] overflow-x-auto">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col space-y-[2px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`h-[10px] w-[10px] ${getColor(day.count)} rounded-sm`}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center space-x-1 text-[10px]">
        <span>Less</span>
        <div className="flex space-x-[2px]">
          <div className={`h-[10px] w-[10px] rounded-sm bg-gray-800`} />
          <div className={`h-[10px] w-[10px] ${getColor(2)} rounded-sm`} />
          <div className={`h-[10px] w-[10px] ${getColor(5)} rounded-sm`} />
          <div className={`h-[10px] w-[10px] ${getColor(10)} rounded-sm`} />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
