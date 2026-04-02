"use client"
import { useTranslations } from "next-intl"
import { CommentData } from "@/features/shared/types/comments"
import CommentItem from "./CommentItem"

type CommentListProps = {
  comments: CommentData[]
}

export default function CommentList({ comments }: CommentListProps) {
  const t = useTranslations("components.comment")

  if (comments.length === 0) return (
    <div className="text-secondary p-8 text-center text-sm">{t("emptyMessage")}</div>
  )

  const rootComments = comments.filter((c) => !c.parent_id)
  const getReplies = (parentId: number) => comments.filter((c) => c.parent_id === parentId)

  return (
    <div className="flex flex-col gap-6">
      {rootComments.map((root) => (
        <div key={root.id} className="flex flex-col gap-4">
          <CommentItem item={root} />
          
          {getReplies(root.id).length > 0 && (
            <div className="ml-4 flex flex-col gap-4 border-l border-default pl-4 sm:ml-10">
              {getReplies(root.id).map((reply) => (
                <CommentItem key={reply.id} item={reply} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
