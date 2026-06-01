"use client"

import type { ReactNode} from "react"
import React, { useState, useMemo } from "react"
import type { Card, CardPriority, CardStatus, CardType } from "@/features/cards/types/cards.types"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { cn } from "@/utils/class-name"
import { useAuth } from "@/providers/AuthProvider"
import { LuCalendar, LuEllipsis, LuPencil, LuTrash2, LuRocket, LuBug, LuGauge, LuFilePen } from "react-icons/lu"
import { formatDate } from "@/utils/format-date"
import type { BadgeColor } from "@/components/miracle/Badge"
import MiracleBadge from "@/components/miracle/Badge"
import { getInitials } from "@/utils/initials"
import MiracleTooltip from "@/components/miracle/Tooltip"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import CommentGroup from "@/features/comments/components/CommentGroup"
import MiraclePopover from "@/components/miracle/Popover"
import MiracleButton from "@/components/miracle/Button"
import { useCardsMutation } from "@/features/cards/hooks/useCardMutation"
import CardDetailModal from "./CardDetailModal"
import CardDeleteModal from "./CardDeleteModal"

type CardItemProps = {
  card: Card,
  onUpdate?: (card: Card) => void,
  className?: string,
}

export default function CardItem({ card, onUpdate, className }: CardItemProps) {
  const t = useTranslations("components.card.item")
  const td = useTranslations("data.roadmap")
  const { isSignedIn, profile } = useAuth()
  const locale = useLocale()
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPopoverActionOpen, setIsPopoverActionOpen] = useState(false)
  const [authorAvatar, setAuthorAvatar] = useState(card.author.avatar_url || "/dummy.webp")

  const { deleteCard, isPending: isDeleting } = useCardsMutation()

  const isAdmin = profile?.role === "admin"
  const isAuthor = card.user_id === profile?.id
  const initials = getInitials(card.author.full_name)

  const statusColorMap: Record<CardStatus, BadgeColor> = useMemo(() => ({
    "ideas": "default", "planned": "yellow", "in-progress": "blue", "released": "green"
  }), [])

  const priorityColorMap: Record<CardPriority, BadgeColor> = useMemo(() => ({
    high: "red", medium: "yellow", low: "green",
  }), [])

  const typeIconMap: Record<CardType, ReactNode> = useMemo(() => ({
    feature: <LuRocket className="text-blue"/>,
    bug: <LuBug className="text-red"/>,
    improvement: <LuGauge className="text-green"/>,
    refactor: <LuFilePen className="text-yellow"/>,
  }), [])

  return (
    <>
      <div 
        onClick={() => setIsDetailModalOpen(true)}
        className={cn(
          "group flex flex-col p-4 bg-primary border border-gray-950/10 dark:border-white/10 hover:border-blue-600 hover:dark:border-blue-400 rounded-xl transition-all duration-200 cursor-pointer",
          className
        )}
      >
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="text-primary text-md font-semibold tracking-tight line-clamp-2">{card.title}</h3>
          {(isAdmin || isAuthor) && (
            <div onClick={(e) => e.stopPropagation()}>
              <MiraclePopover open={isPopoverActionOpen} onOpenChange={setIsPopoverActionOpen}          
                trigger={
                  <button type="button" aria-label={t("action")} className="text-secondary flex shrink-0 cursor-pointer items-center justify-center rounded-md p-1.5 transition-all duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800">
                    <LuEllipsis size={20} />
                  </button>
                }
              >
                <div className="flex w-40 flex-col gap-2 p-1">
                  <p className="text-secondary-inv text-[10px] font-bold uppercase tracking-wider px-1">{t("action")}</p>
                  <div className="flex flex-col gap-1 w-full">
                    <MiracleButton size="sm" onClick={() => { setIsPopoverActionOpen(false); onUpdate?.(card) }} startIcon={<LuPencil />} className="justify-start font-medium" variant="secondary" fullWidth>{t("update")}</MiracleButton>
                    <MiracleButton size="sm" status="danger" onClick={() => { setIsPopoverActionOpen(false); setIsDeleteModalOpen(true) }} startIcon={<LuTrash2 />} className="justify-start font-medium" fullWidth>{t("delete")}</MiracleButton>
                  </div>
                </div>
              </MiraclePopover>
            </div>
          )}
        </div>

        <div className="text-sm text-secondary line-clamp-2 mb-2">{card.description}</div>
        <div className="text-secondary flex items-center gap-1 text-xs"><LuCalendar className="shrink-0" />{formatDate({ date: card.created_at, locale, dateStyle: "long" })}</div>

        <div className="flex items-center gap-1.5 mt-3">
          <MiracleBadge variant="secondary" size="sm" startIcon={typeIconMap[card.type]}>{td(`types.${card.type}`)}</MiracleBadge>
          <MiracleBadge variant="secondary" size="sm" color={priorityColorMap[card.priority]}>{td(`priorities.${card.priority}`)}</MiracleBadge>
        </div>

        <div className="pt-3 mt-4 border-t border-primary flex items-center justify-between">
          <MiracleTooltip trigger={
            <div className="bg-blue text-primary-inv relative shrink-0 overflow-hidden rounded-full h-7 w-7">
              {card.author?.avatar_url ? (
                <Image src={authorAvatar} alt={card.author.full_name} fill sizes="28px" className="object-cover" onError={() => setAuthorAvatar("/dummy.webp")} />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[10px] font-bold">{initials}</span>
              )}
            </div>
          }>{card.author.full_name}</MiracleTooltip>

          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
            <ReactionGroup targetId={card.id} targetType="card" initialSummary={card.reaction_summary} />
            <CommentGroup targetId={card.id} targetType="card" initialCount={card.comment_count} />
          </div>
        </div>
      </div>

      <CardDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        card={card} 
        locale={locale} 
        typeIconMap={typeIconMap} 
        priorityColorMap={priorityColorMap} 
        statusColorMap={statusColorMap} 
      />

      <CardDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        card={card} 
        isDeleting={isDeleting} 
        isSignedIn={isSignedIn} 
        onDelete={() => deleteCard({ cardId: card.id }, { onSuccess: () => setIsDeleteModalOpen(false) })} 
      />
    </>
  )
}