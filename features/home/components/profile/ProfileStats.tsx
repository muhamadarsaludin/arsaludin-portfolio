"use client"
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import CountUp from 'react-countup'

type ProfileStatsProps = {
  className?: string
}

export default function ProfileStats({className}: ProfileStatsProps) {
  const t = useTranslations("pages.home.profile")
  return (
    <div className={clsx("max-w-full overflow-auto", className)}>
      <table className="border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="min-w-20 text-center p-1 font-normal text-sm">{t("experience")}</th>
            <th className="min-w-20 text-center p-1 font-normal text-sm">{t("projects")}</th>
            <th className="min-w-20 text-center p-1 font-normal text-sm">{t("stack")}</th>
            <th className="min-w-20 text-center p-1 font-normal text-sm">{t("certifications")}</th>
            <th className="min-w-20 text-center p-1 font-normal text-sm">{t("blogs")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="min-w-20 text-center p-1 font-medium text-xl md:text-2xl xl:text-3xl">
              <CountUp end={4} /> +
            </td>
            <td className="min-w-20 text-center p-1 font-medium text-xl md:text-2xl xl:text-3xl"><CountUp end={10} /></td>
            <td className="min-w-20 text-center p-1 font-medium text-xl md:text-2xl xl:text-3xl"><CountUp end={12} /></td>
            <td className="min-w-20 text-center p-1 font-medium text-xl md:text-2xl xl:text-3xl"><CountUp end={20} /></td>
            <td className="min-w-20 text-center p-1 font-medium text-xl md:text-2xl xl:text-3xl"><CountUp end={4} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
