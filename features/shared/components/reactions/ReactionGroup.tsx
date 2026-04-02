"use client"

import ReactionsPreview from './ReactionsPreview'
import ReactionPicker from './ReactionPicker'
import { ReactionSummary } from '../../types/reactions'
import ReactionsCount from './ReactionsCount'
import { toggleReaction } from '../../services/reactions'
import { useRouter } from '@/i18n/navigation'

type ReactionGroupProps = {
  targetId: number
  targetType: string
  reactionSummary: ReactionSummary
}

export default function ReactionGroup({ targetId, targetType, reactionSummary }: ReactionGroupProps) {
  const router = useRouter() 
  const handleSelectReaction = async (emoji: string) => {
    try {
      await toggleReaction({
        targetId: targetId,
        targetType: targetType,
        emoji
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to toggle reaction:", error)
    }
  }
  return (
    <div className="flex items-center gap-1">
      <ReactionsPreview 
        onSelectReaction={handleSelectReaction} 
        reactionSummary={reactionSummary} />
      <ReactionPicker 
        userReaction={reactionSummary.userReaction} 
        onSelectReaction={handleSelectReaction} 
      />
      <ReactionsCount reactionSummary={reactionSummary} />
    </div>
  )
}