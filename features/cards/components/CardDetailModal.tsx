"use client"

import type { ReactNode } from "react"
import React from "react"
import type { Card, CardPriority, CardStatus, CardType } from "@/features/cards/types/cards.types"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { LuCalendar, LuCircleCheck } from "react-icons/lu"
import { formatDate } from "@/utils/format-date"
import type { BadgeColor } from "@/components/miracle/Badge"
import MiracleBadge from "@/components/miracle/Badge"
import MiracleModal from "@/components/miracle/Modal"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import CommentGroup from "@/features/comments/components/CommentGroup"

type CardDetailModalProps = {
  isOpen: boolean
  onClose: () => void
  card: Card
  locale: string
  typeIconMap: Record<CardType, ReactNode>
  priorityColorMap: Record<CardPriority, BadgeColor>
  statusColorMap: Record<CardStatus, BadgeColor>
}

export default function CardDetailModal({
  isOpen,
  onClose,
  card,
  locale,
  typeIconMap,
  priorityColorMap,
  statusColorMap
}: CardDetailModalProps) {
  const t = useTranslations("components.card.item")
  const td = useTranslations("data.roadmap")

  return (
    <MiracleModal isOpen={isOpen} onClose={onClose} title={t("modal.detail.title")} size="md">
      <div className="flex flex-col">
        {/* Top Badge (Slug) */}
        <div className="flex items-center gap-2 mb-4">
          <MiracleBadge variant="secondary" startIcon={typeIconMap[card.type]} className="uppercase">
            {card.slug}
          </MiracleBadge>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-primary mb-2">
          {card.title}
        </h3>

        {/* Description */}
        <div className="text-secondary text-sm whitespace-pre-wrap">
          {card.description}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-3 gap-y-5 border-t border-primary pt-6 mt-6">
          {/* Author */}
          <div className="flex flex-col gap-2 items-start col-span-full">
            <p className="text-xs uppercase tracking-tight text-secondary">
              {t("modal.detail.label.author")}
            </p>
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image 
                  src={card.author.avatar_url || "/dummy.webp"} 
                  alt={card.author.full_name} 
                  fill 
                  className="object-cover" 
                />
              </div>
              <p className="text-sm text-primary font-medium">
                {card.author.full_name}
              </p>
            </div>
          </div>

          {/* Date Created*/}
          <div className="flex flex-col gap-1.5 items-start col-span-full">
            <p className="text-xs uppercase tracking-tight text-secondary">
              {t("modal.detail.label.date")}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-primary font-medium">
              <LuCalendar size={14} className="text-secondary" />
              {formatDate({ date: card.created_at, locale, dateStyle: "full" })}
            </div>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5 items-start">
            <p className="text-xs uppercase tracking-tight text-secondary">
              {t("modal.detail.label.types")}
            </p>
            <MiracleBadge variant="secondary" startIcon={typeIconMap[card.type]} size="sm">
              {td(`types.${card.type}`)}
            </MiracleBadge>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1.5 items-start">
            <p className="text-xs uppercase tracking-tight text-secondary">
              {t("modal.detail.label.priorities")}
            </p>
            <MiracleBadge variant="secondary" color={priorityColorMap[card.priority]} size="sm">
              {td(`priorities.${card.priority}`)}
            </MiracleBadge>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5 items-start">
            <p className="text-xs uppercase tracking-tight text-secondary">
              Status
            </p>
            <MiracleBadge variant="secondary" color={statusColorMap[card.status]} startIcon={card.status === "released" ? (<LuCircleCheck />) : undefined} size="sm">
              {td(`status.${card.status}`)}
            </MiracleBadge>
          </div>
        </div>

        {/* Reactions & Comments Footprint */}
        <div className="flex items-center justify-end mt-5 pt-2 border-t border-primary" onClick={(e) => e.stopPropagation()}>
          <ReactionGroup targetId={card.id} targetType="card" initialSummary={card.reaction_summary} />
          <CommentGroup targetId={card.id} targetType="card" initialCount={card.comment_count} />
        </div>
      </div>
    </MiracleModal>
  )
}