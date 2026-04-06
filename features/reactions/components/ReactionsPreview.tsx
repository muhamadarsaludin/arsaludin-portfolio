"use client"

import { useState, useEffect, useCallback } from "react"
import clsx from "clsx"
import MiraclePopover from "@/components/miracle/Popover"
import MiracleLoader from "@/components/miracle/Loader"
import MiracleButton from "@/components/miracle/Button"
import MiracleTooltip from "@/components/miracle/Tooltip"
import { useTranslations } from "next-intl"
import { useAuth } from "@/providers/AuthProvider"
import { signInWithGoogle } from "@/features/auth/services/authService"
import type { ReactionSummary, ReactionCount } from "../types/reactions"
import { LuEye } from "react-icons/lu"

type ReactionsPreviewProps = {
  reactionSummary: ReactionSummary
  onSelectReaction: (emoji: string) => void
  getAllReactions: () => Promise<ReactionCount[]> 
}

export default function ReactionsPreview({
  reactionSummary,
  onSelectReaction,
  getAllReactions,
}: ReactionsPreviewProps) {
  if (reactionSummary.totalReactions <= 0) return null

  const [isOpen, setIsOpen] = useState(false)
  const [allReactions, setAllReactions] = useState<ReactionCount[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { isSignedIn } = useAuth()
  const t = useTranslations("components.reaction")
  const zIndexBase = 10

  /**
   * Fetches detailed reaction data for the popover
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAllReactions()
      setAllReactions(data)
    } catch (error) {
      console.error("[ReactionsPreview] Fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [getAllReactions])

  // Initial fetch when popover opens
  useEffect(() => {
    if (isOpen) fetchData()
  }, [isOpen, fetchData])

  /**
   * Handles reaction selection. 
   * If not signed in, triggers Google Login.
   */
  const handleSelectedIcon = async (emoji: string) => {
    if (!isSignedIn) {
      try {
        await signInWithGoogle()
        return
      } catch (error) {
        console.error("[ReactionsPreview] Login error:", error)
        return
      }
    }

    onSelectReaction(emoji)
    if (isOpen) {
      await fetchData()
    }
  }

  return (
    <div className="relative z-20 flex cursor-pointer items-center -space-x-2">
      {/* Top Reactions List */}
      {reactionSummary.topReactions.map((reaction, index) => (
        <button
          key={reaction.emoji}
          type="button"
          className={clsx(
            "group/emoji flex h-7 items-center justify-center rounded-full border-2 bg-secondary transition-all duration-300 ease-in-out outline-none cursor-pointer",
            "min-w-7 px-1.5",
            "hover:px-3 hover:gap-1.5",
            reaction.emoji === reactionSummary.userReaction?.emoji ? "border-blue" : "border-primary"
          )}
          style={{ zIndex: zIndexBase + index }}
          onClick={(e) => {
            e.stopPropagation()
            handleSelectedIcon(reaction.emoji)
          }}
        >
          <span className="text-xs flex-shrink-0">{reaction.emoji}</span>
          <span 
            className={clsx(
              "text-secondary text-xs font-semibold overflow-hidden transition-all duration-300 ease-in-out",
              "max-w-0 opacity-0 invisible",
              "group-hover/emoji:max-w-[300px] group-hover/emoji:opacity-100 group-hover/emoji:visible"
            )}
          >
            {reaction.count}
          </span>
        </button>
      ))}

      {/* Remaining Reactions Popover */}
      {reactionSummary.remainingEmojis > 0 && (
        <MiraclePopover
          open={isOpen}
          onOpenChange={setIsOpen}
          noPadding
          trigger={
            <MiracleTooltip
              trigger={
                <button
                  type="button"
                  className={clsx(
                    "group/emoji flex h-7 items-center justify-center rounded-full border-2 border-primary bg-secondary transition-all duration-300 ease-in-out outline-none cursor-pointer",
                    "min-w-7 px-1.5",
                    "hover:px-3 hover:gap-1",
                  )}
                  style={{ zIndex: zIndexBase + reactionSummary.topReactions.length + 1 }}
                >
                  <span 
                    className={clsx(
                      "text-secondary text-sm overflow-hidden transition-all duration-300 ease-in-out",
                      "max-w-0 opacity-0 invisible",
                      "group-hover/emoji:max-w-[50px] group-hover/emoji:opacity-100 group-hover/emoji:visible"
                    )}
                  >
                    <LuEye/>
                  </span>
                  <span className="text-secondary text-xs font-semibold">+{reactionSummary.remainingEmojis}</span>
                </button>
              }
            >
              {t("tooltip.seeAll")}
            </MiracleTooltip>
          }
        >
          <div className="flex max-h-[250px] w-[200px] flex-col p-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-secondary/60">
              {t("popover.title")}
            </p>
            
            <div className="flex flex-wrap gap-1 overflow-y-auto">
              {isLoading && allReactions.length === 0 ? (
                <div className="flex w-full justify-center py-4">
                  <MiracleLoader size={20} />
                </div>
              ) : (
                allReactions.map((reaction) => (
                  <MiracleButton
                    variant="secondary"
                    key={reaction.emoji}
                    size="sm"
                    className={clsx(
                      reaction.emoji === reactionSummary.userReaction?.emoji && "border-2 border-blue",
                      isLoading && "opacity-50"
                    )}
                    onClick={() => !isLoading && handleSelectedIcon(reaction.emoji)}
                  >
                    <span className="mr-1">{reaction.emoji}</span>
                    <span className="font-bold text-secondary">{reaction.count}</span>
                  </MiracleButton>
                ))
              )}
            </div>
          </div>
        </MiraclePopover>
      )}
    </div>
  )
}