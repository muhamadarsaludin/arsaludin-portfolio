"use client"

import { useState } from "react"
import Image from "next/image"
import { Experience } from "../types/experiences.types"
import clsx from "clsx"
import { formatDate } from "@/utils/format-date"
import { useLocale } from "next-intl"
import { LuBriefcaseBusiness, LuCalendar, LuChevronDown, LuMapPin } from "react-icons/lu"
import { useTranslations } from "use-intl"
import { MiracleMarkdown } from "@/components/miracle/Markdown"

export const ExperienceCard = ({
  experience,
  showDetail = false,
}: {
  experience: Experience
  showDetail?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(showDetail)
  const locale = useLocale()
  const t = useTranslations("components.experienceCard")

  const startDate = formatDate({
    date: experience.start_date,
    locale,
    options: { month: "short", year: "numeric" },
  })

  const endDate = experience.end_date
    ? formatDate({
        date: experience.end_date,
        locale,
        options: { month: "short", year: "numeric" },
      })
    : "Present"

  const [logoSrc, setLogoSrc] = useState(experience.company_logo || "/dummy.webp")

  return (
    <div className="border-primary bg-primary flex flex-col rounded-2xl border p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-3 md:flex-row md:gap-6">
          <div className="border-primary relative h-12 w-12 shrink-0 overflow-hidden rounded-full border md:h-20 md:w-20">
            <Image
              src={logoSrc}
              alt={experience.company}
              fill
              className="object-contain"
              sizes="80px"
              priority={false}
              onError={() => setLogoSrc("/dummy.webp")}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-primary text-lg font-semibold md:text-xl lg:text-2xl">
              {experience.role}
            </h3>
            <p className="text-secondary text-md font-medium md:text-lg">{experience.company}</p>
            <p className="text-secondary flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm md:mt-0">
              <span className="flex items-center gap-0.5">
                <LuCalendar className="shrink-0" />
                {startDate} - {endDate}
              </span>
              <span className="flex items-center gap-0.5">
                <LuMapPin className="shrink-0" />
                {experience.location}
              </span>
              <span className="flex items-center gap-0.5">
                <LuBriefcaseBusiness className="shrink-0" />
                {experience.employment_type}
              </span>
            </p>
          </div>
        </div>
        {experience.key_contributions && (
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
          {/* Key Contributions */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase">{t("keyContributions")} :</h4>
            <div className="text-secondary flex max-w-full flex-col gap-1.5 pl-4 xl:max-w-11/12">
              {experience.key_contributions?.map((point, index) => (
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
