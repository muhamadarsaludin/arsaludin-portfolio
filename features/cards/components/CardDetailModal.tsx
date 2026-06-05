"use client"

import type { ReactNode } from "react"
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
import type { Reaction, ReactionSummary } from "@/features/reactions/types/reactions.types"

type CardDetailModalProps = {
  isOpen: boolean
  onClose: () => void
  card: Card
  locale: string
  typeIconMap: Record<CardType, ReactNode>
  priorityColorMap: Record<CardPriority, BadgeColor>
  statusColorMap: Record<CardStatus, BadgeColor>
  reactionSummary: ReactionSummary | null
  userReaction: Reaction | null
  cardIds: string[]
  commentCount: number
}

export default function CardDetailModal({
  isOpen,
  onClose,
  card,
  locale,
  typeIconMap,
  priorityColorMap,
  statusColorMap,
  reactionSummary,
  userReaction,
  cardIds,
  commentCount
}: CardDetailModalProps) {
  const t = useTranslations("components.card.item")
  const td = useTranslations("data.roadmap")

  return (
    <MiracleModal isOpen={isOpen} onClose={onClose} title={t("modal.detail.title")} size="md">
      <div className="flex flex-col">
        {/* Top Badge (Slug) */}
        <div className="mb-4 flex items-center gap-2">
          <MiracleBadge
            variant="secondary"
            startIcon={typeIconMap[card.type]}
            className="uppercase"
          >
            {card.slug}
          </MiracleBadge>
        </div>

        {/* Title */}
        <h3 className="text-primary mb-2 text-lg font-semibold md:text-xl lg:text-2xl">
          {card.title}
        </h3>

        {/* Description */}
        <div className="text-secondary text-sm whitespace-pre-wrap">{card.description}</div>

        {/* Metadata Grid */}
        <div className="border-primary mt-6 grid grid-cols-3 gap-y-5 border-t pt-6">
          {/* Author */}
          <div className="col-span-full flex flex-col items-start gap-2">
            <p className="text-secondary text-xs tracking-tight uppercase">
              {t("modal.detail.label.author")}
            </p>
            <div className="flex items-center gap-2">
              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image
                  src={card.author.avatar_url || "/dummy.webp"}
                  alt={card.author.full_name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-primary text-sm font-medium">{card.author.full_name}</p>
            </div>
          </div>

          {/* Date Created*/}
          <div className="col-span-full flex flex-col items-start gap-1.5">
            <p className="text-secondary text-xs tracking-tight uppercase">
              {t("modal.detail.label.date")}
            </p>
            <div className="text-primary flex items-center gap-1.5 text-sm font-medium">
              <LuCalendar size={14} className="text-secondary" />
              {formatDate({ date: card.created_at, locale, dateStyle: "full" })}
            </div>
          </div>

          {/* Type */}
          <div className="flex flex-col items-start gap-1.5">
            <p className="text-secondary text-xs tracking-tight uppercase">
              {t("modal.detail.label.types")}
            </p>
            <MiracleBadge variant="secondary" startIcon={typeIconMap[card.type]} size="sm">
              {td(`types.${card.type}`)}
            </MiracleBadge>
          </div>

          {/* Priority */}
          <div className="flex flex-col items-start gap-1.5">
            <p className="text-secondary text-xs tracking-tight uppercase">
              {t("modal.detail.label.priorities")}
            </p>
            <MiracleBadge variant="secondary" color={priorityColorMap[card.priority]} size="sm">
              {td(`priorities.${card.priority}`)}
            </MiracleBadge>
          </div>

          {/* Status */}
          <div className="flex flex-col items-start gap-1.5">
            <p className="text-secondary text-xs tracking-tight uppercase">Status</p>
            <MiracleBadge
              variant="secondary"
              color={statusColorMap[card.status]}
              startIcon={card.status === "released" ? <LuCircleCheck /> : undefined}
              size="sm"
            >
              {td(`status.${card.status}`)}
            </MiracleBadge>
          </div>
        </div>

        {/* Reactions & Comments Footprint */}
        <div
          className="border-primary mt-5 flex items-center justify-end border-t pt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <ReactionGroup
            targetId={card.id}
            targetIds={cardIds}
            targetType="card"
            reactionSummary={reactionSummary}
            userReaction={userReaction}
          />
          <CommentGroup
            title={card.title}
            targetId={card.id}
            targetIds={cardIds}
            targetType="card"
            commentCount={commentCount}
          />
        </div>
      </div>
    </MiracleModal>
  )
}
