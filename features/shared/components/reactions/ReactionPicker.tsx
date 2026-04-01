"use client"

import React, { useState, useCallback } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useTranslations } from 'next-intl'
import { LuCircleFadingPlus } from 'react-icons/lu'
import MiracleTooltip from '@/components/miracle/Tooltip'
import { signInWithGoogle } from '@/features/auth/services/authService'
import MiraclePopover from '@/components/miracle/Popover'
// 1. Import dynamic dari next
import dynamic from 'next/dynamic'

// 2. Load EmojiPicker secara dynamic
// ssr: false wajib karena library ini butuh object 'window'
const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <div className="w-[350px] h-[400px] flex items-center justify-center bg-surface-secondary rounded-lg border border-primary animate-pulse">
      <span className="text-xs text-secondary font-medium">Loading Picker...</span>
    </div>
  ),
})

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
      noArrow
      noBackground
      noShadow
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
        {isPickerOpen && (
          <EmojiPicker
            skinTonesDisabled
            onEmojiClick={handleEmojiClick}
            // Tambahin props theme biar sinkron sama app lo (optional)
            // theme={"auto" as any} 
          />
        )}
      </div>
    </MiraclePopover>
  )
}