"use client"

import MiracleDrawer from "@/components/miracle/Drawer"
import CommentList from "./CommentList"
import MiracleTextField from "@/components/miracle/TextField"
import MiracleButton from "@/components/miracle/Button"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useState, useTransition, useEffect, useCallback } from "react"
import { LuSend } from "react-icons/lu"
import { useTranslations } from "next-intl"
import { addComment, getComments } from "../../services/comments"
import { useRouter } from "@/i18n/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { CommentData } from "@/features/shared/types/comments"
import MiracleLoader from "@/components/miracle/Loader"

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

  const drawerPosition = ["default"].includes(breakpoint) ? "bottom" : "right"
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

  // --- Fungsi Kirim ---
  const handleSend = async () => {
    if (!commentText.trim() || isLoading || !isSignedIn) return

    setIsSubmitting(true)
    try {
      await addComment({
        targetId,
        targetType,
        content: commentText,
        parentId: null,
        replyToId: null,
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
    }
  }

  return (
    <MiracleDrawer
      position={drawerPosition}
      isOpen={isOpen}
      onClose={onClose}
      title={`${t("title")} (${comments.length})`}
      size={450}
    >
      <div className="pb-24 p-4">
        {isFetching && comments.length === 0 ? (
          <div className="flex justify-center p-8">
            <MiracleLoader size={30} />
          </div>
        ) : (
          <CommentList comments={comments} />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center gap-3 border-t border-primary bg-primary p-4 pb-safe">
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
    </MiracleDrawer>
  )
}