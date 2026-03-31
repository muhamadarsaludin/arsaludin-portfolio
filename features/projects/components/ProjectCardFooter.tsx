import clsx from 'clsx'
import React, { useState, useRef, useEffect } from 'react'
import MiracleTooltip from '@/components/miracle/Tooltip'
import MiracleBadge from '@/components/miracle/Badge'
import EmojiPicker from 'emoji-picker-react'
import { LuCircleFadingPlus, LuMessageCircleMore } from 'react-icons/lu'
import { useAuth } from '@/providers/AuthProvider'
import { useTranslations } from 'next-intl'
import { ProjectReactionSummary } from '@/features/projects/services/projects' // Assuming this type exists

interface ProjectCardFooterProps {
  reactionSummary: ProjectReactionSummary;
  commentsCount: number;
}

export default function ProjectCardFooter({ reactionSummary, commentsCount }: ProjectCardFooterProps) {
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
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleReactionClick = async () => {
    if (!isSignedIn) {
      // Jika pengguna belum login, panggil fungsi signIn.
      // Implementasi signIn() akan tergantung pada AuthProvider Anda (misalnya, redirect ke halaman login atau membuka modal).
      console.log("User not signed in. Initiating sign-in process for reaction.");
      await signIn(); 
    } else {
      setShowEmojiPicker((prev) => !prev);
    }
  };

  const handleCommentClick = async () => {
    if (!isSignedIn) {
      console.log("User not signed in. Initiating sign-in process for comment.");
      await signIn();
    } else {
      console.log("User signed in. Opening comment section/modal.");
      // TODO: Implementasi fungsionalitas komentar yang sebenarnya (misalnya, membuka modal komentar, navigasi ke bagian komentar)
    }
  };

  return (
    <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-primary bg-surface-secondary rounded-b-2xl">
      {/* Left Side: Reactions */}
      <div className="flex items-center gap-1">
        {reactionSummary.total > 0 &&
          <MiracleTooltip
            trigger={
              <div className="relative z-20 flex items-center -space-x-2 cursor-help">
                {reactionSummary?.top.map((reaction, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "flex items-center justify-center w-7 h-7 rounded-full bg-surface-secondary border-2 border-primary shadow-sm",
                      zIndexClasses[index]
                    )}
                  >
                    <span className="text-xs">{reaction.emoji}</span>
                  </div>
                ))}
                <div
                  className="flex items-center justify-center h-7 min-w-7 px-1 rounded-full bg-surface-secondary border-2 border-primary shadow-sm z-13"
                >
                  <span className="text-xs font-bold text-secondary">+{reactionSummary.remaining}</span>
                </div>
              </div>
            }
            noPadding
            hoverContent
          >
            <div className="flex gap-1 flex-wrap p-2 max-w-[150px] cursor-help">
              {reactionSummary.all.map((reaction, index) => (
                <MiracleBadge key={index}>
                  {reaction.emoji} {reaction.count}
                </MiracleBadge>
              ))}
              {
                reactionSummary.isLimit &&
                <MiracleBadge>
                  •••
                </MiracleBadge>
              }
            </div>
          </MiracleTooltip>
        }

        <div className="relative z-20 flex items-center" ref={pickerRef}>
          <MiracleTooltip
            trigger={
              <button
                className="group p-1 cursor-pointer"
                onClick={handleReactionClick} // Menggunakan handler baru
              >
                <LuCircleFadingPlus
                  size={20}
                  className="text-secondary group-hover:scale-110 transition-transform"
                />
              </button>
            }
            noPadding
          >
            <span className="flex text-nowrap text-xs font-medium p-2">{isSignedIn ? t("reaction-tooltip.default") : t("reaction-tooltip.auth")}</span>
          </MiracleTooltip>

          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2 z-50">
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
        {reactionSummary.total > 0 &&
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-primary">
            {reactionSummary?.total}
          </span>
        }
      </div>
      {/* Right Side: Comments */}
      <div className="flex items-center gap-1">
        <MiracleTooltip
          trigger={
            <button className="relative z-20 group p-1 cursor-pointer" onClick={handleCommentClick}> {/* Menambahkan onClick */}
              <LuMessageCircleMore
                size={20}
                className="text-secondary group-hover:scale-110 transition-transform"
              />
            </button>
          }
          noPadding
        >
          <span className="flex text-nowrap text-xs font-medium p-2">{isSignedIn ? t("comment-tooltip.default") : t("comment-tooltip.auth")}</span>
        </MiracleTooltip>
        {commentsCount > 0 && (
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-primary">
            {commentsCount} <span className="hidden xs:inline">comments</span>
          </span>
        )}
      </div>
    </div>
  )
}