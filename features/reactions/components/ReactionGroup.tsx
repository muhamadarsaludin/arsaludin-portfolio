"use client"

import { useCallback } from "react"
import { useRouter } from "@/i18n/navigation"
import { getReactions, toggleReaction } from "../services/reactions"
import type { ReactionSummary, ReactionTargetType } from "../types/reactions"
import ReactionsPreview from "./ReactionsPreview"
import ReactionPicker from "./ReactionPicker"

type ReactionGroupProps = {
  targetId: string
  targetType: ReactionTargetType
  reactionSummary: ReactionSummary
}

export default function ReactionGroup({
  targetId,
  targetType,
  reactionSummary,
}: ReactionGroupProps) {
  const router = useRouter()

  const handleSelectReaction = useCallback(
    async (emoji: string) => {
      try {
        await toggleReaction({
          targetId,
          targetType,
          emoji,
        })

        router.refresh()
      } catch (error) {
        console.error("Failed to toggle reaction:", error)
      }
    },
    [targetId, targetType, router]
  )

  const handleGetAllReactions = useCallback(async () => {
    return await getReactions({
      targetId,
      targetType,
    })
  }, [targetId, targetType])

  return (
    <div className="flex items-center gap-1">
      <ReactionsPreview
        reactionSummary={reactionSummary}
        onSelectReaction={handleSelectReaction}
        getAllReactions={handleGetAllReactions}
      />

      <ReactionPicker reactionSummary={reactionSummary} onSelectReaction={handleSelectReaction} />
    </div>
  )
}
