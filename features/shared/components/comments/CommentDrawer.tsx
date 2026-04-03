"use client"

import MiracleDrawer from "@/components/miracle/Drawer"
import CommentList from "./CommentList"
import MiracleTextField from "@/components/miracle/TextField"
import MiracleButton from "@/components/miracle/Button"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useState, useTransition, useEffect, useCallback, use } from "react"
import { LuSend, LuX } from "react-icons/lu"
import { useTranslations } from "next-intl"
import { addComment, deleteComment, getComments } from "../../services/comments"
import { useRouter } from "@/i18n/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { CommentData } from "@/features/shared/types/comments"
import MiracleLoader from "@/components/miracle/Loader"
import MiracleBadge from "@/components/miracle/Badge"

type CommentDrawerProps = {
  isOpen: boolean
  onClose: () => void
  targetId: number
  targetType: string
}

export default function CommentDrawer({
  isOpen,
  onClose,
  targetId,
  targetType,
}: CommentDrawerProps) {
  const t = useTranslations("components.comment")
  const router = useRouter()

  const { breakpoint } = useMediaQuery()
  const { isSignedIn } = useAuth()

  const [comments, setComments] = useState<CommentData[]>([])
  const [commentText, setCommentText] = useState("")
  
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPending, startTransition] = useTransition()
  // reply
  const [repliedComment, setRepliedComment] = useState<CommentData | null>(null)



  const drawerPosition = ["default"].includes(breakpoint) ? "bottom" : "right"
  const drawerSize = ["default"].includes(breakpoint) ? 550 : 450
  const isLoading = isSubmitting || isPending

  const fetchComments = useCallback(async () => {
    setIsFetching(true)
    try {
      const data = await getComments(targetId, targetType)
      setComments(data)
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setIsFetching(false)
    }
  }, [targetId, targetType])

  useEffect(() => {
    if (isOpen) {
      fetchComments()
    }
  }, [isOpen, fetchComments])

  const handleSend = async () => {
    if (!commentText.trim() || isLoading || !isSignedIn) return

    const parentId = repliedComment 
      ? (repliedComment.parent_id ?? repliedComment.id) 
      : null;
    const replyToId = repliedComment ? repliedComment.author.id : null;
    const replyId = repliedComment ? repliedComment.id : null

    setIsSubmitting(true)
    try {
      await addComment({
        targetId,
        targetType,
        content: commentText,
        parentId: parentId,
        replyToId: replyToId,
        replyId: replyId
      })
      
      setCommentText("")
      await fetchComments() 
      
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      console.error("Failed to add comment:", error) 
    } finally {
      setIsSubmitting(false)
      setRepliedComment(null)
    }
  }

  const handleDeleteComment = async (id: number) => {
    try {
      await deleteComment(id)
      await fetchComments()
      console.log("Comment deleted successfully")
      router.refresh()
    } catch (error) {
      console.error("Failed to delete comment:", error)
    }
  }

  const handleReplyComment = async (repliedComment: CommentData) => {
    setRepliedComment(repliedComment)
  }

  const handleClearReply = () => {
    setRepliedComment(null)
  }

  return (
    <MiracleDrawer
      position={drawerPosition}
      isOpen={isOpen}
      onClose={onClose}
      title={`${t("title")} (${comments.length})`}
      size={drawerSize}
    >
      <div className="pb-20">
        {isFetching && comments.length === 0 ? (
          <div className="flex justify-center p-8">
            <MiracleLoader size={30} />
          </div>
        ) : (
          <CommentList comments={comments} onDeleteComment={handleDeleteComment} onReplyComment={handleReplyComment}/>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col">
        {/* Reply */}
        {repliedComment && 
          <div className="flex gap-2 items-center bg-primary p-4 border-t border-primary">
            <div className="flex-1 flex flex-col gap-1 border-l-2 border-blue pl-4">
              <p className="text-sm text-secondary">
                {t("replyingTo")}: <span className="text-sm text-blue text-bold">@{repliedComment.author.full_name}</span>
              </p>
              <p className="line-clamp-2 p-2 bg-secondary rounded-md w-full">
                {repliedComment.content}
              </p>
            </div>
            <button
              onClick={handleClearReply}
              className="ml-auto cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              <LuX size={16} />
            </button>
          </div>
        }
        <div className="flex items-center gap-3 border-t border-primary bg-primary p-4">
          <MiracleTextField
            placeholder={isSignedIn ? t("textField.placeholder") : "Please login..."}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isLoading || !isSignedIn}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleSend()
              }
            }}
            fullWidth
          />
          <MiracleButton 
            aria-label="Send"
            onClick={handleSend}
            loading={isLoading}
            disabled={!commentText.trim() || !isSignedIn}
            startIcon={<LuSend />}
          />
        </div>
      </div>
    </MiracleDrawer>
  )
}