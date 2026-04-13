"use client"

import { useState } from "react"
import clsx from "clsx"
import Image from "next/image"
import type { Achievement } from "../types/achievements.types"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import MiracleModal from "@/components/miracle/Modal"
import { useLocale } from "next-intl"
import { useTranslations } from "use-intl"
import { LuArrowUpRight, LuExternalLink, LuAward, LuCalendar, LuSquareArrowOutUpRight } from "react-icons/lu"
import { formatDate } from "@/utils/format-date"
import MiracleTooltip from "@/components/miracle/Tooltip"
import MiracleBadge, { BadgeColor } from "@/components/miracle/Badge"
import MiracleButton from "@/components/miracle/Button"

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const locale = useLocale()
  const t = useTranslations("components.achievementCard")

  const typeBadgeColor: Record<string, BadgeColor> = {
    "award": "yellow",
    "course": "blue"
  }

  return (
    <>
      <div className="relative flex w-[80vw] max-w-[300px] shrink-0 snap-start flex-col sm:w-auto sm:max-w-none">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="relative group/cert aspect-7/5 w-full overflow-hidden rounded-2xl border border-primary cursor-pointer"
        >
          <Image
            className="object-cover transition-transform duration-300 ease-in-out group-hover/cert:scale-103"
            src={achievement.image}
            alt={achievement.name}
            fill
            sizes="450px"
          />
          
          <div 
            className={clsx(
              "absolute inset-0 flex p-4 items-end",
              "bg-linear-to-b from-transparent to-white dark:to-neutral-950",
              "opacity-0 group-hover/cert:opacity-100 transition-all duration-300 ease-in-out"
            )}
          >

            <p className="flex gap-1 items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-md font-semibold">
              <span>{t("viewDetail")}</span>
              <LuSquareArrowOutUpRight />
            </p>

            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col gap-0.5 transform translate-y-2 transition-transform duration-300 group-hover/card:translate-y-0">
                <p className="text-[10px] uppercase font-light tracking-tight">
                  {t(`type.${achievement.type}`)}
                </p>
                {achievement.categories?.map((category, index) => (
                  <p className="text-xs font-medium tracking-tight" key={index}>
                    {index > 0 && <span className="mr-1 opacity-50"> | </span>}
                    <span>
                      {category}
                    </span>
                  </p>
                ))}
              </div>
              <MiracleTooltip 
                defaultPosition="top-end"
                trigger={
                  <a 
                    href={achievement.credential_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2 rounded-full border-2 border-primary hover:bg-neutral-950/50 dark:hover:bg-white/50 transition-colors duration-300 ease-in-out">
                    <LuArrowUpRight size={18} />
                  </a>
                }>
                {t("viewCredential")}
              </MiracleTooltip>
            </div>
          </div> 
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex gap-2 items-center min-w-0">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              {achievement.organization_logo ? (
                <Image 
                  src={achievement.organization_logo} 
                  alt={achievement.issuing_organization} 
                  fill
                  className="object-contain"
                /> 
              ) : (
                <div className="flex h-full w-full items-center justify-center text-primary-inv bg-blue"><LuAward size={20}/></div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-primary text-md font-semibold tracking-tight line-clamp-1">
                {achievement.name}
              </p>
              <p className="text-secondary text-xs tracking-tight">
                {achievement.issuing_organization}
              </p>
            </div>
          </div>
          <div className="shrink-0 relative z-30">
            <ReactionGroup
              targetId={achievement.id}
              targetType="achievement"
              initialSummary={achievement.reaction_summary}
            />
          </div>
        </div>
      </div>

      {/* --- Detailed Modal Section --- */}
      <MiracleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={achievement.name}
        size="full"
      >
        <div className="flex flex-col lg:flex-row gap-8 p-4">
          
          {/* Left Side: Certificate Preview */}
          <div className="flex-1 w-full relative aspect-[7/5] overflow-hidden rounded-2xl border border-primary">
            <Image
              src={achievement.image}
              alt={achievement.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 65vw"
            />
          </div>

          {/* Right Side */}
          <div className="flex flex-col w-full lg:w-75 shrink-0 gap-8">
            <div className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                {achievement.organization_logo ? (
                  <Image 
                    src={achievement.organization_logo} 
                    alt={achievement.issuing_organization} 
                    fill
                    className="object-contain"
                  /> 
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-low text-primary-inv">
                    <LuAward size={24}/>
                  </div>
                )}
              </div>
              <div>
                <p className="text-primary text-md font-semibold tracking-tight line-clamp-1">
                  {achievement.issuing_organization}
                </p>
                <p className="text-xs uppercase tracking-tight text-secondary">
                  {t(`type.${achievement.type}`)}
                </p>
              </div>
            </div>

            {/* Main Details */}
            <div className="flex flex-col gap-4">
              {achievement.credential_id && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs uppercase tracking-tight text-secondary">
                    {t("label.credentialID")}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {achievement.credential_id}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-1">
                  <p className="text-xs uppercase tracking-tight text-secondary">
                    {t("label.issueDate")}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {formatDate({date: achievement.issue_date, locale})}
                  </p>
                </div>
                
                <div className="flex flex-col gap-1">
                  <p className="text-xs uppercase tracking-tight text-secondary">
                    {t("label.expirationDate")}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    {achievement.expiration_date 
                      ? formatDate({date: achievement.expiration_date, locale})
                      : "-"
                    }
                  </p>
                </div>
              </div>

              {achievement.categories?.length > 0 && (  
                <div className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-tight text-secondary">
                    {t("label.categories")}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {achievement.categories.map((category, index) => (
                      <MiracleBadge variant="secondary">
                        {category}
                      </MiracleBadge>
                    ))}
                  </div>
                </div>
              )} 
            </div>

            <div className="mt-auto">
              <a 
                href={achievement.credential_url}
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full"
              >
                <MiracleButton 
                  fullWidth
                  startIcon={<LuAward/>}
                >
                  {t("viewCredential")}  
                </MiracleButton>
              </a>
            </div>
          </div>
        </div>
      </MiracleModal>
    </>
  )
}