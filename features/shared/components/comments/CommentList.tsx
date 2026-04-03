"use client"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { CommentData } from "@/features/shared/types/comments"
import CommentItem from "./CommentItem"

type CommentListProps = {
  comments: CommentData[]
  onDeleteComment?: (id: number) => void
  onReplyComment?: (repliedComment: CommentData) => void
}

export default function CommentList({ comments, onDeleteComment, onReplyComment }: CommentListProps) {
  const t = useTranslations("components.comment")
  
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({})

  const { rootComments, repliesMap } = useMemo(() => {
    const roots = comments.filter(c => !c.parent_id)
    const replies: Record<number, CommentData[]> = {}
    comments.forEach(c => {
      if (c.parent_id) {
        if (!replies[c.parent_id]) replies[c.parent_id] = []
        replies[c.parent_id].push(c)
      }
    })
    return { rootComments: roots, repliesMap: replies }
  }, [comments])

  if (comments.length === 0) return (
    <div className="text-secondary p-8 text-center text-sm">{t("emptyMessage")}</div>
  )

  return (
    <div className="flex flex-col gap-6">
      {rootComments.map((root) => {
        const replies = repliesMap[root.id] || []
        const isShow = expandedIds[root.id]

        return (
          <div key={root.id} className="flex flex-col gap-4">
            {/* Root Comment */}
            <CommentItem comment={root} onDeleteComment={onDeleteComment} onReplyComment={onReplyComment}/>
            
            {/* Logic See Replies */}
            {replies.length > 0 && (
              <div className="ml-10">
                {!isShow ? (
                  <button 
                    onClick={() => setExpandedIds(p => ({...p, [root.id]: true}))}
                    className="text-xs font-bold text-secondary flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-6 h-[1px] bg-neutral-300" /> 
                    { `${t("viewReplies")} (${replies.length})` }
                  </button>
                ) : (
                  <div className="flex flex-col gap-4 border-l border-default pl-4">
                    {replies.map((reply) => (
                      <CommentItem key={reply.id} comment={reply} onDeleteComment={onDeleteComment} onReplyComment={onReplyComment}/>
                    ))}
                    <button 
                      onClick={() => setExpandedIds(p => ({...p, [root.id]: false}))}
                      className="text-xs font-bold text-secondary self-start cursor-pointer"
                    >
                      {t("hideReplies")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}