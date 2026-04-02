import { ReactionSummary } from "../../types/reactions"

type ReactionsCountProps = {
  reactionSummary: ReactionSummary
}
export default function ReactionsCount({ reactionSummary }: ReactionsCountProps) {
  if (reactionSummary.total <= 0) return
  return (
    <span className="text-secondary text-sm font-medium">{reactionSummary.totalReactions}</span>
  )
}
