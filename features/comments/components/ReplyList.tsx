import { useState } from "react"
import CommentItem from "./CommentItem"
import type { CommentData, CommentTargetType } from "../types/comments.types"
import { LuChevronDown, LuChevronUp } from "react-icons/lu"
import { useReplies } from "../hooks/useReplies"
import MiracleLoader from "@/components/miracle/Loader"
import { useTranslations } from "next-intl"

type ReplyListProps = {
  parentId: string
  repliesCount: number
  targetId: string
  targetType: CommentTargetType
  onReplyComment?: (repliedComment: CommentData) => void
}

export default function ReplyList({
  parentId,
  repliesCount,
  targetId,
  targetType,
  onReplyComment,
}: ReplyListProps) {
  const [isOpen, setIsOpen] = useState(false)

  const t = useTranslations("components.comment.replies")

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useReplies({
    parentId,
    enabled: isOpen,
  })

  const allReplies: CommentData[] = data?.pages.flatMap((page) => page.data) ?? []

  if (repliesCount <= 0) return null

  return (
    <div className="ml-11 flex flex-col gap-2">
      {/* 1. MAIN TOGGLE OPEN REPLIES */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="text-blue flex w-fit cursor-pointer items-center gap-2 text-xs font-semibold"
        >
          <div className="bg-blue h-[1px] w-6" />
          {t("showCount", { count: repliesCount })}
          <LuChevronDown className="h-3 w-3" />
        </button>
      )}

      {/* 2. LOADING */}
      {isOpen && isLoading && allReplies.length === 0 && (
        <div className="text-secondary flex items-center gap-2 py-2 text-xs">
          <MiracleLoader size={14} />
          {t("fetching")}
        </div>
      )}

      {/* 3. REPLY LIST */}
      {isOpen && (
        <div className="flex flex-col gap-4 pt-2">
          {allReplies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              targetId={targetId}
              targetType={targetType}
              onReplyComment={onReplyComment}
            />
          ))}
        </div>
      )}

      {/* 4. FOOTER CONTROLS */}
      {isOpen && (
        <div className="flex flex-col gap-3">
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-secondary hover:text-blue ml-8 flex items-center gap-2 text-xs font-bold transition-colors disabled:opacity-50"
            >
              {isFetchingNextPage ? (
                <>
                  <MiracleLoader size={12} /> {t("fetchingMore")}
                </>
              ) : (
                t("loadMore")
              )}
            </button>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="text-blue flex w-fit cursor-pointer items-center gap-2 text-xs font-semibold"
          >
            <div className="bg-blue h-[1px] w-6" />
            {t("hide")}
            <LuChevronUp className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}
