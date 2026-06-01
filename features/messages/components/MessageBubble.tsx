"use client"

import { useAuth } from "@/providers/AuthProvider"
import { cn } from "@/utils/class-name"
import { LuTrash2, LuReply } from "react-icons/lu"
import { getInitials } from "@/utils/initials"
import Image from "next/image"
import { useCallback, useState } from "react"
import MiraclePopover from "@/components/miracle/Popover"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import MiracleBadge from "@/components/miracle/Badge"
import { timeAgo } from "@/utils/time-ago"
import { useLocale, useTranslations } from "next-intl"
import type { Message, MessageType } from "../types/messages.types"
import MiracleTooltip from "@/components/miracle/Tooltip"
import MiracleButton from "@/components/miracle/Button"
import MiracleModal from "@/components/miracle/Modal"
import { useMessageMutation } from "../hooks/useMessageMutation"

type MessageBubbleProps = {
  messageType: MessageType
  pageSize: number
  message: Message
  onReply?: (message: Message) => void
}

export default function MessageBubble({
  messageType,
  pageSize,
  message,
  onReply,
}: MessageBubbleProps) {
  const { remove, isRemoving } = useMessageMutation({ type: messageType, pageSize })
  const { user, profile, isSignedIn } = useAuth()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [authorAvatar, setAuthorAvatar] = useState(message.author.avatar_url || "/dummy.webp")
  const isAuthor = user?.id === message.user_id
  const isAdmin = profile?.role === "admin"
  const initials = getInitials(message.author.full_name)
  const locale = useLocale()
  const t = useTranslations("components.message.bubble")
  const colorClass = isAuthor ? "bg-blue-low" : "bg-secondary"
  const arrowPositionClass = isAuthor ? "-right-[5px] bottom-3" : "-left-[5px] bottom-3"

  const handleDeleteAction = useCallback(() => {
    if (!isSignedIn) return
    remove({
      messageId: message.id,
    })
    setIsDeleteModalOpen(false)
  }, [message, remove, isSignedIn])

  const handleViewReply = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`)

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }

  return (
    <div
      id={`message-${message.id}`}
      className={cn("relative flex w-full flex-col", isAuthor ? "items-end" : "items-start")}
    >
      <div
        className={cn(
          "group/message flex max-w-[90%] flex-col md:max-w-125 lg:max-w-140",
          isAuthor ? "items-end" : "items-start"
        )}
      >
        {/* Name */}
        <div className={cn("mb-1.5 flex items-center gap-2", isAuthor ? "pr-11" : "pl-11")}>
          <h3 className="text-primary text-sm font-semibold">{message.author.full_name}</h3>
          {message.author.role === "admin" && (
            <MiracleBadge color="blue" size="sm" className="capitalize">
              {message.author.role}
            </MiracleBadge>
          )}
        </div>
        {/* Body */}
        <div className={cn("flex items-end gap-3", isAuthor ? "flex-row-reverse" : "flex-row")}>
          {/* Avatar */}
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-blue-600">
            {message.author?.avatar_url ? (
              <Image
                src={authorAvatar}
                alt={message.author.full_name}
                fill
                sizes="32px"
                className="object-cover"
                onError={() => setAuthorAvatar("/dummy.webp")}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[10px] font-black text-white uppercase">
                {initials}
              </span>
            )}
          </div>
          {/* Bubble */}
          <div
            className={cn(
              "bg-secondary text-secondary relative flex max-w-full flex-col rounded-md p-3 text-sm whitespace-pre-wrap",
              colorClass
            )}
          >
            {/* Arrow */}
            <div
              className={cn(
                "absolute z-1 h-2.5 w-2.5",
                colorClass,
                arrowPositionClass,
                isAuthor ? "clip-triangle rotate-225" : "rotate-45"
              )}
            />

            {/* Reply Button*/}
            <div
              className={cn(
                "absolute top-1/2 z-1 -translate-y-1/2 opacity-0 transition-all duration-300 ease-in-out group-hover/message:opacity-100",
                isAuthor ? "-left-12" : "-right-12"
              )}
            >
              <MiracleTooltip
                trigger={
                  <button
                    type="button"
                    aria-label="Reply Message"
                    onClick={() => onReply?.(message)}
                    className={cn(
                      "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-0 transition-all duration-300 ease-in-out outline-none select-none hover:scale-110",
                      colorClass
                    )}
                  >
                    <LuReply size={18} className={cn(isAuthor ? "scale-x-[-1]" : "")} />
                  </button>
                }
              >
                {t("reply")}
              </MiracleTooltip>
            </div>

            {/* Reply Content */}
            {message.recipient && message.replied_message && (
              <button
                type="button"
                aria-label="view reply"
                onClick={() =>
                  message.replied_message && handleViewReply(message.replied_message.id)
                }
                className="border-blue mb-1 flex flex-1 cursor-pointer flex-col gap-1.5 border-l-4 py-1 pl-3 text-start outline-none"
              >
                <p className="text-secondary flex items-center gap-1 text-xs font-bold">
                  {t("replyingTo")}:
                  <span className="text-blue">@{message.recipient.full_name}</span>
                </p>
                <div
                  className={cn(
                    "w-full overflow-hidden rounded-lg p-2",
                    isAuthor ? "bg-secondary" : "bg-blue-low"
                  )}
                >
                  <p className="text-secondary line-clamp-2 text-start text-[11px] leading-relaxed italic">
                    {"“"}
                    {message.replied_message.content}
                    {"”"}
                  </p>
                </div>
              </button>
            )}
            {/* Content */}
            {message.content}
          </div>
        </div>
        {/* footer */}
        <div
          className={cn(
            "mt-0.5 flex items-center",
            isAuthor ? "flex-row-reverse pr-11" : "flex-row pl-11"
          )}
        >
          <ReactionGroup
            targetId={message.id}
            targetType="message"
            initialSummary={message.reaction_summary}
          />
          <div
            className={cn("flex items-center gap-2", isAuthor ? "flex-row-reverse" : "flex-row")}
          >
            <span className="text-secondary text-[11px] opacity-60">
              {timeAgo({
                date: message.created_at,
                locale,
              })}
            </span>

            {(isAdmin || isAuthor) && (
              <MiraclePopover
                trigger={
                  <button
                    type="button"
                    className="cursor-pointer text-xs font-semibold text-neutral-600 opacity-0 transition-all duration-300 ease-in-out outline-none select-none group-hover/message:opacity-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                  >
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
            {message.content}
            {"”"}
          </div>

          <div className="flex justify-end gap-3">
            <MiracleButton variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              {t("modal.delete.cancel")}
            </MiracleButton>
            <MiracleButton
              status="danger"
              loading={isRemoving}
              disabled={isRemoving || !isSignedIn}
              onClick={handleDeleteAction}
              startIcon={<LuTrash2 />}
            >
              {t("modal.delete.confirm")}
            </MiracleButton>
          </div>
        </div>
      </MiracleModal>
    </div>
  )
}
