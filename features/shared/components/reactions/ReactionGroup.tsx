import React from 'react'
import ReactionsPreview from './ReactionsPreview'
import ReactionPicker from './ReactionPicker'
import { ReactionSummary } from '../../types/reactions'
import ReactionsAmount from './ReactionsAmount'

type ReactionsGroupProps = {
  reactionSummary: ReactionSummary
}

export default function ReactionGroup({reactionSummary}: ReactionsGroupProps) {
  return (
    <div className="flex items-center gap-1">
      <ReactionsPreview reactionSummary={reactionSummary} />
      <ReactionPicker />
      <ReactionsAmount reactionSummary={reactionSummary} />
    </div>
  )
}
