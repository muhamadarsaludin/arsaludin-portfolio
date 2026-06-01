"use client"

import { useStats } from "@/features/stats/hooks/useStats"
import { cn } from "@/utils/class-name"
import { useTranslations } from "next-intl"
import CountUp from "react-countup"

type ProfileStatsProps = {
  className?: string
}

export default function ProfileStats({ className }: ProfileStatsProps) {
  const td = useTranslations("data.stats")
  const { data: stats, isLoading, isError } = useStats()
  const renderValue = (value: number | undefined, hasSuffix = false) => {
    if (isLoading) return <span className="animate-pulse text-sm">...</span>
    if (isError) return <span>0</span>

    return (
      <CountUp
        end={value ?? 0}
        duration={2.5}
        delay={1}
        preserveValue // 2. Optimasi UX: Mencegah angka ke-reset berhitung dari 0 saat terjadi background re-fetch
        suffix={hasSuffix ? "+" : ""} // 3. Gantikan logic state + CSS opacity lu dengan fitur bawaan CountUp
      />
    )
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="border-separate border-spacing-0 lg:ml-auto">
        <thead>
          <tr>
            {["experience", "services", "projects", "achievements", "articles"].map((key) => (
              <th key={key} className="text-secondary min-w-20 p-1 text-center text-sm font-normal">
                {td(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* Jauh lebih bersih karena tinggal panggil fungsi helper */}
            <td className="min-w-20 p-1 text-center text-xl font-medium md:text-2xl lg:text-3xl">
              {renderValue(stats?.experience, true)}
            </td>
            <td className="min-w-20 p-1 text-center text-xl font-medium md:text-2xl lg:text-3xl">
              {renderValue(stats?.services)}
            </td>
            <td className="min-w-20 p-1 text-center text-xl font-medium md:text-2xl lg:text-3xl">
              {renderValue(stats?.projects)}
            </td>
            <td className="min-w-20 p-1 text-center text-xl font-medium md:text-2xl lg:text-3xl">
              {renderValue(stats?.achievements)}
            </td>
            <td className="min-w-20 p-1 text-center text-xl font-medium md:text-2xl lg:text-3xl">
              {renderValue(stats?.articles)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
