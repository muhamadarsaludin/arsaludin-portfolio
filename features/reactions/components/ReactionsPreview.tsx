"use client"

import { useState } from "react"
import { cn } from "@/utils/class-name"
import MiraclePopover from "@/components/miracle/Popover"
import MiracleButton from "@/components/miracle/Button"
import type { TooltipDefaultPosition } from "@/components/miracle/Tooltip"
import MiracleTooltip from "@/components/miracle/Tooltip"
import { useTranslations } from "next-intl"
import { useAuth } from "@/providers/AuthProvider"
import { signInWithGoogle } from "@/features/auth/services/auth"
import { LuEye } from "react-icons/lu"
import type { Reaction, ReactionSummary } from "../types/reactions.types"
import { MAX_TOP_REACTIONS } from "../constants/reactions.constants"

type ReactionsPreviewProps = {
  userReaction?: Reaction | null
  reactionSummary?: ReactionSummary
  limit?: number
  onSelectReaction: (emoji: string) => void
  tooltipPosition?: TooltipDefaultPosition
}

export default function ReactionsPreview({
  userReaction,
  reactionSummary,
  limit = MAX_TOP_REACTIONS,
  onSelectReaction,
  tooltipPosition,
}: ReactionsPreviewProps) {
  console.log("user", userReaction)
  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const t = useTranslations("components.reaction")
  const zIndexBase = 10

  if (!reactionSummary || reactionSummary.totalReactions <= 0) return null

  const topReactions = reactionSummary.allReactions.slice(0, limit)
  const remainingEmojis = Math.max(0, reactionSummary.totalEmojis - limit)

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
      {topReactions.map((reaction, index) => {
        // FIX 3: Cek kecocokan emoji langsung menggunakan prop `userReaction` yang di-passing dari parent
        const isUserReaction = userReaction && reaction.emoji === userReaction.emoji

        return (
          <button
            key={reaction.emoji}
            type="button"
            aria-label={
              userReaction
                ? isUserReaction
                  ? `${t("tooltip.delete")} ${reaction.emoji}`
                  : `${t("tooltip.edit")} ${reaction.emoji}`
                : `${t("tooltip.add")} ${reaction.emoji}`
            }
            className={cn(
              "group/emoji bg-secondary flex h-8 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 ease-in-out outline-none",
              "min-w-8 gap-0 px-1.5",
              "hover:gap-1 hover:px-3",
              isUserReaction ? "border-blue" : "border-primary"
            )}
            style={{ zIndex: zIndexBase + index }}
            onClick={(e) => {
              e.stopPropagation()
              handleSelectedIcon(reaction.emoji)
            }}
          >
            <span className="shrink-0 text-xs">{reaction.emoji}</span>
            <span
              className={cn(
                "text-secondary overflow-hidden text-xs font-semibold transition-all duration-300 ease-in-out",
                "invisible max-w-0 opacity-0",
                "group-hover/emoji:visible group-hover/emoji:max-w-35 group-hover/emoji:opacity-100"
              )}
            >
              {reaction.count}
            </span>
          </button>
        )
      })}

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
                  className={cn(
                    "group/emoji border-primary bg-secondary flex h-8 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 ease-in-out outline-none",
                    "min-w-8 gap-0 px-1.5",
                    "hover:gap-1 hover:px-3"
                  )}
                  style={{ zIndex: zIndexBase + topReactions.length + 1 }}
                >
                  <span
                    className={cn(
                      "text-secondary shrink-0 overflow-hidden text-sm transition-all duration-300 ease-in-out",
                      "invisible max-w-0 opacity-0",
                      "group-hover/emoji:visible group-hover/emoji:max-w-10 group-hover/emoji:opacity-100"
                    )}
                  >
                    <LuEye />
                  </span>
                  <span className="text-secondary text-xs font-semibold">+{remainingEmojis}</span>
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
              {reactionSummary.allReactions.map((reaction) => {
                // FIX 4: Samakan logika penanda reaksi user aktif di dalam popover
                const isUserReaction = userReaction && reaction.emoji === userReaction.emoji

                return (
                  <MiracleButton
                    variant="secondary"
                    key={reaction.emoji}
                    size="sm"
                    className={cn(isUserReaction && "border-blue border-2")}
                    onClick={() => {
                      handleSelectedIcon(reaction.emoji)
                    }}
                  >
                    <span className="mr-1">{reaction.emoji}</span>
                    <span className="text-secondary font-bold">{reaction.count}</span>
                  </MiracleButton>
                )
              })}
            </div>
          </div>
        </MiraclePopover>
      )}
    </div>
  )
}
