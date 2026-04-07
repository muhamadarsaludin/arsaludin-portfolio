"use client"

import { useState, useCallback } from "react"
import { useTranslations, useLocale } from "next-intl"
import Image from "next/image"
import { LuTrash2, LuUserRound, LuChevronDown, LuChevronUp } from "react-icons/lu"
import clsx from "clsx"

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

type CommentItemProps = {
  comment: CommentData
  targetId: string
  targetType: CommentTargetType
  onReplyComment?: (repliedComment: CommentData) => void
}

export default function CommentItem({
  comment,
  targetId,
  targetType,
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
  }, [comment, removeComment, removeReply])

  return (
    <li
      className={clsx(
        "flex flex-col gap-2 transition-opacity",
        isDeleting && "pointer-events-none opacity-50"
      )}
    >
      <div className="group/comment flex items-start justify-between gap-4">
        <div className="flex flex-1 gap-3">
          <div className="bg-blue text-primary-inv relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
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
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-primary text-sm font-bold">{comment.author.full_name}</h3>
              {comment.author.role === "admin" && (
                <span className="bg-blue inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                  <LuUserRound size={10} />
                  {comment.author.role}
                </span>
              )}
            </div>

            <p className="text-secondary text-sm leading-relaxed">
              {comment.recipient && (
                <span className="text-blue mr-1 font-bold">@{comment.recipient.full_name}</span>
              )}
              {comment.content}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-secondary text-[11px] opacity-60">
                {timeAgo({
                  date: comment.created_at, 
                  locale
                })}
              </span>

              <button
                onClick={() => onReplyComment?.(comment)}
                className="text-secondary hover:text-blue cursor-pointer text-xs font-bold transition-colors"
              >
                {t("reply")}
              </button>

              {(isAdmin || isAuthor) && (
                <MiraclePopover
                  trigger={
                    <button className="text-secondary cursor-pointer text-xs font-bold opacity-0 transition-opacity group-hover/comment:opacity-100">
                      •••
                    </button>
                  }
                >
                  <div className="flex w-[140px] flex-col p-1">
                    <p className="text-secondary mb-2 px-2 text-[10px] font-bold uppercase">
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
      </div>

      {comment.replies_count > 0 && (
        <ReplyList
          parentId={comment.id}
          repliesCount={comment.replies_count}
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
            "{comment.content}"
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
