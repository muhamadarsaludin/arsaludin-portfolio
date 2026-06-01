"use client"

import type { InspirationWebsite } from "../types/inspiration-website.types"
import { LuArrowUpRight, LuBriefcaseBusiness, LuMapPin, LuStar } from "react-icons/lu"
import MiracleBadge from "@/components/miracle/Badge"
import { useTranslations } from "next-intl"
import { useMediaQuery } from "@/hooks/useMediaQuery"

type InspirationCardProps = {
  item: InspirationWebsite
  locale: string
}

export default function InspirationCard({ item, locale }: InspirationCardProps) {
  const desc = item.description?.[locale as "en" | "id"] || item.description?.en
  const t = useTranslations("components.inspirationCard")
  const { isMobile } = useMediaQuery()

  return (
    <div className="border-primary group/card relative flex items-start justify-between gap-6 overflow-hidden rounded-2xl border p-5 md:p-6">
      <a
        href={item.link}
        className="absolute inset-0 cursor-pointer rounded-2xl"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("ariaLabel", { website: item.author })}
      />
      <div className="flex flex-col items-start">
        <div className="mb-1 flex items-center gap-3">
          <h3 className="text-primary text-lg font-semibold md:text-xl xl:text-2xl">
            {item.author}
          </h3>
          {item.is_favorite && (
            <MiracleBadge startIcon={<LuStar />} color="yellow" variant="secondary">
              {!isMobile ? t("favorite") : undefined}
            </MiracleBadge>
          )}
        </div>

        <p className="text-secondary flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
          {(item.role || item.company) && (
            <span className="flex items-center gap-1">
              <LuBriefcaseBusiness className="shrink-0" />
              <span>
                {item.role && <span>{item.role}</span>}
                {item.company && (
                  <span>
                    {" "}
                    {t("at")} {item.company}
                  </span>
                )}
              </span>
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <LuMapPin className="shrink-0" />
            {item.location}
          </span>
        </p>

        {desc && (
          <p className="text-secondary border-blue mt-5 border-l-2 py-0.5 pl-2 text-sm leading-relaxed italic md:mt-6">
            {"“"}
            {desc}
            {"”"}
          </p>
        )}
      </div>

      <div className="border-primary relative z-1 hidden cursor-pointer rounded-full border-2 p-2 opacity-0 transition-all duration-300 ease-in-out group-hover/card:opacity-100 hover:bg-neutral-100 md:block dark:hover:bg-neutral-900">
        <LuArrowUpRight size={20} className="text-primary" />
      </div>
    </div>
  )
}
