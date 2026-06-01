import CommentItem from "./CommentItem"
import type { CommentData, CommentTargetType } from "../types/comments.types"
import { useTranslations } from "next-intl"

type CommentListProps = {
  targetId: string
  targetType: CommentTargetType
  comments: CommentData[]
  onReplyComment: (comment: CommentData) => void
}

export default function CommentList({
  targetId,
  targetType,
  comments,
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
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          targetId={targetId}
          targetType={targetType}
          onReplyComment={onReplyComment}
        />
      ))}
    </ul>
  )
}
