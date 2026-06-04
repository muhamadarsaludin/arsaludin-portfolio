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
import { useReactionMutation } from "../hooks/useReactionMutation"

type ReactionGroupProps = {
  targetId: string
  targetType: ReactionTargetType
  initialReactionSummary?: ReactionSummary
  initialUserReaction?: Reaction | null
  limit?: number
  tooltipPosition?: TooltipDefaultPosition
}

export default function ReactionGroup({
  targetId,
  targetType,
  initialReactionSummary,
  initialUserReaction,
  limit = MAX_TOP_REACTIONS,
  tooltipPosition
}: ReactionGroupProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hasInitialReactionSummary = initialReactionSummary !== undefined
  const hasInitialUserReaction = initialUserReaction !== undefined
  
  const { data: reactionSummary } = useReactionSummary({
    targetId,
    targetType,
    initialReactionSummary,
    enabled: !!targetId && !hasInitialReactionSummary,
  })

  const { data: userReaction } = useUserReaction({
    targetId,
    targetType,
    initialUserReaction,
    enabled: !!targetId && !hasInitialUserReaction,
  })

  const { toggle } = useReactionMutation({
    targetId,
    targetType,
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
