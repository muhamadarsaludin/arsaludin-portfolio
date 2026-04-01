"use client"

import React, { useState, useCallback } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useTranslations } from 'next-intl'
import { LuCircleFadingPlus } from 'react-icons/lu'
import MiracleTooltip from '@/components/miracle/Tooltip'
import EmojiPicker from 'emoji-picker-react'
import { signInWithGoogle } from '@/features/auth/services/authService'
import MiraclePopover from '@/components/miracle/Popover'

function ReactionButtonAuth() {
  const t = useTranslations("components.reaction")
  
  const handleOnClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    await signInWithGoogle()
  }

  return (
    <MiracleTooltip
      trigger={
        <button
          className="cursor-pointer p-1 group/reaction-picker"
          onClick={handleOnClick}
        >
          <LuCircleFadingPlus
            size={20}
            className="text-secondary transition-transform group-hover/reaction-picker:scale-110 duration-300"
          />
        </button>
      }
      noPadding
    >
      <span className="flex p-2 text-xs font-medium text-nowrap">
        {t("tooltip.auth")}
      </span>
    </MiracleTooltip>
  )
}

export default function ReactionPicker() {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const { isSignedIn } = useAuth()

  const handleEmojiClick = useCallback((emojiData: any) => {
    console.log("Selected emoji:", emojiData.emoji)
    // Logic submit reaction here
    setIsPickerOpen(false) 
  }, [])

  if (!isSignedIn) {
    return <ReactionButtonAuth />
  }

  return (
    <MiraclePopover
      open={isPickerOpen}
      onOpenChange={setIsPickerOpen}
      showArrow={false}
      noBackground
      trigger={
        <div className="group/reaction-picker cursor-pointer p-1">
          <LuCircleFadingPlus
            size={20}
            className="text-secondary transition-transform duration-300 group-hover/reaction-picker:scale-110"
          />
        </div>
      }
      noPadding
    >
      <div className="min-w-[350px]">
        <EmojiPicker
          skinTonesDisabled
          onEmojiClick={handleEmojiClick}
        />
      </div>
    </MiraclePopover>
  )
}