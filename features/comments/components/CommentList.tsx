import CommentItem from "./CommentItem"
import { CommentData, CommentTargetType } from "../types/comments"
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
  onReplyComment 
}: CommentListProps) {
  const t = useTranslations("components.comment.list")

  if (comments.length === 0) return (
    <div className="text-secondary text-center text-sm h-full flex items-center justify-center">{t("emptyMessage")}</div>
  )
  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem 
          key={comment.id} 
          comment={comment} 
          targetId={targetId}
          targetType={targetType}
          onReplyComment={onReplyComment}
        />
      ))}
    </div>
  )
}