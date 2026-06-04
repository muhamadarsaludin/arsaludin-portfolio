"use client"

import type { ReactNode } from "react"
import { useRef, useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import MiracleDrawer from "@/components/miracle/Drawer"
import MiracleLoader from "@/components/miracle/Loader"
import CommentList from "./CommentList"
import CommentInput from "./CommentInput"
import { useInfiniteComments } from "../hooks/useInfiniteComments"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import type { CommentData, CommentTargetType } from "../types/comments.types"
import MiracleBadge from "@/components/miracle/Badge"
import { useBatchUserReactions } from "@/features/reactions/hooks/useBatchUserReactions"

type CommentDrawerProps = {
  isOpen: boolean
  targetId: string
  targetType: CommentTargetType
  title?: ReactNode
  commentCount: number
  onClose: () => void
}

export default function CommentDrawer({
  isOpen,
  targetId,
  targetType,
  title,
  commentCount,
  onClose,
}: CommentDrawerProps) {
  const t = useTranslations("components.comment.drawer")
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [repliedComment, setRepliedComment] = useState<CommentData | null>(null)
  const { isMobile } = useMediaQuery()

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [prevTargetId, setPrevTargetId] = useState(targetId)

  if (isOpen !== prevIsOpen || targetId !== prevTargetId) {
    setPrevIsOpen(isOpen)
    setPrevTargetId(targetId)
    if (!isOpen) {
      setRepliedComment(null)
    }
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteComments({
    targetId,
    targetType,
    enabled: isOpen,
  })

  const comments = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data?.pages])
  const commentIds = useMemo(() => comments.map((comment) => comment.id), [comments])

  const { data: userReactions } = useBatchUserReactions({ 
    targetIds: commentIds, 
    targetType: "comment"
  })

  useIntersectionObserver({
    targetRef: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage && isOpen,
  })

  const drawerPosition = isMobile ? "bottom" : "right"
  const drawerSize = isMobile ? "85vh" : 450

  return (
    <MiracleDrawer
      isOpen={isOpen}
      onClose={onClose}
      position={drawerPosition}
      size={drawerSize}
      title={title}
      description={
        <p className="flex items-center gap-1">
          <span className="text-base">{t("title")}</span>
          <MiracleBadge color="blue" variant="secondary">
            {commentCount}
          </MiracleBadge>
        </p>
      }
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
                comments={comments}
                userReactions={userReactions}
                onReplyComment={setRepliedComment}
              />
              <div ref={loadMoreRef} className="min-h-6 py-4">
                {isFetchingNextPage && (
                  <div className="text-secondary flex items-center justify-center gap-2 text-sm">
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
