"use client"

import { useState } from "react"
import type { ReactionSummary, ReactionTargetType } from "../types/reactions.types"
import ReactionsPreview from "./ReactionsPreview"
import ReactionPicker from "./ReactionPicker"
import ReactionModal from "./ReactionModal"
import { useReactionMutation } from "../hooks/useReationMutation"
import type { TooltipDefaultPosition } from "@/components/miracle/Tooltip"
import { MAX_TOP_REACTIONS } from "../constants/reactions.constants"

type ReactionGroupProps = {
  targetId: string
  targetType: ReactionTargetType
  initialSummary?: ReactionSummary
  limit?: number
  tooltipPosition?: TooltipDefaultPosition
}

export default function ReactionGroup({
  targetId,
  targetType,
  initialSummary,
  limit = MAX_TOP_REACTIONS,
  tooltipPosition,
}: ReactionGroupProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { mutate } = useReactionMutation({
    targetId,
    targetType,
  })

  const handleToggleReaction = (emoji: string) => {
    mutate({ emoji })
  }

  return (
    <div className="flex items-center">
      <ReactionsPreview
        targetId={targetId}
        targetType={targetType}
        initialSummary={initialSummary}
        limit={limit}
        onSelectReaction={handleToggleReaction}
        tooltipPosition={tooltipPosition}
      />

      <ReactionPicker
        targetId={targetId}
        targetType={targetType}
        initialSummary={initialSummary}
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
