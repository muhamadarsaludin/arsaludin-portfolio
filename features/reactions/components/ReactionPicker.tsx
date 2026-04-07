"use client"

import React, { useState, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import { LuCircleFadingPlus } from "react-icons/lu"
import { useTranslations } from "next-intl"
import { Theme } from "emoji-picker-react"
import clsx from "clsx"

import { useAuth } from "@/providers/AuthProvider"
import { useTheme } from "@wrksz/themes/client"
import { signInWithGoogle } from "@/features/auth/services/auth"

import MiracleTooltip from "@/components/miracle/Tooltip"
import MiraclePopover from "@/components/miracle/Popover"
import MiracleLoader from "@/components/miracle/Loader"

// Hook & Types baru
import { useReactionSummary } from "@/features/reactions/hooks/useReactionSummary"
import type { ReactionSummary, ReactionTargetType } from "../types/reactions.types"

// Dynamically import EmojiPicker to improve initial bundle size and performance
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="bg-primary border-primary flex h-[400px] w-[350px] items-center justify-center rounded-lg border shadow-xl">
      <MiracleLoader size={40} />
    </div>
  ),
})

type ReactionPickerProps = {
  targetId: string
  targetType: ReactionTargetType
  initialSummary?: ReactionSummary
  onSelectReaction: (emoji: string) => void
  onShowDetail?: () => void
}

export default function ReactionPicker({ 
  targetId, 
  targetType, 
  initialSummary, 
  onSelectReaction,
  onShowDetail
}: ReactionPickerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const { theme } = useTheme()
  const t = useTranslations("components.reaction")

  // Ambil data terbaru dari cache
  const { data: summary } = useReactionSummary({ targetId, targetType, initialSummary })
  const dataSummary = summary ?? initialSummary

  const pickerTheme = useMemo(() => (theme === "dark" ? Theme.LIGHT : Theme.DARK), [theme])

  const handleEmojiClick = useCallback(
    (emojiData: any) => {
      onSelectReaction(emojiData.emoji)
      setIsPickerOpen(false)
    },
    [onSelectReaction]
  )

  const PickerToggle = ({ onClick }: { onClick?: React.MouseEventHandler }) => (
    <MiracleTooltip
      noPadding
      trigger={
        <button
          onClick={onClick}
          type="button"
          className="group/reaction-picker cursor-pointer"
        >
          <div className="relative p-1">
            <LuCircleFadingPlus
              size={20}
              className="text-secondary transition-all duration-300 ease-in-out group-hover/reaction-picker:scale-110"
            />
            {/* Indikator dot merah kalau user sudah react */}
            <span
              className={clsx(
                "bg-red absolute top-0 right-0 h-1.5 w-1.5 rounded-full",
                "transition-opacity duration-300",
                dataSummary?.userReaction ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </button>
      }
    >
      <span className="flex p-2 text-xs font-medium whitespace-nowrap">
        {!isSignedIn
          ? t("tooltip.auth")
          : dataSummary?.userReaction
          ? t("tooltip.edit")
          : t("tooltip.add")}
      </span>
    </MiracleTooltip>
  )

  if (!isSignedIn) {
    return (
      <PickerToggle
        onClick={async (e) => {
          e.preventDefault()
          await signInWithGoogle()
        }}
      />
    )
  }

  return (
    <div className="flex items-center gap-1">
      <MiraclePopover
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        noArrow
        noBackground
        noShadow
        noPadding
        trigger={<PickerToggle />}
      >
        <div className="min-w-[350px] overflow-hidden rounded-lg shadow-2xl">
          {isPickerOpen && (
            <EmojiPicker
              theme={pickerTheme}
              skinTonesDisabled
              onEmojiClick={handleEmojiClick}
              width={350}
              height={400}
            />
          )}
        </div>
      </MiraclePopover>
      
      {dataSummary && dataSummary.totalReactions > 0 && (
        <MiracleTooltip
          trigger={
            <button
              onClick={onShowDetail}
              type="button"
              className="group/reaction-picker cursor-help"
            >
              <span className="text-secondary text-sm font-medium tabular-nums">
                {dataSummary.totalReactions}
              </span>
            </button>
          }
        >
          {t("tooltip.seeDetail")}
        </MiracleTooltip>
      )}

    </div>
  )
}