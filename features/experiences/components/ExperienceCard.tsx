"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { Experience } from "../types/experiences.types"
import clsx from "clsx"
import { formatDate } from "@/utils/format-date"
import { useLocale } from "next-intl"
import { useTranslations } from "use-intl"
import { MiracleMarkdown } from "@/components/miracle/Markdown"
import ModalGallery from "@/features/shared/components/ModalGallery"
import { 
  LuBriefcaseBusiness, 
  LuCalendar, 
  LuChevronDown, 
  LuMapPin
} from "react-icons/lu"

export const ExperienceCard = ({
  experience,
  showDetail = false,
}: {
  experience: Experience
  showDetail?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(showDetail)
  const [shouldRender, setShouldRender] = useState(showDetail)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [logoSrc, setLogoSrc] = useState(experience.company_logo || "/dummy.webp")
  
  const locale = useLocale()
  const t = useTranslations("components.experienceCard")

  useEffect(() => {
    if (showDetail) {
      setIsOpen(true)
      setShouldRender(true)
    }
  }, [showDetail])

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

  const handleToggle = () => {
    if (!isOpen) {
      setShouldRender(true)
      // Beri micro-tick delay agar browser sempat mendaftarkan element sebelum animasi dimulai
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
          <div className="border-primary relative h-12 w-12 shrink-0 overflow-hidden rounded-full border md:h-20 md:w-20">
            <Image
              src={logoSrc}
              alt={experience.company}
              fill
              className="object-cover"
              sizes="80px"
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

        {(experience.key_contributions || (experience.images && experience.images.length > 0)) && (
          <button
            onClick={handleToggle}
            className="cursor-pointer rounded-md p-2 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
            aria-label={isOpen ? t("hide") : t("show")}
          >
            <LuChevronDown
              size={20}
              className={clsx("transition-transform duration-500", isOpen && "-rotate-180")}
            />
          </button>
        )}
      </div>

      {/* --- CONTENT SECTION --- */}
      <div 
        onTransitionEnd={handleTransitionEnd} 
        className={clsx(
          "grid transition-all duration-500 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          {shouldRender && (
            <div className="border-primary mt-5 flex flex-col gap-5 md:gap-6 border-t pt-5 md:mt-6 md:pt-6">
              {/* KEY CONTRIBUTIONS */}
              {experience.key_contributions && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold uppercase">{t("keyContributions")} :</h4>
                  <div className="text-secondary flex max-w-full flex-col gap-1.5 pl-4">
                    {experience.key_contributions.map((point, index) => (
                      <div key={`contrib-${index}`} className="flex gap-4">
                        <span className="mt-2.25 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-600 dark:bg-neutral-400" />
                        <MiracleMarkdown content={point} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GALLERY SCROLLER */}
              {experience.images && experience.images.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold uppercase">{t("gallery")} :</h4>
                  <div className="scrollbar-hide snap-x snap-mandatory overflow-x-auto flex gap-4 [&::-webkit-scrollbar]:hidden">
                    {experience.images.map((asset, index) => (
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
          )}
        </div>
      </div>

      {/* --- INTEGRASI SHARED GALLERY MODAL --- */}
      {selectedIndex !== null && (
        <ModalGallery
          isOpen={selectedIndex !== null}
          onClose={() => setSelectedIndex(null)}
          title={`${experience.company} ${t("gallery")}`}
          images={experience.images || []}
          initialIndex={selectedIndex ?? 0}
          metaTitle={selectedIndex !== null ? experience.images?.[selectedIndex]?.alt : undefined}
          startDate={startDate}
          endDate={endDate}
          location={experience.location}
        />
      )}
    </div>
  )
}