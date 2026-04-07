"use client"

import { useState } from "react"
import type { ReactionSummary, ReactionTargetType } from "../types/reactions.types"
import ReactionsPreview from "./ReactionsPreview"
import ReactionPicker from "./ReactionPicker"
import ReactionModal from "./ReactionModal"
import { useReactionMutation } from "../hooks/useReationMutation"

type ReactionGroupProps = {
  targetId: string
  targetType: ReactionTargetType
  initialSummary?: ReactionSummary
}

export default function ReactionGroup({ 
  targetId, 
  targetType, 
  initialSummary 
}: ReactionGroupProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { mutate } = useReactionMutation({ 
    targetId, 
    targetType 
  })

  const handleToggleReaction = (emoji: string) => {
    mutate({ emoji })
  }

  return (
    <div className="flex items-center gap-1 py-1">
      <ReactionsPreview 
        targetId={targetId} 
        targetType={targetType} 
        initialSummary={initialSummary}
        onSelectReaction={handleToggleReaction}
      />
      
      <ReactionPicker 
        targetId={targetId} 
        targetType={targetType} 
        initialSummary={initialSummary}
        onSelectReaction={handleToggleReaction}
        onShowDetail={() => setIsModalOpen(true)}
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