import CommentItem from "./CommentItem"
import type { CommentData, CommentTargetType } from "../types/comments.types"
import { useTranslations } from "next-intl"
import type { GetBatchReactionsResult } from "@/features/reactions/services/reactions"

type CommentListProps = {
  targetId: string
  targetType: CommentTargetType
  comments: CommentData[]
  dataReactions?: GetBatchReactionsResult
  onReplyComment: (comment: CommentData) => void
}

export default function CommentList({
  targetId,
  targetType,
  comments,
  dataReactions,
  onReplyComment,
}: CommentListProps) {
  const t = useTranslations("components.comment.list")

  if (comments.length === 0)
    return (
      <div className="text-secondary flex h-full items-center justify-center text-center text-sm">
        {t("emptyMessage")}
      </div>
    )

  return (
    <ul className="flex flex-col gap-5">
      {comments.map((comment) => {
        const dataReaction = dataReactions?.[comment.id]
        const reactionSummary = dataReaction?.summary || comment.reaction_summary
        const userReaction = dataReaction?.userReaction || null
        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            targetId={targetId}
            targetType={targetType}
            reactionSummary={reactionSummary}
            userReaction={userReaction}
            onReplyComment={onReplyComment}
          />
        )
      })}
    </ul>
  )
}
