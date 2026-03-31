import clsx from "clsx"
import React, { useState, useRef, useEffect } from "react"
import MiracleTooltip from "@/components/miracle/Tooltip"
import MiracleBadge from "@/components/miracle/Badge"
import EmojiPicker from "emoji-picker-react"
import { LuCircleFadingPlus, LuMessageCircleMore } from "react-icons/lu"
import { useAuth } from "@/providers/AuthProvider"
import { useTranslations } from "next-intl"
import { ProjectReactionSummary } from "@/features/projects/services/projects" // Assuming this type exists

interface ProjectCardFooterProps {
  reactionSummary: ProjectReactionSummary
  commentsCount: number
}

export default function ProjectCardFooter({
  reactionSummary,
  commentsCount,
}: ProjectCardFooterProps) {
  const zIndexClasses = ["z-10", "z-11", "z-12"]
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("components.project-card")
  const { isSignedIn, signIn } = useAuth()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleReactionClick = async () => {
    if (!isSignedIn) {
      // Jika pengguna belum login, panggil fungsi signIn.
      // Implementasi signIn() akan tergantung pada AuthProvider Anda (misalnya, redirect ke halaman login atau membuka modal).
      console.log("User not signed in. Initiating sign-in process for reaction.")
      await signIn()
    } else {
      setShowEmojiPicker((prev) => !prev)
    }
  }

  const handleCommentClick = async () => {
    if (!isSignedIn) {
      console.log("User not signed in. Initiating sign-in process for comment.")
      await signIn()
    } else {
      console.log("User signed in. Opening comment section/modal.")
      // TODO: Implementasi fungsionalitas komentar yang sebenarnya (misalnya, membuka modal komentar, navigasi ke bagian komentar)
    }
  }

  return (
    <div className="border-primary bg-surface-secondary flex items-center justify-between rounded-b-2xl border-t px-5 py-3 sm:px-6">
      {/* Left Side: Reactions */}
      <div className="flex items-center gap-1">
        {reactionSummary.total > 0 && (
          <MiracleTooltip
            trigger={
              <div className="relative z-20 flex cursor-help items-center -space-x-2">
                {reactionSummary?.top.map((reaction, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "bg-surface-secondary border-primary flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm",
                      zIndexClasses[index]
                    )}
                  >
                    <span className="text-xs">{reaction.emoji}</span>
                  </div>
                ))}
                <div className="bg-surface-secondary border-primary z-13 flex h-7 min-w-7 items-center justify-center rounded-full border-2 px-1 shadow-sm">
                  <span className="text-secondary text-xs font-bold">
                    +{reactionSummary.remaining}
                  </span>
                </div>
              </div>
            }
            noPadding
            hoverContent
          >
            <div className="flex max-w-[150px] cursor-help flex-wrap gap-1 p-2">
              {reactionSummary.all.map((reaction, index) => (
                <MiracleBadge key={index}>
                  {reaction.emoji} {reaction.count}
                </MiracleBadge>
              ))}
              {reactionSummary.isLimit && <MiracleBadge>•••</MiracleBadge>}
            </div>
          </MiracleTooltip>
        )}

        <div className="relative z-20 flex items-center" ref={pickerRef}>
          <MiracleTooltip
            trigger={
              <button
                className="group cursor-pointer p-1"
                onClick={handleReactionClick} // Menggunakan handler baru
              >
                <LuCircleFadingPlus
                  size={20}
                  className="text-secondary transition-transform group-hover:scale-110"
                />
              </button>
            }
            noPadding
          >
            <span className="flex p-2 text-xs font-medium text-nowrap">
              {isSignedIn ? t("reaction-tooltip.default") : t("reaction-tooltip.auth")}
            </span>
          </MiracleTooltip>

          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 z-50 mb-2">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  console.log("Selected emoji:", emojiData.emoji)
                  // TODO: Add your reaction submission logic here
                  setShowEmojiPicker(false)
                }}
              />
            </div>
          )}
        </div>
        {reactionSummary.total > 0 && (
          <span className="group-hover:text-primary text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {reactionSummary?.total}
          </span>
        )}
      </div>
      {/* Right Side: Comments */}
      <div className="flex items-center gap-1">
        <MiracleTooltip
          trigger={
            <button className="group relative z-20 cursor-pointer p-1" onClick={handleCommentClick}>
              {" "}
              {/* Menambahkan onClick */}
              <LuMessageCircleMore
                size={20}
                className="text-secondary transition-transform group-hover:scale-110"
              />
            </button>
          }
          noPadding
        >
          <span className="flex p-2 text-xs font-medium text-nowrap">
            {isSignedIn ? t("comment-tooltip.default") : t("comment-tooltip.auth")}
          </span>
        </MiracleTooltip>
        {commentsCount > 0 && (
          <span className="group-hover:text-primary text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {commentsCount} <span className="xs:inline hidden">comments</span>
          </span>
        )}
      </div>
    </div>
  )
}
