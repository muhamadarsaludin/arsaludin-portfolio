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
import { CommentData } from "../types/comments"

type CommentItemProps = {
  comment: CommentData
  targetId: string
  targetType: string
  onReplyComment?: (repliedComment: CommentData) => void
}

export default function CommentItem({ 
  comment, 
  targetId, 
  targetType, 
  onReplyComment 
}: CommentItemProps) {
  const t = useTranslations("components.comment.item")
  const locale = useLocale()
  const { user, profile } = useAuth()
  const { remove } = useCommentMutation(targetId, targetType)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [viewReplies, setViewReplies] = useState(false)
  const [authorAvatar, setAuthorAvatar] = useState(comment.author.avatar_url || "/dummy.webp")

  const initials = getInitials(comment.author.full_name)
  const isAuthor = user?.id === comment.author.id
  const isAdmin = profile?.role === "admin"

  const handleDeleteAction = useCallback(() => {
    remove({commentId: comment.id})
    setIsDeleteModalOpen(false)
  }, [comment.id, remove])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 justify-between items-start group/comment">
        <div className="flex-1 flex gap-3">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-blue text-primary-inv">
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
              <h3 className="text-sm font-bold text-primary">
                {comment.author.full_name}
              </h3>
              {comment.author.role === "admin" && (
                <span className="inline-flex items-center gap-1 rounded bg-blue px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                  <LuUserRound size={10}/>
                  {comment.author.role}
                </span>
              )}
            </div>

            <p className="text-sm text-secondary leading-relaxed">
              {comment.recipient && (
                <span className="font-bold text-blue mr-1">@{comment.recipient.full_name}</span>
              )} 
              {comment.content}
            </p>

            <div className="flex gap-4 items-center mt-1">
              <span className="text-[11px] text-secondary opacity-60">
                {timeAgo(comment.created_at, locale)}
              </span>
              
              <button 
                onClick={() => onReplyComment?.(comment)}
                className="text-xs font-bold text-secondary hover:text-blue transition-colors cursor-pointer"
              >
                {t("reply")}
              </button>

              {(isAdmin || isAuthor) && (
                <MiraclePopover
                  trigger={
                    <button className="text-xs font-bold text-secondary opacity-0 group-hover/comment:opacity-100 transition-opacity p-1 cursor-pointer">
                      •••
                    </button> 
                  }
                >
                  <div className="flex w-[140px] flex-col p-1">
                    <p className="mb-2 px-2 text-[10px] font-bold uppercase text-secondary">
                      {t("action")}
                    </p>
                    <MiracleButton 
                      size="sm"
                      status="danger" 
                      onClick={() => setIsDeleteModalOpen(true)}
                      startIcon={<LuTrash2/>}
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
        <div className="ml-11">
          <button 
            onClick={() => setViewReplies(!viewReplies)}
            className="text-xs text-secondary font-bold cursor-pointer flex gap-1 items-center hover:text-blue transition-colors"
          >
            {!viewReplies 
              ? <>{t("viewReplies", { count: comment.replies_count })} <LuChevronDown/> </>
              : <>{t("hideReplies")} <LuChevronUp /></>
            }
          </button>
        </div>
      )}

      <MiracleModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        status="error"
        title={t("modal.delete.title")}
        description={t("modal.delete.description")}
        size="sm"
      >
        <div className="flex flex-col gap-6 py-2">
          <div className="rounded-xl border border-primary bg-secondary/10 p-3 italic text-xs text-secondary">
            "{comment.content}"
          </div>

          <div className="flex gap-3 justify-end">
            <MiracleButton 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t("modal.delete.cancel")}
            </MiracleButton>
            <MiracleButton 
              status="danger" 
              onClick={handleDeleteAction}
              startIcon={<LuTrash2/>}
            >
              {t("modal.delete.confirm")}
            </MiracleButton>
          </div>
        </div>
      </MiracleModal>
    </div>
  )
}