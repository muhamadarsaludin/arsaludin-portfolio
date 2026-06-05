"use client"

import { useState } from "react"
import type { Reaction, ReactionSummary, ReactionTargetType } from "../types/reactions.types"
import ReactionsPreview from "./ReactionsPreview"
import ReactionPicker from "./ReactionPicker"
import ReactionModal from "./ReactionModal"
import { useReactionSummary } from "../hooks/useReactionSummary"
import type { TooltipDefaultPosition } from "@/components/miracle/Tooltip"
import { MAX_TOP_REACTIONS } from "../constants/reactions.constants"
import { useUserReaction } from "../hooks/useUserReaction"
import { useBatchReactionMutation } from "../hooks/useReactionMutationNew"

type ReactionGroupProps = {
  targetId: string
  targetIds: string[]
  targetType: ReactionTargetType
  reactionSummary: ReactionSummary | null
  userReaction: Reaction | null
  limit?: number
  tooltipPosition?: TooltipDefaultPosition
}

export default function ReactionGroup({
  targetId,
  targetIds,
  targetType,
  reactionSummary,
  userReaction,
  limit = MAX_TOP_REACTIONS,
  tooltipPosition,
}: ReactionGroupProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { toggle } = useBatchReactionMutation({
    targetId,
    targetType,
    targetIds,
  })

  const handleToggleReaction = (emoji: string) => {
    toggle({ emoji })
  }

  return (
    <div className="flex items-center">
      <ReactionsPreview
        userReaction={userReaction}
        reactionSummary={reactionSummary}
        limit={limit}
        onSelectReaction={handleToggleReaction}
        tooltipPosition={tooltipPosition}
      />

      <ReactionPicker
        userReaction={userReaction}
        reactionSummary={reactionSummary}
        onSelectReaction={handleToggleReaction}
        onShowDetail={() => setIsModalOpen(true)}
        tooltipPosition={tooltipPosition}
      />

      <ReactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetId={targetId}
        targetType={targetType}
      />
    </div>
  )
}
