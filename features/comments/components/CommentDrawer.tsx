import MiracleDrawer from "@/components/miracle/Drawer"
import CommentList from "./CommentList"
import MiracleLoader from "@/components/miracle/Loader"
import { useComments } from "../hooks/useComments"
import { CommentData, CommentTargetType } from "../types/comments"
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
  isOpen, targetId, targetType, commentCount, onClose 
}: CommentDrawerProps) {
  const t = useTranslations("components.comment.drawer")
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
  } = useComments({ targetId, targetType, enabled: isOpen})
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
      }>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center justify-center">
                <MiracleLoader size={40}/>
                <p className="w-full py-4 text-secondary text-sm font-medium flex item-center justify-center gap-1.5">
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
                onReplyComment={handleReplyComment}/>

              {hasNextPage && (
                isFetchingNextPage ? (
                  <div className="w-full py-4 text-secondary text-sm font-medium flex item-center justify-center gap-1.5">
                    <MiracleLoader size={18}/>
                    <span>{t("isFetching")}</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => fetchNextPage()} 
                    className={clsx(
                      "w-full py-4 font-medium text-sm flex items-center justify-center cursor-pointer",
                      "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" 
                    )}
                  >
                    {t("seeMore")}
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </MiracleDrawer>
  )
}