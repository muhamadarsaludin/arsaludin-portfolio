"use client"

import { useState } from "react"
import Image from "next/image"
import { Education } from "../types/educations.types"
import clsx from "clsx"
import { formatDate } from "@/utils/format-date"
import { useLocale } from "next-intl"
import { LuBriefcaseBusiness, LuCalendar, LuChevronDown, LuMapPin } from "react-icons/lu"
import { useTranslations } from "use-intl"
import { MiracleMarkdown } from "@/components/miracle/Markdown"

export const EducationCard = ({ education, showDetail = false }: { education: Education, showDetail?: boolean}) => {
  const [isOpen, setIsOpen] = useState(showDetail)
  const locale = useLocale()
  const t = useTranslations("components.educationCard")

  const startDate = formatDate({ 
    date: education.start_date, 
    locale, 
    options: { month: 'short', year: 'numeric' } 
  });

  const endDate = education.end_date ? formatDate({ 
    date: education.end_date, 
    locale, 
    options: { month: 'short', year: 'numeric' } 
  }) : 'Present';

  const [logoSrc, setLogoSrc] = useState(education.logo || "/dummy.webp")

  return (
    <div className="border border-primary p-5 sm:p-6 rounded-2xl flex flex-col bg-primary">
      <div className="flex justify-between gap-3 items-start">
        <div className="flex flex-col md:flex-row gap-3 md:gap-6">
          <div className="relative h-12 w-12 md:h-20 md:w-20 shrink-0">
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
          <div className="flex flex-col gap-0.5">
            <h3 className="text-primary font-semibold text-lg md:text-xl lg:text-2xl">
            {education.school}
            </h3>
            <p className="text-secondary text-md md:text-lg font-medium">
              {education.degree}, {education.field}
            </p>
            <p className="text-secondary text-sm flex flex-wrap gap-y-0.5 gap-x-3 items-center md:mt-0">
              <span className="flex items-center gap-0.5"><LuCalendar className="shrink-0"/>{startDate} - {endDate}</span> 
              <span className="flex items-center gap-0.5"><LuMapPin className="shrink-0"/>{education.location}</span> 
            </p>
          </div>
        </div>
        {education.description && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            className="cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 dark:hover:bg-neutral-800 focus:outline-none"
          >
            <LuChevronDown size={20} className={clsx("transition-transform duration-500 ease-in-out cursor-pointer", isOpen && "rotate-180")} />
          </button>
        )}
      </div>
      <div className={clsx(
          "transition-max-height duration-500 ease-in-out",
          isOpen ? "max-h-[800px]" : "max-h-0", "overflow-hidden"
          )}>
        <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-primary flex flex-col gap-4" >
          <div className="flex flex-col gap-3">
            <h4 className="uppercase font-bold text-sm">
              {t("description")} :
            </h4>
            <div className="flex flex-col gap-1.5 text-secondary pl-4 max-w-full xl:max-w-11/12">
              {education.description?.map((point, index) => (
                <div key={index} className="flex gap-4">
                  <span className="mt-2.25 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-600 dark:bg-neutral-400" />
                  <MiracleMarkdown content={point} className=""/>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="uppercase font-bold text-sm">
              Gallery :
            </h4>
          </div>
        </div>
      </div>
    </div>
  )
}