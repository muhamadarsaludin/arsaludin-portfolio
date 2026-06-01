"use client"

import { useState } from "react"
import Image from "next/image"
import type { Achievement, AchievementLevel, AchievementType } from "../types/achievements.types"
import MiracleModal from "@/components/miracle/Modal"
import type { BadgeColor } from "@/components/miracle/Badge"
import MiracleBadge from "@/components/miracle/Badge"
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
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)

  const locale = useLocale()
  const t = useTranslations("components.achievementCard")
  const td = useTranslations("data.achievement")

  const typeBadgeColor: Record<AchievementType, BadgeColor> = {
    award: "yellow",
    course: "blue",
  }

  const levelBadgeColor: Record<AchievementLevel, BadgeColor> = {
    expert: "yellow",
    intermediate: "blue",
    beginner: "green",
  }

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (!isOpen) {
      setZoomScale(1)
    }
  }

  return (
    <MiracleModal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      title={t("modal.title")}
      className="h-full max-h-[85vh]"
      noContentPadding
    >
      <div className="bg-primary flex h-full w-full flex-col overflow-hidden rounded-b-3xl md:flex-row">
        {/* --- LEFT SIDE: SINGLE CERTIFICATE IMAGE WINDOW --- */}
        <div className="flex h-full w-full flex-col overflow-hidden">
          <div className="group/preview relative flex w-full flex-1 overflow-hidden p-5 md:p-6">
            <div className="bg-secondary flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
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
            <div className="bg-neutral-low text-primary border-primary absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border p-0.5 opacity-0 transition-all duration-300 ease-in-out group-hover/preview:opacity-100">
              <button
                onClick={() => setZoomScale((prev) => Math.max(prev - 0.5, 1))}
                className="cursor-zoom-out rounded-full p-2 transition-colors duration-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              >
                <LuMinus size={16} />
              </button>
              <span className="min-w-8.75 text-center font-mono text-[10px]">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(prev + 0.5, 3))}
                className="cursor-zoom-in rounded-full p-2 transition-colors duration-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
              >
                <LuPlus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: SPECIFIC CREDENTIAL METADATA PANEL --- */}
        <div className="border-primary bg-primary flex h-fit w-full shrink-0 flex-col items-start gap-5 border-t p-5 md:h-full md:w-87.5 md:gap-6 md:border-t-0 md:border-l md:p-6">
          {/* Issuing Organization Brand Block */}
          <div className="flex items-center gap-2">
            <div className="border-primary/10 relative h-10 w-10 overflow-hidden rounded-lg border">
              {achievement.organization_logo ? (
                <Image
                  src={achievement.organization_logo}
                  alt={achievement.issuing_organization}
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              ) : (
                <div className="bg-neutral-low text-primary-inv flex h-full w-full items-center justify-center">
                  <LuAward size={24} />
                </div>
              )}
            </div>
            <p className="text-primary text-md line-clamp-1 font-semibold tracking-tight">
              {achievement.issuing_organization}
            </p>
          </div>

          {/* Core Credentials Specifications Table/Grid */}
          <div className="border-primary flex w-full flex-col gap-4 border-y py-5 md:py-6">
            {achievement.credential_id && (
              <div className="flex flex-col gap-1.5">
                <p className="text-secondary text-xs tracking-tight uppercase">
                  {t("label.credentialID")}
                </p>
                <p className="text-primary text-sm font-medium select-all">
                  {achievement.credential_id}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-start gap-1">
                <p className="text-secondary text-xs tracking-tight uppercase">{t("label.type")}</p>
                <MiracleBadge color={typeBadgeColor[achievement.type]} variant="secondary">
                  {td("types." + achievement.type)}
                </MiracleBadge>
              </div>
              <div className="flex flex-col items-start gap-1">
                <p className="text-secondary text-xs tracking-tight uppercase">
                  {t("label.level")}
                </p>
                {achievement.level ? (
                  <MiracleBadge
                    color={levelBadgeColor[achievement.level]}
                    variant="secondary"
                    startIcon={achievement.level === "expert" ? <LuCrown /> : undefined}
                  >
                    {td("levels." + achievement.level)}
                  </MiracleBadge>
                ) : (
                  <p className="text-primary text-sm font-medium">-</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-secondary text-xs tracking-tight uppercase">
                  {t("label.issueDate")}
                </p>
                <p className="text-primary text-sm font-medium">
                  {formatDate({ date: achievement.issue_date, locale })}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-secondary text-xs tracking-tight uppercase">
                  {t("label.expirationDate")}
                </p>
                <p className="text-primary text-sm font-medium">
                  {achievement.expiration_date
                    ? formatDate({ date: achievement.expiration_date, locale })
                    : "-"}
                </p>
              </div>
            </div>

            {/* Categorization Badges Container */}
            {achievement.categories?.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-secondary text-xs tracking-tight uppercase">
                  {t("label.categories")}
                </p>
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
              <MiracleButton fullWidth startIcon={<LuAward />}>
                {t("viewCredential")}
              </MiracleButton>
            </a>
          </div>
        </div>
      </div>
    </MiracleModal>
  )
}
