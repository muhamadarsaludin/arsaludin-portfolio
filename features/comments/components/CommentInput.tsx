"use client"

import { useState } from "react"
import { useCommentMutation } from "../hooks/useCommentMutation"
import { CommentTargetType, CommentData } from "../types/comments"
import { useAuth } from "@/providers/AuthProvider"
import MiracleTextField from '@/components/miracle/TextField'
import MiracleButton from '@/components/miracle/Button'
import { LuSend, LuX } from 'react-icons/lu'
import clsx from "clsx"
import { useTranslations } from "next-intl"
import { SiGoogle } from "react-icons/si"
import { signInWithGoogle } from "@/features/auth/services/authService"

type CommentInputProps = {
  targetId: string
  targetType: CommentTargetType
  repliedComment: CommentData | null
  onClearReply: () => void
  className?: string
}

export default function CommentInput({ 
  targetId, targetType, repliedComment, onClearReply, className
}: CommentInputProps) {
  const [commentText, setCommentText] = useState("")
  const { isSignedIn, user } = useAuth()
  const t = useTranslations("components.comment.input")

  const { add, isAdding } = useCommentMutation(targetId, targetType)

  const handleSignIn = async () => {
    await signInWithGoogle()
  }

  const handleSend = () => {
    const cleanContent = commentText.trim()
    if (!cleanContent || !isSignedIn || !user) return

    add({
      targetId: targetId,
      targetType: targetType,
      content: cleanContent,
      parentId: repliedComment?.parent_id ?? repliedComment?.id ?? null,
      replyToId: repliedComment?.id ?? null,
      recipientId: repliedComment?.author.id ?? null,
    })

    setCommentText("")
    onClearReply()
  }

  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      {repliedComment && (
        <div className="flex gap-2 items-start bg-primary animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex-1 flex flex-col gap-1.5 border-l-4 border-blue pl-3 py-1">
            <p className="text-xs font-bold text-secondary flex items-center gap-1">
              {t("replyingTo")}: 
              <span className="text-blue">
                @{repliedComment.author.full_name}
              </span>
            </p>
            <div className="p-2 bg-secondary rounded-lg w-full overflow-hidden">
              <p className="line-clamp-1 text-[11px] text-secondary italic leading-relaxed">
                "{repliedComment.content}"
              </p>
            </div>
          </div>
          
          <button
            onClick={onClearReply}
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
          loading={isAdding}
          disabled={!commentText.trim() || !isSignedIn}
          startIcon={<LuSend />} 
          isSquare
        />
      </div>

      {!isSignedIn && 
        <MiracleButton
          onClick={handleSignIn}
          startIcon={
            <SiGoogle/>
          }
          fullWidth>
          {t("signIn")}
        </MiracleButton>
      }
    </div>
  )
}