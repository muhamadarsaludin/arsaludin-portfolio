"use client"

import { useState, useCallback } from "react"
import { useTranslations, useLocale } from "next-intl"
import Image from "next/image"
import { LuTrash2 } from "react-icons/lu"
import { cn } from "@/utils/class-name"

import MiracleModal from "@/components/miracle/Modal"
import MiracleButton from "@/components/miracle/Button"
import MiraclePopover from "@/components/miracle/Popover"

import { useAuth } from "@/providers/AuthProvider"
import { useCommentMutation } from "../hooks/useCommentMutation"
import { getInitials } from "@/utils/initials"
import { timeAgo } from "@/utils/time-ago"
import type { CommentData, CommentTargetType } from "../types/comments.types"
import ReplyList from "./ReplyList"
import { useReplyMutation } from "../hooks/useReplyMutation"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import MiracleBadge from "@/components/miracle/Badge"
import type { Reaction, ReactionSummary } from "@/features/reactions/types/reactions.types"

type CommentItemProps = {
  comment: CommentData
  targetId: string
  targetType: CommentTargetType
  isReply?: boolean
  commentIds: string[]
  reactionSummary: ReactionSummary | null
  userReaction: Reaction | null
  onReplyComment?: (repliedComment: CommentData) => void
}

export default function CommentItem({
  comment,
  targetId,
  targetType,
  isReply = false,
  commentIds,
  reactionSummary,
  userReaction,
  onReplyComment,
}: CommentItemProps) {
  const t = useTranslations("components.comment.item")
  const locale = useLocale()
  const { user, isSignedIn, profile } = useAuth()

  const { remove: removeComment, isRemoving: isRemovingComment } = useCommentMutation({
    targetId,
    targetType,
  })
  const { remove: removeReply, isRemoving: isRemovingReply } = useReplyMutation({
    targetId,
    targetType,
  })

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [authorAvatar, setAuthorAvatar] = useState(comment.author.avatar_url || "/dummy.webp")

  const isDeleting = isRemovingComment || isRemovingReply

  const initials = getInitials(comment.author.full_name)
  const isAuthor = user?.id === comment.author.id
  const isAdmin = profile?.role === "admin"

  const handleDeleteAction = useCallback(() => {
    if (!isSignedIn) return
    if (comment.parent_id) {
      removeReply({
        commentId: comment.id,
        parentId: comment.parent_id,
      })
    } else {
      removeComment({
        commentId: comment.id,
      })
    }
    setIsDeleteModalOpen(false)
  }, [comment, removeComment, removeReply, isSignedIn])

  return (
    <li
      className={cn(
        "flex flex-col gap-2 transition-opacity",
        isDeleting && "pointer-events-none opacity-50"
      )}
    >
      <div className="group/comment flex items-start justify-between gap-3">
        <div className="flex flex-1 gap-3">
          <div
            className={cn(
              "bg-blue text-primary-inv relative shrink-0 overflow-hidden rounded-full",
              isReply ? "h-5 w-5 md:h-6 md:w-6" : "h-6 w-6 md:h-8 md:w-8"
            )}
          >
            {comment.author?.avatar_url ? (
              <Image
                src={authorAvatar}
                alt={comment.author.full_name}
                fill
                sizes="32px"
                className="object-cover"
                onError={() => setAuthorAvatar("/dummy.webp")}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-bold">
                {initials}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <h3 className="text-primary text-sm font-semibold">{comment.author.full_name}</h3>
              {comment.author.role === "admin" && (
                <MiracleBadge color="blue" size="sm" className="capitalize">
                  {comment.author.role}
                </MiracleBadge>
              )}
            </div>

            <p className="text-secondary text-sm leading-relaxed">
              {comment.recipient && (
                <span className="text-blue mr-1">@{comment.recipient.full_name}</span>
              )}
              {comment.content}
            </p>

            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-secondary text-[11px] opacity-60">
                {timeAgo({
                  date: comment.created_at,
                  locale,
                })}
              </span>

              <button
                onClick={() => onReplyComment?.(comment)}
                className="cursor-pointer text-xs font-semibold text-neutral-600 transition-colors duration-300 ease-in-out hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
              >
                {t("reply")}
              </button>

              {(isAdmin || isAuthor) && (
                <MiraclePopover
                  trigger={
                    <button className="cursor-pointer text-xs font-semibold text-neutral-600 opacity-0 transition-all duration-300 ease-in-out group-hover/comment:opacity-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50">
                      •••
                    </button>
                  }
                >
                  <div className="flex w-35 flex-col p-1">
                    <p className="text-secondary-inv mb-2 px-2 text-[10px] font-bold uppercase">
                      {t("action")}
                    </p>
                    <MiracleButton
                      size="sm"
                      status="danger"
                      onClick={() => setIsDeleteModalOpen(true)}
                      startIcon={<LuTrash2 />}
                      className="justify-start"
                      fullWidth
                    >
                      {t("delete")}
                    </MiracleButton>
                  </div>
                </MiraclePopover>
              )}
            </div>
          </div>
        </div>
        <ReactionGroup
          targetId={comment.id}
          targetIds={commentIds}
          targetType="comment"
          reactionSummary={reactionSummary}
          userReaction={userReaction}
          tooltipPosition="left-center"
        />
      </div>

      {comment.reply_count > 0 && !isReply && (
        <ReplyList
          parentId={comment.id}
          replyCount={comment.reply_count}
          targetId={targetId}
          targetType={targetType}
          onReplyComment={onReplyComment}
        />
      )}

      {/* Modal Delete */}
      <MiracleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        status="error"
        title={t("modal.delete.title")}
        description={t("modal.delete.description")}
        size="sm"
      >
        <div className="flex flex-col gap-6 py-2">
          <div className="border-primary bg-secondary/10 text-secondary rounded-xl border p-3 text-xs italic">
            {"“"}
            {comment.content}
            {"”"}
          </div>

          <div className="flex justify-end gap-3">
            <MiracleButton onClick={() => setIsDeleteModalOpen(false)}>
              {t("modal.delete.cancel")}
            </MiracleButton>
            <MiracleButton
              status="danger"
              loading={isDeleting}
              disabled={isDeleting || !isSignedIn}
              onClick={handleDeleteAction}
              startIcon={<LuTrash2 />}
            >
              {t("modal.delete.confirm")}
            </MiracleButton>
          </div>
        </div>
      </MiracleModal>
    </li>
  )
}
