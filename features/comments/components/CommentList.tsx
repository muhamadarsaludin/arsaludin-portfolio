import CommentItem from "./CommentItem"
import type { CommentData, CommentTargetType } from "../types/comments.types"
import { useTranslations } from "next-intl"
import { GetBatchUserReactionsResult } from "@/features/reactions/services/reactions"

type CommentListProps = {
  targetId: string
  targetType: CommentTargetType
  comments: CommentData[]
  userReactions?: GetBatchUserReactionsResult 
  onReplyComment: (comment: CommentData) => void
}

export default function CommentList({
  targetId,
  targetType,
  comments,
  userReactions,
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
        const userReaction = userReactions?.[comment.id] || null
        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            targetId={targetId}
            targetType={targetType}
            initialUserReaction={userReaction}
            onReplyComment={onReplyComment}
          />
        )
      })}
    </ul>
  )
}
