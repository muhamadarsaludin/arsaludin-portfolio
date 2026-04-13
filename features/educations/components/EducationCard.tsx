"use client"

import { useState } from "react"
import Image from "next/image"
import type { Education } from "../types/educations.types"
import clsx from "clsx"
import { formatDate } from "@/utils/format-date"
import { useLocale } from "next-intl"
import { LuCalendar, LuChevronDown, LuMapPin } from "react-icons/lu"
import { IoRibbonSharp } from "react-icons/io5";
import { useTranslations } from "use-intl"
import { MiracleMarkdown } from "@/components/miracle/Markdown"
import MiracleBadge from "@/components/miracle/Badge"

export const EducationCard = ({
  education,
  showDetail = false,
}: {
  education: Education
  showDetail?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(showDetail)
  const locale = useLocale()
  const t = useTranslations("components.educationCard")

  const startDate = formatDate({
    date: education.start_date,
    locale,
    options: { month: "short", year: "numeric" },
  })

  const endDate = education.end_date
    ? formatDate({
        date: education.end_date,
        locale,
        options: { month: "short", year: "numeric" },
      })
    : "Present"

  const [logoSrc, setLogoSrc] = useState(education.logo || "/dummy.webp")

  return (
    <div className="border-primary bg-primary flex flex-col rounded-2xl border p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-3 md:flex-row md:gap-6">
          <div className="relative h-12 w-12 shrink-0 md:h-20 md:w-20">
            <Image
              src={logoSrc}
              alt={education.school}
              fill
              className="object-contain"
              sizes="80px"
              priority={false}
              onError={() => setLogoSrc("/dummy.webp")}
            />
          </div>
          <div className="flex flex-col gap-0.5 items-start">
            <h3 className="text-primary text-lg font-semibold md:text-xl lg:text-2xl">
              {education.school}
            </h3>
            <p className="text-secondary text-md font-medium md:text-lg">
              {education.degree}, {education.field}
            </p>
            <p className="text-secondary flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm md:mt-0">
              <span className="flex items-center gap-0.5">
                <LuCalendar className="shrink-0" />
                {startDate} - {endDate}
              </span>
              <span className="flex items-center gap-0.5">
                <LuMapPin className="shrink-0" />
                {education.location}
              </span>
            </p>
            {education.grade && (
              <MiracleBadge className="mt-2" color="yellow" variant="secondary" startIcon={<IoRibbonSharp />}>
                Grade: {education.grade}
              </MiracleBadge>
            )}
          </div>
        </div>
        {education.description && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            className="cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 focus:outline-none dark:hover:bg-neutral-800"
          >
            <LuChevronDown
              size={20}
              className={clsx(
                "cursor-pointer transition-transform duration-500 ease-in-out",
                isOpen && "rotate-180"
              )}
            />
          </button>
        )}
      </div>
      <div
        className={clsx(
          "transition-max-height duration-500 ease-in-out",
          isOpen ? "max-h-[800px]" : "max-h-0",
          "overflow-hidden"
        )}
      >
        <div className="border-primary mt-5 flex flex-col gap-4 border-t pt-5 sm:mt-6 sm:pt-6">
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase">{t("description")} :</h4>
            <div className="text-secondary flex max-w-full flex-col gap-1.5 pl-4 xl:max-w-11/12">
              {education.description?.map((point, index) => (
                <div key={index} className="flex gap-4">
                  <span className="mt-2.25 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-600 dark:bg-neutral-400" />
                  <MiracleMarkdown content={point} className="" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase">Gallery :</h4>
          </div>
        </div>
      </div>
    </div>
  )
}
