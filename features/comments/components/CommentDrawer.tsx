"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { useTranslations } from "next-intl"
import MiracleDrawer from "@/components/miracle/Drawer"
import MiracleLoader from "@/components/miracle/Loader"
import CommentList from "./CommentList"
import CommentInput from "./CommentInput"
import { useInfiniteComments } from "../hooks/useInfiniteComments"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import type { CommentData, CommentTargetType } from "../types/comments.types"

type CommentDrawerProps = {
  isOpen: boolean
  targetId: string
  targetType: CommentTargetType
  commentCount: number
  onClose: () => void
}

export default function CommentDrawer({
  isOpen,
  targetId,
  targetType,
  commentCount,
  onClose,
}: CommentDrawerProps) {
  const t = useTranslations("components.comment.drawer")
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [repliedComment, setRepliedComment] = useState<CommentData | null>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteComments({
    targetId,
    targetType,
    enabled: isOpen,
  })

  const allComments = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data?.pages])
  const { isMobile } = useMediaQuery()

  useEffect(() => {
    if (!isOpen) setRepliedComment(null)
  }, [isOpen, targetId])

  useIntersectionObserver({
    targetRef: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage && isOpen,
  })

  return (
    <MiracleDrawer
      isOpen={isOpen}
      onClose={onClose}
      position={isMobile ? "bottom" : "right"}
      size={isMobile ? 500 : 600}
      title={`${t("title")} (${commentCount})`}
      footer={
        <CommentInput
          targetId={targetId}
          targetType={targetType}
          repliedComment={repliedComment}
          onClearReply={() => setRepliedComment(null)}
        />
      }
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <MiracleLoader size={40} />
              <p className="text-secondary text-sm font-medium">{t("isFetching")}</p>
            </div>
          ) : (
            <>
              <CommentList
                targetId={targetId}
                targetType={targetType}
                comments={allComments}
                onReplyComment={setRepliedComment}
              />
              <div ref={loadMoreRef} className="min-h-6 py-4">
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center gap-2 text-sm text-secondary">
                    <MiracleLoader size={16} />
                    <span>{t("isFetching")}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </MiracleDrawer>
  )
}