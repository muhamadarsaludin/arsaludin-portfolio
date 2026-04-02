"use client"

import React, { useState, useCallback } from "react"
import { useAuth } from "@/providers/AuthProvider"
import { useTranslations } from "next-intl"
import { LuCircleFadingPlus } from "react-icons/lu"
import MiracleTooltip from "@/components/miracle/Tooltip"
import { signInWithGoogle } from "@/features/auth/services/authService"
import MiraclePopover from "@/components/miracle/Popover"
import MiracleLoader from "@/components/miracle/Loader"
import dynamic from "next/dynamic"
import { Theme } from "emoji-picker-react"
import { useTheme } from "@wrksz/themes/client"
import clsx from "clsx"
import { Reaction } from "../../types/reactions"

type ReactionPickerProps = {
  userReaction: Reaction | null
  onSelectReaction: (emoji: string) => void
}

function ReactionButtonAuth() {
  const t = useTranslations("components.reaction")

  const handleOnClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    await signInWithGoogle()
  }

  return (
    <MiracleTooltip
      trigger={
        <button className="group/reaction-picker cursor-pointer p-1" onClick={handleOnClick}>
          <LuCircleFadingPlus
            size={20}
            className="text-secondary transition-transform duration-300 group-hover/reaction-picker:scale-110"
          />
        </button>
      }
      noPadding
    >
      <span className="flex p-2 text-xs font-medium text-nowrap">{t("tooltip.auth")}</span>
    </MiracleTooltip>
  )
}

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="bg-primary border-primary flex h-[400px] w-[350px] items-center justify-center rounded-lg border">
      <MiracleLoader size={40} />
    </div>
  ),
})

export default function ReactionPicker({ userReaction, onSelectReaction }: ReactionPickerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const { theme } = useTheme()
  const t = useTranslations("components.reaction")

  const pickerThemeInv = theme === "dark" ? Theme.LIGHT : Theme.DARK

  const handleEmojiClick = useCallback(
    (emojiData: any) => {
      onSelectReaction(emojiData.emoji)
      setIsPickerOpen(false)
    },
    [onSelectReaction]
  )

  if (!isSignedIn) return <ReactionButtonAuth />

  return (
    <MiraclePopover
      open={isPickerOpen}
      onOpenChange={setIsPickerOpen}
      noArrow
      noBackground
      noShadow
      noPadding
      trigger={
        <MiracleTooltip
          trigger={
            <div className="group/reaction-picker relative cursor-pointer p-1">
              <LuCircleFadingPlus
                size={20}
                className="text-secondary transition-all duration-300 ease-in-out group-hover/reaction-picker:scale-110"
              />
              <span
                className={clsx(
                  "absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-red-500",
                  "ease transition-opacity duration-300",
                  userReaction ? "opacity-100" : "opacity-0"
                )}
              />
            </div>
          }
          noPadding
        >
          <span className="flex p-2 text-xs font-medium text-nowrap">{t("tooltip.default")}</span>
        </MiracleTooltip>
      }
    >
      <div className="min-w-[350px]">
        {isPickerOpen && (
          <EmojiPicker
            theme={pickerThemeInv}
            skinTonesDisabled
            onEmojiClick={handleEmojiClick}
            width={350}
            height={400}
          />
        )}
      </div>
    </MiraclePopover>
  )
}
