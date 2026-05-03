"use client"

import { useAuth } from "@/providers/AuthProvider"
import clsx from "clsx"
import { LuTrash2, LuPin, LuReply } from "react-icons/lu"
import { getInitials } from "@/utils/initials"
import Image from "next/image"
import { use, useCallback, useState } from "react"
import MiraclePopover from "@/components/miracle/Popover"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import MiracleBadge from "@/components/miracle/Badge"
import { timeAgo } from "@/utils/time-ago"
import { useLocale, useTranslations } from "next-intl"
import { Message, MessageType } from "../types/messages.types"
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
  onReply
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
  const arrowPositionClass = isAuthor ?  "-right-[5px] bottom-3" : "-left-[5px] bottom-3"

  const handleDeleteAction = useCallback(() => {
    if (!isSignedIn) return
    remove({
      messageId: message.id,
    })
    setIsDeleteModalOpen(false)
  }, [message, remove])

  const handleViewReply = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);

    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    }
  };

  return (
    <div
      id={`message-${message.id}`}
      className={clsx(
        "flex flex-col w-full relative",
        isAuthor ? "items-end" : "items-start"
      )}
    >
      <div className={clsx(
        "group/message flex flex-col max-w-[90%] md:max-w-125 lg:max-w-140",
        isAuthor ? "items-end" : "items-start",    
        )}>
        {/* Name */}
        <div className={clsx(
          "flex items-center gap-2 mb-1.5",
          isAuthor ? "pr-11" : "pl-11",
          )}>
          <h3 className="text-primary text-sm font-semibold">{message.author.full_name}</h3>
          {message.author.role === "admin" && (
            <MiracleBadge color="blue" size="sm" className="capitalize">
              {message.author.role}
            </MiracleBadge>
          )}
        </div>
        {/* Body */}
        <div className={clsx(
          "flex gap-3 items-end",
          isAuthor ? "flex-row-reverse" : "flex-row"
          )}>
          {/* Avatar */}
          <div className="relative shrink-0 overflow-hidden rounded-full h-8 w-8 bg-blue-600">
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
          <div className={clsx("flex flex-col relative bg-secondary max-w-full p-3 rounded-md text-sm text-secondary whitespace-pre-wrap", colorClass)}>
            {/* Arrow */}
            <div
              className={clsx(
                "absolute z-1 h-2.5 w-2.5",
                colorClass,
                arrowPositionClass,
                isAuthor ? "clip-triangle rotate-225" : "rotate-45"
              )}
            />

            {/* Reply Button*/}
            <div className={clsx(
                "absolute z-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/message:opacity-100 transition-all duration-300  ease-in-out",
                isAuthor ? "-left-12" : "-right-12"
              )}>
              <MiracleTooltip
                trigger={
                  <button 
                    aria-label="Reply Message"
                    onClick={() => onReply?.(message)}
                    className={clsx(
                      "rounded-full w-8 h-8 flex justify-center items-center hover:scale-110 transition-all duration-300  ease-in-out cursor-pointer",
                      colorClass
                    )}
                  >
                    <LuReply size={18} className={clsx(isAuthor ? "scale-x-[-1]" : "")} />
                  </button>
                }
              >
                {t("reply")}
              </MiracleTooltip>
            </div>

            {/* Reply Content */}
            {(message.recipient && message.replied_message) && (
              <button
                aria-label="view reply"
                onClick={() => message.replied_message && handleViewReply(message.replied_message.id)}
                className="border-blue flex flex-1 flex-col gap-1.5 border-l-4 py-1 pl-3 cursor-pointer mb-1">
                <p className="text-secondary flex items-center gap-1 text-xs font-bold">
                  {t("replyingTo")}:
                  <span className="text-blue">@{message.recipient.full_name}</span>
                </p>
                <div className={clsx("w-full overflow-hidden rounded-lg p-2", isAuthor ? "bg-secondary" : "bg-blue-low")}>
                  <p className="text-secondary line-clamp-2 text-[11px] leading-relaxed italic text-start">
                    "{message.replied_message.content}"
                  </p>
                </div>
              </button>
            )}
            {/* Content */}
            {message.content}
          </div>
        </div>
        {/* footer */}
        <div className={clsx(
          "flex items-center pl-11 mt-0.5",
          isAuthor ? "pr-11 flex-row-reverse" : "pl-11 flex-row",
          )}>
          <ReactionGroup 
            targetId={message.id} 
            targetType="message" 
            initialSummary={message.reaction_summary} />
          <div className={clsx("flex items-center gap-2", isAuthor ? "flex-row-reverse" : "flex-row")}>
            <span className="text-secondary text-[11px] opacity-60">
              {timeAgo({
                date: message.created_at,
                locale,
              })}
            </span>

            {(isAdmin || isAuthor) && (
              <MiraclePopover
                trigger={
                  <button className="cursor-pointer text-xs font-semibold opacity-0 group-hover/message:opacity-100 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-all duration-300 ease-in-out">
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
            "{message.content}"
          </div>

          <div className="flex justify-end gap-3">
            <MiracleButton onClick={() => setIsDeleteModalOpen(false)}>
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