"use client"

import React, { useState, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import { LuCircleFadingPlus } from "react-icons/lu"
import { useTranslations } from "next-intl"
import { Theme } from "emoji-picker-react"
import clsx from "clsx"

import { useAuth } from "@/providers/AuthProvider"
import { useTheme } from "@wrksz/themes/client"
import { signInWithGoogle } from "@/features/auth/services/authService"

import MiracleTooltip from "@/components/miracle/Tooltip"
import MiraclePopover from "@/components/miracle/Popover"
import MiracleLoader from "@/components/miracle/Loader"
import type { ReactionSummary } from "../types/reactions"

// Dynamically import EmojiPicker to improve initial bundle size and performance
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="bg-primary border-primary flex h-[400px] w-[350px] items-center justify-center rounded-lg border shadow-xl">
      <MiracleLoader size={40} />
    </div>
  ),
})

type ReactionPickerProps = {
  reactionSummary: ReactionSummary
  onSelectReaction: (emoji: string) => void
}

export default function ReactionPicker({ 
  reactionSummary, 
  onSelectReaction 
}: ReactionPickerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const { theme } = useTheme()
  const t = useTranslations("components.reaction")

  const pickerTheme = useMemo(() => 
    theme === "dark" ?  Theme.LIGHT : Theme.DARK
  , [theme])

  const handleEmojiClick = useCallback((emojiData: any) => {
    onSelectReaction(emojiData.emoji)
    setIsPickerOpen(false)
  }, [onSelectReaction])

  const PickerToggle = ({ onClick }: { onClick?: React.MouseEventHandler }) => (
    <MiracleTooltip
      noPadding
      trigger={
        <button 
          onClick={onClick}
          type="button"
          className="group/reaction-picker cursor-pointer outline-none flex items-center gap-1"
        >
          <div className="relative p-1">
            <LuCircleFadingPlus
              size={20}
              className="text-secondary transition-all duration-300 ease-in-out group-hover/reaction-picker:scale-110"
            />
            <span
              className={clsx(
                "absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-red",
                "transition-opacity duration-300",
                reactionSummary.userReaction ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
          {reactionSummary.totalReactions > 0 && 
            <span className="text-secondary text-sm font-medium">{reactionSummary.totalReactions}</span>
          }
        </button>
      }
    >
      <span className="flex p-2 text-xs font-medium whitespace-nowrap">
        {isSignedIn ?
         reactionSummary.userReaction 
          ? t("tooltip.edit") : t("tooltip.add") 
          : t("tooltip.auth")}
      </span>
    </MiracleTooltip>
  )

  if (!isSignedIn) {
    return (
      <PickerToggle 
        onClick={async (e) => {
          e.preventDefault()
          await signInWithGoogle()
        }} 
      />
    )
  }

  return (
    <MiraclePopover
      open={isPickerOpen}
      onOpenChange={setIsPickerOpen}
      noArrow
      noBackground
      noShadow
      noPadding
      trigger={<PickerToggle />}
    >
      <div className="min-w-[350px] overflow-hidden rounded-lg shadow-2xl">
        {isPickerOpen && (
          <EmojiPicker
            theme={pickerTheme}
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