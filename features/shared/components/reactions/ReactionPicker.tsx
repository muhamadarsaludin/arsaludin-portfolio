"use client"

import React, { useState, useCallback } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useTranslations } from 'next-intl'
import { LuCircleFadingPlus } from 'react-icons/lu'
import MiracleTooltip from '@/components/miracle/Tooltip'
import EmojiPicker from 'emoji-picker-react'
import { signInWithGoogle } from '@/features/auth/services/authService'

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
          className="group cursor-pointer p-1"
          onClick={handleOnClick}
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
        {t("tooltip.auth")}
      </span>
    </MiracleTooltip>
  )
}

export default function ReactionPicker() {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const { isSignedIn } = useAuth()

  const handleTogglePicker = useCallback(() => {
    setIsPickerOpen((prev) => !prev)
  }, [])

  const handleEmojiClick = useCallback((emojiData: any) => {
    console.log("Selected emoji:", emojiData.emoji)
    // TODO: Tambahkan logic submit reaction di sini
    setIsPickerOpen(false) // Menutup picker setelah emoji dipilih
  }, [])

  if (!isSignedIn) {
    return <ReactionButtonAuth />
  }

  return (
    <MiracleTooltip
      trigger={
        <button
          className="group cursor-pointer p-1"
          onClick={handleTogglePicker}
        >
          <LuCircleFadingPlus
            size={20}
            className="text-secondary transition-transform group-hover:scale-110"
          />
        </button>
      }
      noPadding
      hoverContent
    >
      <div className="min-w-[350px]">
        <EmojiPicker
          skinTonesDisabled
          onEmojiClick={(emojiData) => {
            console.log("Selected emoji:", emojiData.emoji)
            // TODO: Tambahkan logic submit reaction di sini
          }}
        />
      </div>
    </MiracleTooltip>
  )
}