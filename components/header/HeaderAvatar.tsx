"use client"

import React from "react"
import MiracleTooltip from "../miracle/Tooltip"
import { signOut } from "@/features/auth/services/authService"
import { LuLogOut } from "react-icons/lu"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useAuth } from "@/providers/AuthProvider"

const getInitials = (name: string) => {
  if (!name) return ""
  const words = name.trim().split(/\s+/)
  let initials = ""
  
  if (words.length === 1) {
    initials = words[0]?.[0] ?? ""
  } else if (words.length <= 3) {
    initials = (words[0]?.[0] ?? "") + (words[words.length - 1]?.[0] ?? "")
  } else {
    initials = (words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")
  }
  return initials.toUpperCase()
}

export default function HeaderAvatar() {
  const { user, isSignedIn } = useAuth()
  const t = useTranslations("components.header")

  if (!user) return null

  const userData = {
    name: user.user_metadata.full_name || "",
    email: user.email || "",
    avatarUrl: user.user_metadata.avatar_url || ""
  }

  const initials = getInitials(userData.name)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <MiracleTooltip
      defaultPosition="bottom-center"
      hoverContent
      noPadding
      trigger={
        userData.avatarUrl ? (
          <Image
            src={userData.avatarUrl}
            alt={userData.name}
            width={32}
            height={32}
            unoptimized
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover border border-primary"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-400 flex items-center justify-center text-primary-inv font-semibold border border-primary">
            {initials || "?"}
          </div>
        )
      }
    >
      <div className="flex flex-col m-1">
        <div className="p-2 text-sm font-medium border-b border-primary">
          <div className="font-semibold">{userData.name}</div>
          {userData.email && <div className="text-xs text-neutral-500 dark:text-neutral-400 font-normal mt-0.5">{userData.email}</div>}
        </div>
        <button 
          onClick={handleSignOut}
          className="mt-1 p-2 text-sm text-left hover:bg-neutral-80 dark:hover:bg-neutral-800 transition-colors flex gap-1 items-center rounded-sm cursor-pointer"
        >
          <LuLogOut />
          {t("cta.signOut")}
        </button>
      </div>
    </MiracleTooltip>
  )
}