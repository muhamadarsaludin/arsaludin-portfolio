import React from 'react'
import ReactionsPreview from './ReactionsPreview'
import ReactionPicker from './ReactionPicker'
import { ReactionSummary } from '../../types/reactions'
import ReactionsAmount from './ReactionsAmount'

type ReactionsGroupProps = {
  reactionSummary: ReactionSummary
  onSelectReaction: (emoji: string) => void
}

export default function ReactionGroup({ reactionSummary, onSelectReaction }: ReactionsGroupProps) {
  return (
    <div className="flex items-center gap-1">
      <ReactionsPreview reactionSummary={reactionSummary} />
      <ReactionPicker 
        currentReaction={reactionSummary.userReaction?.emoji} 
        onSelectReaction={onSelectReaction} 
      />
      <ReactionsAmount reactionSummary={reactionSummary} />
    </div>
  )
}