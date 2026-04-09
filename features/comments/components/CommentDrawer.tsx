"use client"

import { useRef, useState } from "react"
import MiracleDrawer from "@/components/miracle/Drawer"
import CommentList from "./CommentList"
import MiracleLoader from "@/components/miracle/Loader"
import { useComments } from "../hooks/useComments"
import type { CommentData, CommentTargetType } from "../types/comments.types"
import { useTranslations } from "next-intl"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import CommentInput from "./CommentInput"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useComments({
    targetId,
    targetType,
    enabled: isOpen,
  })

  const allComments: CommentData[] = data?.pages.flatMap((page) => page.data) ?? []
  const { breakpoint } = useMediaQuery()
  const drawerPosition = ["default"].includes(breakpoint) ? "bottom" : "right"
  const drawerSize = ["default"].includes(breakpoint) ? 550 : 450
  const [repliedComment, setRepliedComment] = useState<CommentData | null>(null)

  useIntersectionObserver({
    targetRef: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage && isOpen,
  })

  const handleReplyComment = (comment: CommentData) => {
    setRepliedComment(comment)
  }

  const handleClearReply = () => {
    setRepliedComment(null)
  }

  return (
    <MiracleDrawer
      isOpen={isOpen}
      onClose={onClose}
      position={drawerPosition}
      size={drawerSize}
      title={`Komentar (${commentCount})`}
      footer={
        <CommentInput
          targetId={targetId}
          targetType={targetType}
          repliedComment={repliedComment}
          onClearReply={handleClearReply}
        />
      }
    >
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <MiracleLoader size={40} />
                <p className="text-secondary item-center flex w-full justify-center gap-1.5 py-4 text-sm font-medium">
                  <span>{t("isFetching")}</span>
                </p>
              </div>
            </div>
          ) : (
            <>
              <CommentList
                targetId={targetId}
                targetType={targetType}
                comments={allComments}
                onReplyComment={handleReplyComment}
              />

              <div ref={loadMoreRef} className="w-full">
                {hasNextPage && (
                  <div className="text-secondary item-center flex w-full justify-center gap-1.5 py-4 text-sm font-medium">
                    <MiracleLoader size={18} />
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
