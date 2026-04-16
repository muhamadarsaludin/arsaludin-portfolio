"use client"

import { useState } from "react"
import clsx from "clsx"
import MiraclePopover from "@/components/miracle/Popover"
import MiracleButton from "@/components/miracle/Button"
import type { TooltipDefaultPosition } from "@/components/miracle/Tooltip"
import MiracleTooltip from "@/components/miracle/Tooltip"
import { useTranslations } from "next-intl"
import { useAuth } from "@/providers/AuthProvider"
import { signInWithGoogle } from "@/features/auth/services/auth"
import { LuEye } from "react-icons/lu"

// Hook & Types baru kita
import { useReactionSummary } from "@/features/reactions/hooks/useReactionSummary"
import type { ReactionSummary, ReactionTargetType } from "../types/reactions.types"
import { MAX_TOP_REACTIONS } from "../constants/reactions.constants"

type ReactionsPreviewProps = {
  targetId: string
  targetType: ReactionTargetType
  initialSummary?: ReactionSummary
  limit?: number
  onSelectReaction: (emoji: string) => void
  tooltipPosition?: TooltipDefaultPosition
}

export default function ReactionsPreview({
  targetId,
  targetType,
  initialSummary,
  limit = MAX_TOP_REACTIONS,
  onSelectReaction,
  tooltipPosition,
}: ReactionsPreviewProps) {

  const { data: summary } = useReactionSummary({
    targetId,
    targetType,
    initialSummary,
  })

  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const t = useTranslations("components.reaction")
  const zIndexBase = 10
  
  const dataSummary = summary ?? initialSummary

  if (!dataSummary || dataSummary.totalReactions <= 0) return null
  
  const topReactions = dataSummary.allReactions.slice(0, limit)
  const remainingEmojis = Math.max(0, dataSummary.totalEmojis - limit)
  /**
   * Handles reaction selection.
   */
  const handleSelectedIcon = async (emoji: string) => {
    if (!isSignedIn) {
      await signInWithGoogle()
      return
    }
    onSelectReaction(emoji)
  }

  return (
    <div className="relative z-20 flex cursor-pointer items-center -space-x-2">
      {/* Top Reactions List */}
      {topReactions.map((reaction, index) => (
        <button
          key={reaction.emoji}
          type="button"
          aria-label={
            dataSummary.userReaction
              ? reaction.emoji === dataSummary.userReaction.emoji 
                ? `${t("tooltip.delete")} ${reaction.emoji}`
                : `${t("tooltip.edit")} ${reaction.emoji}`
              : `${t("tooltip.add")} ${reaction.emoji}`
          }
          className={clsx(
            "group/emoji bg-secondary flex h-8 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 ease-in-out outline-none",
            "min-w-8 px-1.5 gap-0",
            "hover:gap-1 hover:px-3",
            reaction.emoji === dataSummary.userReaction?.emoji ? "border-blue" : "border-primary"
          )}
          style={{ zIndex: zIndexBase + index }}
          onClick={(e) => {
            e.stopPropagation()
            handleSelectedIcon(reaction.emoji)
          }}
        >
          <span className="shrink-0 text-xs">{reaction.emoji}</span>
          <span
            className={clsx(
              "text-secondary overflow-hidden text-xs font-semibold transition-all duration-300 ease-in-out",
              "invisible max-w-0 opacity-0",
              "group-hover/emoji:visible group-hover/emoji:max-w-35 group-hover/emoji:opacity-100"
            )}
          >
            {reaction.count}
          </span>
        </button>
      ))}

      {/* Remaining Reactions Popover */}
      {remainingEmojis > 0 && (
        <MiraclePopover
          open={isOpen}
          onOpenChange={setIsOpen}
          noPadding
          defaultPosition={tooltipPosition}
          trigger={
            <MiracleTooltip
              defaultPosition={tooltipPosition}
              trigger={
                <button
                  type="button"
                  className={clsx(
                    "group/emoji border-primary bg-secondary flex h-8 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 ease-in-out outline-none",
                    "min-w-8 px-1.5 gap-0",
                    "hover:gap-1 hover:px-3"
                  )}
                  style={{ zIndex: zIndexBase + topReactions.length + 1 }}
                >
                  <span
                    className={clsx(
                      "text-secondary overflow-hidden text-sm transition-all duration-300 ease-in-out shrink-0",
                      "invisible max-w-0 opacity-0",
                      "group-hover/emoji:visible group-hover/emoji:max-w-10 group-hover/emoji:opacity-100"
                    )}
                  >
                    <LuEye />
                  </span>
                  <span className="text-secondary text-xs font-semibold">
                    +{remainingEmojis}
                  </span>
                </button>
              }
            >
              {t("tooltip.seeAll")}
            </MiracleTooltip>
          }
        >
          <div className="flex max-h-62.5 w-50 flex-col p-3">
            <p className="text-secondary/60 mb-2 text-[10px] font-bold tracking-widest uppercase">
              {t("popover.title")}
            </p>

            <div className="flex flex-wrap gap-1 overflow-y-auto">
              {/* Di sini kita pake allReactions dari summary data yang sama */}
              {dataSummary.allReactions.map((reaction) => (
                <MiracleButton
                  variant="secondary"
                  key={reaction.emoji}
                  size="sm"
                  className={clsx(
                    reaction.emoji === dataSummary.userReaction?.emoji && "border-blue border-2"
                  )}
                  onClick={() => handleSelectedIcon(reaction.emoji)}
                >
                  <span className="mr-1">{reaction.emoji}</span>
                  <span className="text-secondary font-bold">{reaction.count}</span>
                </MiracleButton>
              ))}
            </div>
          </div>
        </MiraclePopover>
      )}
    </div>
  )
}
