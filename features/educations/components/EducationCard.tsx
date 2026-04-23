"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import type { Education } from "../types/educations.types"
import clsx from "clsx"
import { formatDate } from "@/utils/format-date"
import { useLocale } from "next-intl"
import { LuCalendar, LuChevronDown, LuChevronLeft, LuChevronRight, LuMapPin, LuMinus, LuPlus } from "react-icons/lu"
import { IoRibbonSharp } from "react-icons/io5";
import { useTranslations } from "use-intl"
import { MiracleMarkdown } from "@/components/miracle/Markdown"
import MiracleBadge from "@/components/miracle/Badge"
import MiracleModal from "@/components/miracle/Modal"

export const EducationCard = ({
  education,
  showDetail = false,
}: {
  education: Education
  showDetail?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(showDetail)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [zoomScale, setZoomScale] = useState(1)

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

  const handleNext = useCallback(() => {
    if (selectedIndex !== null && education.images) {
      setZoomScale(1)
      setSelectedIndex((selectedIndex + 1) % education.images.length)
    }
  }, [selectedIndex, education.images])
  
  const handlePrev = useCallback(() => {
    if (selectedIndex !== null && education.images) {
      setZoomScale(1)
      setSelectedIndex(
        (selectedIndex - 1 + education.images.length) % education.images.length
      )
    }
  }, [selectedIndex, education.images])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "Escape") setSelectedIndex(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, handleNext, handlePrev])

  const currentImage = selectedIndex !== null ? education.images?.[selectedIndex] : null

  return (
    <div className="border-primary bg-primary flex flex-col rounded-2xl border p-5 sm:p-6">
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
        {(education.description || education.images) && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            aria-label={isOpen ? t("hide") : t("show")}
            className="cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 focus:outline-none dark:hover:bg-neutral-800"
          >
            <LuChevronDown
              size={20}
              className={clsx(
                "cursor-pointer transition-transform duration-500 ease-in-out",
                isOpen && "-rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {/* --- CONTENT SECTION ---*/}
      <div
        className={clsx(
          "transition-all duration-500 ease-in-out overflow-hidden",
          isOpen ? "max-h-300 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="border-primary mt-5 flex flex-col gap-4 border-t pt-5 sm:mt-6 sm:pt-6">
          {education.description && (
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold uppercase">{t("description")} :</h4>
              <div className="text-secondary flex max-w-full flex-col gap-1.5 pl-4 xl:max-w-11/12">
                {education.description.map((point, index) => (
                  <div key={index} className="flex gap-4">
                    <span className="mt-2.25 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-600 dark:bg-neutral-400" />
                    <MiracleMarkdown content={point} className="" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Gallery */}
          {education.images && education.images.length > 0 && (
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold uppercase">{t("gallery")} :</h4>
              <div className="scrollbar-hide snap-x snap-mandatory overflow-x-auto flex gap-4">
                {education.images.map((asset, index) => (
                  <button 
                    key={asset.id} 
                    onClick={() => setSelectedIndex(index)}
                    className="group relative aspect-3/2 shrink-0 snap-start overflow-hidden rounded-xl border border-primary cursor-pointer w-[75%] md:w-[85%] max-w-75"
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
      </div>

      {/* --- MODAL DETAIL --- */}
      <MiracleModal
        isOpen={selectedIndex !== null}
        onClose={() => { setSelectedIndex(null); setZoomScale(1); }}
        size="full"
        title={`${education.school} ${t("gallery")}`}
        className="max-h-[85vh] h-full"
        noContentPadding
      >
        <div className="flex h-full w-full flex-col md:flex-row overflow-hidden bg-primary rounded-b-3xl"> 
          {/* LEFT SIDE */}
          <div className="w-full h-full flex flex-col overflow-hidden">
            {/* Image Preview */}
            <div className="flex-1 flex w-full p-5 md:p-6 overflow-hidden relative group/preview">
              <div className="h-full w-full flex items-center justify-center overflow-hidden bg-secondary rounded-2xl">
                {currentImage && (
                  <div 
                    className="relative h-full w-full"
                    style={{ transform: `scale(${zoomScale})` }}
                  >
                    <Image
                      src={currentImage.image_url}
                      alt={currentImage.alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 950px"
                    />
                  </div>
                )}
              </div>
              {/* Zoom Controls Overlay */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full p-0.5 bg-neutral-low text-primary border border-primary opacity-0 group-hover/preview:opacity-100 transition-all duration-300 ease-in-out">
                <button 
                  onClick={() => setZoomScale(prev => Math.max(prev - 0.5, 1))} 
                  className="p-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full cursor-zoom-out transition-colors ease-in-out duration-300">
                    <LuMinus size={16} />
                </button>
                <span className="text-[10px] font-mono min-w-8.75 text-center">{Math.round(zoomScale * 100)}%</span>
                <button 
                  onClick={() => setZoomScale(prev => Math.min(prev + 0.5, 3))} 
                  className="p-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full cursor-zoom-in transition-colors ease-in-out duration-300">
                    <LuPlus size={16} />
                </button>
              </div>

              {/* Navigation Arrows */}
              {education.images && education.images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 ease-in-out">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
                    className="cursor-pointer z-20 rounded-full p-2 border border-primary bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all ease-in-out duration-300">
                      <LuChevronLeft size={20} />
                    </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }} 
                    className="cursor-pointer z-20 rounded-full p-2 border border-primary bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all ease-in-out duration-300">
                      <LuChevronRight size={20} />
                    </button>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Bar */}
            {education.images && education.images.length > 1 && (
              <div className="shrink-0 border-t border-primary flex items-center px-5 md:px-6 py-2">
                <div className="scrollbar-hide snap-x snap-mandatory scrollbar-hide flex items-center gap-2 overflow-x-auto min-h-12 md:min-h-20">
                  {education.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => { setZoomScale(1); setSelectedIndex(idx); }}
                      className={clsx(
                        "relative snap-start aspect-3/2 shrink-0 rounded-md overflow-hidden transition-all cursor-pointer",
                        selectedIndex === idx 
                          ? "border-2 border-blue h-12 md:h-20" 
                          : "border border-primary h-10 md:h-18 opacity-50 hover:opacity-100"
                      )}
                    >
                      <Image src={img.image_url} alt={`Thumbnail ${idx}`} fill className="object-cover" sizes="150px" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* RIGHT SIDE */}
          <div className="w-full md:w-75 h-fit md:h-full border-t md:border-t-0 md:border-l border-primary p-5 md:p-6 flex flex-col bg-primary shrink-0">
            <h3 className="md:text-lg font-semibold leading-tight text-primary mb-3 md:mb-6">
              {currentImage?.alt}
            </h3>

            <div className="flex flex-row md:flex-col gap-2 md:gap-4 justify-between items-center md:items-start border-y border-primary py-3 md:py-6">
              <div className="flex items-start gap-3">
                <div className="hidden md:block p-2 rounded-lg bg-neutral-low text-secondary">
                  <LuCalendar size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-tight text-secondary">{t("timelineLabel")}</span>
                  <span className="text-sm font-medium">{startDate} - {endDate}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="hidden md:block p-2 rounded-lg bg-neutral-low text-secondary">
                  <LuMapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-tight text-secondary">{t("locationLabel")}</span>
                  <span className="text-sm font-medium">{education.location}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3 md:pt-6 flex flex-col gap-3 md:gap-4">
              <div className="flex justify-between items-center text-xs">
                {selectedIndex !== null && education.images && (
                  <span className="text-secondary font-medium">
                    {t("imageCounter", { current: selectedIndex + 1, total: education.images.length })}
                  </span>
                )}
                <div className={clsx(
                  "h-1 w-4 rounded-full",
                  zoomScale > 1 ? "bg-blue-500" : "bg-neutral-med"
                )} />
              </div>

              <p className="text-xs italic bg-secondary text-secondary p-3 rounded-lg border border-dashed border-primary leading-relaxed">
                {t("tipLabel")}: {t("tip")}
              </p>
            </div>
          </div>
        </div>
      </MiracleModal>
    </div>
  )
}
