import { ReactionSummary } from "../../types/reactions"

type ReactionsAmountProps = {
  reactionSummary: ReactionSummary
}
export default function ReactionsAmount({reactionSummary}: ReactionsAmountProps) {
  if (reactionSummary.total <= 0) return
  return (
    <span className="text-sm font-medium text-secondary">
      {reactionSummary.totalReactions}
    </span>
  )
}
