import { useState } from "react"
import CommentItem from "./CommentItem"
import { CommentData, CommentTargetType } from "../types/comments"
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

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
  } = useReplies({ 
    parentId, 
    enabled: isOpen
  })

  const allReplies: CommentData[] = data?.pages.flatMap((page) => page.data) ?? []
  
  if (repliesCount <= 0) return null

  return(
    <div className="ml-11 flex flex-col gap-2">
      {/* 1. MAIN TOGGLE OPEN REPLIES */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold text-blue cursor-pointer w-fit"
        >
          <div className="h-[1px] w-6 bg-blue" />
          {/* Pakai pluralization logic */}
          {t("showCount", { count: repliesCount })}
          <LuChevronDown className="h-3 w-3" />
        </button>
      )}

      {/* 2. LOADING AWAL */}
      {isOpen && isLoading && allReplies.length === 0 && (
        <div className="flex items-center gap-2 py-2 text-xs text-secondary">
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
          {/* Tombol Muat Lebih Banyak */}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="flex items-center gap-2 text-xs font-bold text-secondary ml-8 hover:text-blue disabled:opacity-50 transition-colors"
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

          {/* Tombol Sembunyikan */}
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-xs font-semibold text-blue cursor-pointer w-fit"
          >
            <div className="h-[1px] w-6 bg-blue" />
            {t("hide")}
            <LuChevronUp className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}