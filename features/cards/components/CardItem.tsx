"use client"

import React, { ReactNode, useState, useMemo } from 'react'
import { Card, CardPriority, CardStatus, CardType } from '@/features/cards/types/cards.types'
import { useLocale, useTranslations } from 'next-intl'
import Image from "next/image"
import clsx from 'clsx'
import { useAuth } from '@/providers/AuthProvider'
import { 
  LuBug, 
  LuCalendar, 
  LuEllipsis, 
  LuFilePen, 
  LuGauge, 
  LuPencil, 
  LuRocket, 
  LuTrash2,
  LuCircleCheck
} from 'react-icons/lu'
import { formatDate } from '@/utils/format-date'
import MiracleBadge, { BadgeColor } from '@/components/miracle/Badge'
import { getInitials } from '@/utils/initials'
import MiracleTooltip from '@/components/miracle/Tooltip'
import ReactionGroup from '@/features/reactions/components/ReactionGroup'
import CommentGroup from '@/features/comments/components/CommentGroup'
import MiraclePopover from '@/components/miracle/Popover'
import MiracleButton from '@/components/miracle/Button'
import MiracleModal from '@/components/miracle/Modal'
import { useCardsMutation } from '@/features/cards/hooks/useCardMutation'

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
    "ideas": "default",
    "planned": "yellow",
    "in-progress": "blue",
    "released": "green"
  }), [])

  const priorityColorMap: Record<CardPriority, BadgeColor> = useMemo(() => ({
    high: "red",
    medium: "yellow",
    low: "green",
  }), [])

  const typeIconMap: Record<CardType, ReactNode> = useMemo(() => ({
    feature: <LuRocket className="text-blue"/>,
    bug: <LuBug className="text-red"/>,
    improvement: <LuGauge className="text-green"/>,
    refactor: <LuFilePen className="text-yellow"/>,
  }), [])

  const handleDeleteAction = () => {
    deleteCard({ cardId: card.id }, {
      onSuccess: () => setIsDeleteModalOpen(false)
    })
  }

  return (
    <>
      <div 
        onClick={() => setIsDetailModalOpen(true)}
        className={clsx(
          "group flex flex-col p-4 bg-primary border border-gray-950/10 dark:border-white/10 hover:border-blue-600 hover:dark:border-blue-400 rounded-xl transition-all duration-200 cursor-pointer",
          className
        )}
      >
        <div className="flex items-start justify-between mb-2 gap-2">
          <h4 className="text-primary text-md font-semibold tracking-tight line-clamp-2">
            {card.title}
          </h4>
          {(isAdmin || isAuthor) && (
            <div onClick={(e) => e.stopPropagation()}>
              <MiraclePopover 
                open={isPopoverActionOpen}
                onOpenChange={setIsPopoverActionOpen}          
                trigger={
                  <button className="text-secondary flex shrink-0 cursor-pointer items-center justify-center rounded-md p-1.5 transition-all duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-800">
                    <LuEllipsis size={20} />
                  </button>
                }
              >
                <div className="flex max-w-[150px] w-fit flex-col gap-1">
                  <p className="text-secondary-inv text-[10px] font-bold uppercase">{t("action")}</p>
                  <div className="flex item-center gap-1.5">
                    <MiracleButton size="sm" onClick={() => { setIsPopoverActionOpen(false); onUpdate?.(card); }} startIcon={<LuPencil />} className="justify-start font-medium" variant="secondary">
                      {t("update")}
                    </MiracleButton>
                    <MiracleButton size="sm" status="danger" onClick={() => { setIsPopoverActionOpen(false); setIsDeleteModalOpen(true); }} startIcon={<LuTrash2 />} className="justify-start font-medium">
                      {t("delete")}
                    </MiracleButton>
                  </div>
                </div>
              </MiraclePopover>
            </div>
          )}
        </div>
        <div className="text-sm text-secondary line-clamp-2 mb-2">{card.description}</div>
        
        <div className="text-secondary flex items-center gap-1 text-xs">
          <LuCalendar className="shrink-0" />
          {formatDate({ date: card.created_at, locale, dateStyle: "long" })}
        </div>

        <div className="flex items-center gap-1.5 mt-3">
          <MiracleBadge variant="secondary" size="sm" startIcon={typeIconMap[card.type]}>
            {td(`types.${card.type}`)}
          </MiracleBadge>
          <MiracleBadge variant="secondary" size="sm" color={priorityColorMap[card.priority]}>
            {td(`priorities.${card.priority}`)}
          </MiracleBadge>
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
          }>
            {card.author.full_name}
          </MiracleTooltip>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <ReactionGroup targetId={card.id} targetType="card" initialSummary={card.reaction_summary} />
            <CommentGroup targetId={card.id} targetType="card" initialCount={card.comment_count} />
          </div>
        </div>
      </div>

      {/* 1. MODAL DETAIL (Full Information) */}
      <MiracleModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title={t("modal.detail.title")} 
        size="md"
      >
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

          <div className="flex items-center justify-end gap-1 mt-5 pt-2 border-t border-primary" onClick={(e) => e.stopPropagation()}>
            <ReactionGroup targetId={card.id} targetType="card" initialSummary={card.reaction_summary} />
            <CommentGroup targetId={card.id} targetType="card" initialCount={card.comment_count} />
          </div>
        </div>
      </MiracleModal>

      {/* 2. MODAL DELETE */}
      <MiracleModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} status="error" title={t("modal.delete.title")} size="sm">
        <div className="flex flex-col gap-6 py-2">
          <p className="text-sm text-secondary leading-relaxed">{t("modal.delete.description")}</p>
          <div className="p-4 bg-red-500/5 border border-dashed border-red-500/30 rounded-xl">
            <h4 className="text-primary font-semibold mb-1 line-clamp-1">{card.title}</h4>
            <div className="text-xs text-secondary line-clamp-2">{card.description}</div>
          </div>
          <div className="flex justify-end gap-3">
            <MiracleButton variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>Batal</MiracleButton>
            <MiracleButton status="danger" loading={isDeleting} disabled={isDeleting || !isSignedIn} onClick={handleDeleteAction} startIcon={<LuTrash2 />}>Ya, Hapus</MiracleButton>
          </div>
        </div>
      </MiracleModal>
    </>
  )
}