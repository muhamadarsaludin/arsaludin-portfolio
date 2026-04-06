import MiracleDrawer from "@/components/miracle/Drawer"
import CommentList from "./CommentList"
import MiracleLoader from "@/components/miracle/Loader"
import { useComments } from "../hooks/useComments"
import type { CommentData, CommentTargetType } from "../types/comments.types"
import { useTranslations } from "next-intl"
import clsx from "clsx"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import CommentInput from "./CommentInput"
import { useState } from "react"

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

              {hasNextPage &&
                (isFetchingNextPage ? (
                  <div className="text-secondary item-center flex w-full justify-center gap-1.5 py-4 text-sm font-medium">
                    <MiracleLoader size={18} />
                    <span>{t("isFetching")}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => fetchNextPage()}
                    className={clsx(
                      "flex w-full cursor-pointer items-center justify-center py-4 text-sm font-medium",
                      "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    )}
                  >
                    {t("seeMore")}
                  </button>
                ))}
            </>
          )}
        </div>
      </div>
    </MiracleDrawer>
  )
}
