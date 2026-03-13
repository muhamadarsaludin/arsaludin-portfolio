"use client"
import { useTranslations } from 'next-intl'
import CountUp from 'react-countup'

export default function ProfileStats() {
  const t = useTranslations("pages.home.profile")
  return (
    <div className="max-w-full w-full overflow-x-auto overflow-y-hidden flex flex-col gap-8">
      <table className="w-full border-separate border-spacing-0">
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
            <td className="min-w-20 text-center p-1 font-medium text-3xl"><CountUp end={4} />+</td>
            <td className="min-w-20 text-center p-1 font-medium text-3xl"><CountUp end={10} /></td>
            <td className="min-w-20 text-center p-1 font-medium text-3xl"><CountUp end={12} /></td>
            <td className="min-w-20 text-center p-1 font-medium text-3xl"><CountUp end={20} /></td>
            <td className="min-w-20 text-center p-1 font-medium text-3xl"><CountUp end={4} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
