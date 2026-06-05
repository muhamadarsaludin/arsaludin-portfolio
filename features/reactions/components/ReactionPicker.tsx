"use client"

import React, { useState, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import { TbMoodPlus } from "react-icons/tb"
import { useTranslations } from "next-intl"
import { Theme } from "emoji-picker-react"
import { cn } from "@/utils/class-name"
import { useAuth } from "@/providers/AuthProvider"
import { useTheme } from "@wrksz/themes/client"
import { signInWithGoogle } from "@/features/auth/services/auth"
import type { TooltipDefaultPosition } from "@/components/miracle/Tooltip"
import MiracleTooltip from "@/components/miracle/Tooltip"
import MiraclePopover from "@/components/miracle/Popover"
import MiracleLoader from "@/components/miracle/Loader"
import type { Reaction, ReactionSummary } from "../types/reactions.types"
import { formatCount } from "@/utils/format-number"

// Dynamically import EmojiPicker to improve initial bundle size and performance
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="bg-primary border-primary flex h-82.5 w-75 items-center justify-center rounded-lg border shadow-xl">
      <MiracleLoader size={40} />
    </div>
  ),
})

type ReactionPickerProps = {
  reactionSummary: ReactionSummary | null
  userReaction: Reaction | null
  onSelectReaction: (emoji: string) => void
  onShowDetail?: () => void
  tooltipPosition?: TooltipDefaultPosition
}

export default function ReactionPicker({
  userReaction,
  reactionSummary,
  onSelectReaction,
  onShowDetail,
  tooltipPosition,
}: ReactionPickerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const { theme } = useTheme()
  const t = useTranslations("components.reaction")

  // INVERSE THEME
  const pickerTheme = useMemo(() => (theme === "dark" ? Theme.LIGHT : Theme.DARK), [theme])

  const handleEmojiClick = useCallback(
    (emojiData: { emoji: string }) => {
      onSelectReaction(emojiData.emoji)
      setIsPickerOpen(false)
    },
    [onSelectReaction]
  )

  const renderPickerToggle = (onClick?: React.MouseEventHandler) => (
    <MiracleTooltip
      noPadding
      defaultPosition={tooltipPosition}
      trigger={
        <button
          aria-label={
            !isSignedIn ? t("tooltip.auth") : userReaction ? t("tooltip.edit") : t("tooltip.add")
          }
          onClick={onClick}
          type="button"
          className="group/reaction-picker cursor-pointer"
        >
          <div className="relative p-1.5">
            <TbMoodPlus
              size={20}
              className="text-secondary transition-all duration-300 ease-in-out group-hover/reaction-picker:scale-110"
            />
            <span
              className={cn(
                "bg-red absolute top-0 right-0 h-1.5 w-1.5 rounded-full",
                "transition-opacity duration-300",
                userReaction ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </button>
      }
    >
      <span className="flex p-2 text-xs font-medium whitespace-nowrap">
        {!isSignedIn ? t("tooltip.auth") : userReaction ? t("tooltip.edit") : t("tooltip.add")}
      </span>
    </MiracleTooltip>
  )

  const renderDetailToggle = () => {
    if (!reactionSummary || reactionSummary.totalReactions <= 0) return null
    return (
      <MiracleTooltip
        defaultPosition={tooltipPosition}
        trigger={
          <button
            onClick={onShowDetail}
            type="button"
            className="group/reaction-picker flex min-w-6 cursor-help p-1.5"
            aria-label={t("tooltip.seeDetail")}
          >
            <span className="text-secondary text-sm font-medium">
              {formatCount(reactionSummary.totalReactions)}
            </span>
          </button>
        }
      >
        {t("tooltip.seeDetail")}
      </MiracleTooltip>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center">
        {renderPickerToggle(async (e) => {
          e.preventDefault()
          await signInWithGoogle()
        })}
        {renderDetailToggle()}
      </div>
    )
  }

  return (
    <div className="flex items-center">
      <MiraclePopover
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        defaultPosition={tooltipPosition}
        noArrow
        noBackground
        noShadow
        noPadding
        trigger={renderPickerToggle()}
      >
        <div className="overflow-hidden rounded-lg shadow-2xl">
          <EmojiPicker
            theme={pickerTheme}
            skinTonesDisabled
            onEmojiClick={handleEmojiClick}
            width={300}
            height={330}
          />
        </div>
      </MiraclePopover>
      {renderDetailToggle()}
    </div>
  )
}
