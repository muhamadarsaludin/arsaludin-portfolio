"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { Achievement, AchievementLevel, AchievementType } from "../types/achievements.types"
import MiracleModal from "@/components/miracle/Modal"
import MiracleBadge, { BadgeColor } from "@/components/miracle/Badge"
import MiracleButton from "@/components/miracle/Button"
import { useLocale } from "next-intl"
import { useTranslations } from "use-intl"
import { formatDate } from "@/utils/format-date"
import { LuAward, LuCrown, LuMinus, LuPlus } from "react-icons/lu"

type AchievementModalProps = {
  isOpen: boolean
  onClose: () => void
  achievement: Achievement
}

export default function AchievementModal({ isOpen, onClose, achievement }: AchievementModalProps) {
  const [zoomScale, setZoomScale] = useState(1)
  const locale = useLocale()
  const t = useTranslations("components.achievementCard")
  const td = useTranslations("data.achievement")

  const typeBadgeColor: Record<AchievementType, BadgeColor> = {
    award: "yellow",
    course: "blue"
  }

  const levelBadgeColor: Record<AchievementLevel, BadgeColor> = {
    expert: "yellow",
    intermediate: "blue",
    beginner: "green"
  }

  // Reset the image zoom scale factor back to original bounds on modal close
  useEffect(() => {
    if (!isOpen) setZoomScale(1)
  }, [isOpen])

  return (
    <MiracleModal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      title={t("modal.title")}
      className="max-h-[85vh] h-full"
      noContentPadding
    >
      <div className="flex h-full w-full flex-col md:flex-row overflow-hidden bg-primary rounded-b-3xl"> 
        
        {/* --- LEFT SIDE: SINGLE CERTIFICATE IMAGE WINDOW --- */}
        <div className="w-full h-full flex flex-col overflow-hidden">
          <div className="flex-1 flex w-full p-5 md:p-6 overflow-hidden relative group/preview">
            <div className="h-full w-full flex items-center justify-center overflow-hidden bg-secondary rounded-2xl">
              <div 
                className="relative h-full w-full transition-transform duration-200 ease-out"
                style={{ transform: `scale(${zoomScale})` }}
              >
                <Image
                  src={achievement.image}
                  alt={achievement.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 950px"
                  priority
                />
              </div>
            </div>
            
            {/* Floating Zoom Controls Context Menu */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full p-0.5 bg-neutral-low text-primary border border-primary opacity-0 group-hover/preview:opacity-100 transition-all duration-300 ease-in-out">
              <button 
                onClick={() => setZoomScale(prev => Math.max(prev - 0.5, 1))} 
                className="p-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full cursor-zoom-out transition-colors duration-300"
              >
                <LuMinus size={16} />
              </button>
              <span className="text-[10px] font-mono min-w-8.75 text-center">{Math.round(zoomScale * 100)}%</span>
              <button 
                onClick={() => setZoomScale(prev => Math.min(prev + 0.5, 3))} 
                className="p-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full cursor-zoom-in transition-colors duration-300"
              >
                <LuPlus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: SPECIFIC CREDENTIAL METADATA PANEL --- */}
        <div className="w-full md:w-87.5 h-fit md:h-full border-t md:border-t-0 md:border-l border-primary p-5 md:p-6 flex flex-col gap-5 md:gap-6 bg-primary shrink-0 items-start">
          {/* Issuing Organization Brand Block */}
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-primary/10">
              {achievement.organization_logo ? (
                <Image 
                  src={achievement.organization_logo} 
                  alt={achievement.issuing_organization} 
                  fill
                  sizes="40px"
                  className="object-contain"
                /> 
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-low text-primary-inv">
                  <LuAward size={24}/>
                </div>
              )}
            </div>
            <p className="text-primary text-md font-semibold tracking-tight line-clamp-1">
              {achievement.issuing_organization}
            </p>
          </div>

          {/* Core Credentials Specifications Table/Grid */}
          <div className="flex flex-col gap-4 w-full border-y border-primary py-5 md:py-6">
            {achievement.credential_id && (
              <div className="flex flex-col gap-1.5">
                <p className="text-xs uppercase tracking-tight text-secondary">{t("label.credentialID")}</p>
                <p className="text-sm text-primary font-medium select-all">{achievement.credential_id}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 items-start">
                <p className="text-xs uppercase tracking-tight text-secondary">{t("label.type")}</p>
                <MiracleBadge color={typeBadgeColor[achievement.type]} variant="secondary">
                  {td("types." + achievement.type)}
                </MiracleBadge>
              </div>
              <div className="flex flex-col gap-1 items-start">
                <p className="text-xs uppercase tracking-tight text-secondary">{t("label.level")}</p>
                {achievement.level ? (
                  <MiracleBadge 
                    color={levelBadgeColor[achievement.level]} 
                    variant="secondary" 
                    startIcon={achievement.level === "expert" ? (<LuCrown />) : undefined}
                  >
                    {td("levels." + achievement.level)}
                  </MiracleBadge>
                ) : (
                  <p className="text-sm text-primary font-medium">-</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-tight text-secondary">{t("label.issueDate")}</p>
                <p className="text-sm text-primary font-medium">
                  {formatDate({date: achievement.issue_date, locale})}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-tight text-secondary">{t("label.expirationDate")}</p>
                <p className="text-sm text-primary font-medium">
                  {achievement.expiration_date 
                    ? formatDate({date: achievement.expiration_date, locale})
                    : "-"
                  }
                </p>
              </div>
            </div>

            {/* Categorization Badges Container */}
            {achievement.categories?.length > 0 && (  
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-tight text-secondary">{t("label.categories")}</p>
                <div className="flex flex-wrap gap-1">
                  {achievement.categories.map((category, idx) => (
                    <MiracleBadge variant="secondary" key={`ach-cat-${idx}`}>
                      {category.name}
                    </MiracleBadge>
                  ))}
                </div>
              </div>
            )} 
          </div>

          {/* External Verification Anchor Trigger */}
          <div className="mt-auto w-full">
            <a 
              href={achievement.credential_url}
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full"
            >
              <MiracleButton fullWidth startIcon={<LuAward/>}>
                {t("viewCredential")}  
              </MiracleButton>
            </a>
          </div>
        </div>
      </div>
    </MiracleModal>
  )
}