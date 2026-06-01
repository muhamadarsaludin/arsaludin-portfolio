"use client"

import { useState } from "react"
import Image from "next/image"
import type { Education } from "../types/educations.types"
import { cn } from "@/utils/class-name"
import { formatDate } from "@/utils/format-date"
import { useLocale } from "next-intl"
import { useTranslations } from "use-intl"
import { MiracleMarkdown } from "@/components/miracle/Markdown"
import MiracleBadge from "@/components/miracle/Badge"
import ModalGallery from "@/features/shared/components/ModalGallery" // Imported global shared component
import { LuCalendar, LuChevronDown, LuMapPin } from "react-icons/lu"
import { IoRibbonSharp } from "react-icons/io5"

export const EducationCard = ({
  education,
  showDetail = false,
}: {
  education: Education
  showDetail?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(showDetail)
  const [shouldRender, setShouldRender] = useState(showDetail)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [logoSrc, setLogoSrc] = useState(education.logo || "/dummy.webp")
  const [prevShowDetail, setPrevShowDetail] = useState(showDetail)

  const locale = useLocale()
  const t = useTranslations("components.educationCard")

  if (showDetail !== prevShowDetail) {
    setPrevShowDetail(showDetail)
    if (showDetail) {
      setIsOpen(true)
      setShouldRender(true)
    }
  }

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

  const handleToggle = () => {
    if (!isOpen) {
      setShouldRender(true)
      requestAnimationFrame(() => setIsOpen(true))
    } else {
      setIsOpen(false)
    }
  }

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setShouldRender(false)
    }
  }

  return (
    <div className="border-primary bg-primary flex flex-col rounded-2xl border p-5 md:p-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-3 md:flex-row md:gap-6">
          <div className="relative h-12 w-12 shrink-0 md:h-20 md:w-20">
            <Image
              src={logoSrc}
              alt={education.school}
              fill
              className="object-contain"
              sizes="80px"
              onError={() => setLogoSrc("/dummy.webp")}
            />
          </div>
          <div className="flex flex-col items-start gap-0.5">
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
              <MiracleBadge
                className="mt-2"
                color="yellow"
                variant="secondary"
                startIcon={<IoRibbonSharp />}
              >
                Grade: {education.grade}
              </MiracleBadge>
            )}
          </div>
        </div>

        {(education.description || (education.images && education.images.length > 0)) && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleToggle()
            }}
            aria-label={isOpen ? t("hide") : t("show")}
            className="cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 focus:outline-none dark:hover:bg-neutral-800"
          >
            <LuChevronDown
              size={20}
              className={cn(
                "cursor-pointer transition-transform duration-500 ease-in-out",
                isOpen && "-rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {/* --- CONTENT SECTION (ACCORDION EFFECT) --- */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className={cn(
          "grid transition-all duration-500 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          {shouldRender && (
            <div className="border-primary mt-5 flex flex-col gap-4 border-t pt-5 sm:mt-6 sm:pt-6">
              {/* ACADEMIC DESCRIPTION / REVIEWS */}
              {education.description && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold uppercase">{t("description")} :</h4>
                  <div className="text-secondary flex max-w-full flex-col gap-1.5 pl-4 xl:max-w-11/12">
                    {education.description.map((point, index) => (
                      <div key={`edu-desc-${index}`} className="flex gap-4">
                        <span className="mt-2.25 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-600 dark:bg-neutral-400" />
                        <MiracleMarkdown content={point} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CERTIFICATE / CAMPUS GALLERY SCROLLER */}
              {education.images && education.images.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold uppercase">{t("gallery")} :</h4>
                  <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {education.images.map((asset, index) => (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedIndex(index)}
                        className="group border-primary relative aspect-3/2 w-[75%] max-w-75 shrink-0 cursor-pointer snap-start overflow-hidden rounded-xl border md:w-[85%]"
                      >
                        <Image
                          src={asset.image_url}
                          alt={asset.alt}
                          fill
                          sizes="(max-width: 768px) 260px, 300px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- INTEGRATED REUSABLE SHARED GALLERY MODAL --- */}
      <ModalGallery
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        title={`${education.school} ${t("gallery")}`}
        images={education.images || []}
        initialIndex={selectedIndex ?? 0}
        metaTitle={selectedIndex !== null ? education.images?.[selectedIndex]?.alt : undefined}
        startDate={startDate}
        endDate={endDate}
        location={education.location}
      />
    </div>
  )
}
