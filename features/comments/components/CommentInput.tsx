"use client"

import { useState } from "react"
import { useCommentMutation } from "../hooks/useCommentMutation"
import type { CommentTargetType, CommentData } from "../types/comments.types"
import { useAuth } from "@/providers/AuthProvider"
import MiracleTextField from "@/components/miracle/TextField"
import MiracleButton from "@/components/miracle/Button"
import { LuSend, LuX } from "react-icons/lu"
import { cn } from "@/utils/class-name"
import { useTranslations } from "next-intl"
import { SiGoogle } from "react-icons/si"
import { signInWithGoogle } from "@/features/auth/services/auth"
import { useReplyMutation } from "../hooks/useReplyMutation"

type CommentInputProps = {
  targetId: string
  targetType: CommentTargetType
  repliedComment: CommentData | null
  onClearReply: () => void
  className?: string
}

export default function CommentInput({
  targetId,
  targetType,
  repliedComment,
  onClearReply,
  className,
}: CommentInputProps) {
  const [commentText, setCommentText] = useState("")
  const { isSignedIn, user } = useAuth()
  const t = useTranslations("components.comment.input")

  const { add: addComment, isAdding: isAddingComment } = useCommentMutation({
    targetId,
    targetType,
  })
  const { add: addReply, isAdding: isAddingReply } = useReplyMutation({ targetId, targetType })

  const isAdding = isAddingComment || isAddingReply

  const handleSignIn = async () => {
    await signInWithGoogle()
  }

  const handleSend = () => {
    const cleanContent = commentText.trim()
    if (!cleanContent || !isSignedIn || !user) return

    if (repliedComment) {
      addReply({
        targetId: targetId,
        targetType: targetType,
        content: cleanContent,
        parentId: repliedComment.parent_id ?? repliedComment.id,
        replyToId: repliedComment.id,
        recipientId: repliedComment.author.id,
        optimisticRecipient: repliedComment.author,
      })
      onClearReply()
    } else {
      addComment({
        targetId: targetId,
        targetType: targetType,
        content: cleanContent,
        parentId: null,
        replyToId: null,
        recipientId: null,
      })
    }

    setCommentText("")
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {repliedComment && (
        <div className="bg-primary animate-in fade-in slide-in-from-bottom-2 flex items-start gap-2 duration-300">
          <div className="border-blue flex flex-1 flex-col gap-1.5 border-l-4 py-1 pl-3">
            <p className="text-secondary flex items-center gap-1 text-xs font-bold">
              {t("replyingTo")}:
              <span className="text-blue">@{repliedComment.author.full_name}</span>
            </p>
            <div className="bg-secondary w-full overflow-hidden rounded-lg p-2">
              <p className="text-secondary line-clamp-1 text-[11px] leading-relaxed italic">
                {"“"}
                {repliedComment.content}
                {"”"}
              </p>
            </div>
          </div>

          <button
            onClick={onClearReply}
            type="button"
            aria-label={t("cancelReply")}
            className="ml-auto cursor-pointer rounded-full p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <LuX size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <MiracleTextField
            placeholder={
              !isSignedIn
                ? t("loginRequired")
                : repliedComment
                  ? `${t("replyingTo")} @${repliedComment.author.full_name} ...`
                  : t("placeholder")
            }
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isAdding || !isSignedIn}
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
        </div>
        <MiracleButton
          className="shrink-0"
          onClick={handleSend}
          size="sm"
          aria-label="Send comment"
          loading={isAdding}
          disabled={!commentText.trim() || !isSignedIn}
          startIcon={<LuSend />}
          isSquare
        />
      </div>

      {!isSignedIn && (
        <MiracleButton onClick={handleSignIn} startIcon={<SiGoogle />} fullWidth>
          {t("signIn")}
        </MiracleButton>
      )}
    </div>
  )
}
