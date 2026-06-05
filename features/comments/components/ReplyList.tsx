"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { LuChevronDown, LuChevronUp } from "react-icons/lu"

import CommentItem from "./CommentItem"
import MiracleLoader from "@/components/miracle/Loader"
import { useInfiniteReplies } from "../hooks/useInfiniteReplies"
import type { CommentData, CommentTargetType } from "../types/comments.types"
import { useBatchReactions } from "@/features/reactions/hooks/useBatchReactions"

type ReplyListProps = {
  parentId: string
  replyCount: number
  targetId: string
  targetType: CommentTargetType
  onReplyComment?: (repliedComment: CommentData) => void
}

export default function ReplyList({
  parentId,
  replyCount,
  targetId,
  targetType,
  onReplyComment,
}: ReplyListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("components.comment.replies")

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteReplies({
    parentId,
    enabled: isOpen,
  })

  const replies = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data?.pages])
  const replyIds = useMemo(() => replies.map((reply) => reply.id), [replies])

  const { data: dataReactions } = useBatchReactions({
    targetIds: replyIds,
    targetType: "comment",
  })

  const isAnyLoading = isLoading || isFetchingNextPage

  if (replyCount <= 0) return null

  return (
    <div className="ml-9 flex flex-col gap-2 md:ml-11">
      {/* TRIGGER: VIEW REPLIES */}
      {!isOpen && (
        <div className="flex items-center gap-3">
          <div className="bg-neutral-high h-[1.5px] w-6" />
          <button
            onClick={() => setIsOpen(true)}
            className="flex w-fit cursor-pointer items-center gap-1 text-xs font-semibold text-neutral-600 transition-colors duration-300 ease-in-out hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            {t("view", { count: replyCount })}
            <LuChevronDown />
          </button>
        </div>
      )}

      {/* LIST REPLIES */}
      {isOpen && (
        <ul className="flex flex-col gap-5 pt-2">
          {replies.map((reply, index) => {
            const dataReaction = dataReactions?.[reply.id]
            const reactionSummary = dataReaction?.summary || null
            const userReaction = dataReaction?.userReaction || null
            return (
              <CommentItem
                key={index}
                comment={reply}
                targetId={targetId}
                targetType={targetType}
                isReply={true}
                reactionSummary={reactionSummary}
                userReaction={userReaction}
                onReplyComment={onReplyComment}
              />
            )
          })}
        </ul>
      )}

      {/* FOOTER: LOADING & CONTROLS */}
      {isOpen && (
        <div className="flex items-center gap-3">
          <div className="bg-neutral-high h-[1.5px] w-6" />

          <div className="flex items-center gap-4">
            {isAnyLoading ? (
              <div className="text-primary flex items-center gap-1 text-xs font-semibold">
                <MiracleLoader size={14} />
                <span>{t("fetching")}</span>
              </div>
            ) : (
              <>
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    className="flex w-fit cursor-pointer items-center gap-1 text-xs font-semibold text-neutral-600 transition-colors duration-300 ease-in-out hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                  >
                    {t("loadMore", { count: replyCount - replies.length })}
                    <LuChevronDown className="h-3 w-3" />
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="flex w-fit cursor-pointer items-center gap-1 text-xs font-semibold text-neutral-600 transition-colors duration-300 ease-in-out hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                >
                  {t("hide")}
                  <LuChevronUp className="h-3 w-3" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
