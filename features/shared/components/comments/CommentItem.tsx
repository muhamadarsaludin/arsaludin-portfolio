"use client"

import MiracleButton from "@/components/miracle/Button"
import MiraclePopover from "@/components/miracle/Popover"
import { CommentData } from "@/features/shared/types/comments"
import { useAuth } from "@/providers/AuthProvider"
import { getInitials } from "@/utils/initials"
import { timeAgo } from "@/utils/time-ago"
import { useLocale, useTranslations } from "next-intl"
import { useCallback } from "react"
import { LuUserRound } from "react-icons/lu"
import ReactionGroup from "../reactions/ReactionGroup"

type CommentItemProps = {
  comment: CommentData
  onDeleteComment?: (id: number) => void
  onReplyComment?: (repliedComment: CommentData) => void
}

export default function CommentItem({ comment, onDeleteComment, onReplyComment }: CommentItemProps) {
  const t = useTranslations("components.comment")
  const locale = useLocale()
  const initials = getInitials(comment.author.full_name)
  const {user, profile} = useAuth()

  const handleDeleteComment = useCallback(() => {
    if (onDeleteComment) onDeleteComment(comment.id)
  }, [onDeleteComment])

  const handleReplyComment = useCallback(() => {
    if (onReplyComment) onReplyComment(comment)
  }, [onReplyComment])


  return (
    <div className="flex gap-4">
      <div className="flex-1 flex gap-3">
        {/* Avatar Section */}
        {comment.author?.avatar_url ? (
          <img
            src={comment.author.avatar_url}
            alt={comment.author.full_name || "Avatar"}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold bg-blue text-primary-inv">
            {initials}
          </div>
        )}

        {/* Content Section */}
        <div className="flex flex-col gap-0.5 group/comment">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary">
              {comment.author.full_name}
            </span>
            { user?.id === comment.author.id && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-blue bg-blue-100 dark:bg-blue-950">
                {t("authorLabel")}
              </span>
            )}
            {comment.author.role === "admin" && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-green bg-green-100 dark:bg-green-950 flex gap-0.5 items-center">
                <LuUserRound/>
                Admin
              </span>
            )}
          </div>
          <p className="text-sm text-secondary">
            {comment.reply_profile && <span className="text-blue">@{comment.reply_profile.full_name}</span>} {comment.content}
          </p>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-secondary">{timeAgo(comment.created_at, locale)}</span>
            <button 
              onClick={handleReplyComment}
              className="text-xs font-bold text-secondary cursor-pointer">
              {t("reply")}
            </button>
            {(profile?.role === "admin" || (user?.id === comment.author.id)) &&
              <MiraclePopover
                trigger={
                  <span className="text-xs font-bold text-neutral-500 cursor-pointer opacity-0 group-hover/comment:opacity-100 transition-opacity ease-in-out duration-300">
                    •••
                  </span> 
                }
                >
                <MiracleButton status="danger" onClick={handleDeleteComment}>
                  Delete
                </MiracleButton>
              </MiraclePopover>
            }
          </div>
        </div>
      </div>
      <ReactionGroup
        targetId={comment.id}
        targetType="comment"
        reactionSummary={comment.reaction_summary}
      />
    </div>
  )
}