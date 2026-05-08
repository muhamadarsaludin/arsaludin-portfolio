"use client"
import { useStats } from "@/features/stats/hooks/useStats"
import clsx from "clsx"
import { useTranslations } from "next-intl"
import { useState } from "react"
import CountUp from "react-countup"

type ProfileStatsProps = {
  className?: string
}

export default function ProfileStats({ className }: ProfileStatsProps) {
  const td = useTranslations("data.stats")
  const [isFinished, setIsFinished] = useState(false)
  const { data: stats, isLoading, isError, refetch } = useStats()

  const renderValue = (value: number | undefined) => {
    if (isLoading) return <span className="animate-pulse text-sm">...</span>
    if (isError) return <span>0</span>
    return <CountUp end={value ?? 0} duration={2.5} delay={1} />
  }

  return (
    <div className={clsx("w-full overflow-x-auto", className)}>
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
            {/* Experience dengan logic Plus (+) */}
            <td className="min-w-20 p-1 text-center text-xl font-medium md:text-2xl lg:text-3xl">
              {isLoading ? (
                 <span className="animate-pulse text-sm">...</span>
              ) : isError ? (
                <span>0</span>
              ) : (
                <>
                  <CountUp 
                    end={stats?.experience ?? 0} 
                    onEnd={() => setIsFinished(true)} 
                    duration={2.5}
                    delay={1}
                  />
                  <span
                    className={clsx(
                      "transition-opacity duration-500",
                      isFinished ? "opacity-100" : "opacity-0"
                    )}
                  >
                    +
                  </span>
                </>
              )}
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
