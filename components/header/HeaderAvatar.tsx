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
    avatarUrl: user.user_metadata.avatar_url || "",
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
            className="border-primary h-8 w-8 rounded-full border object-cover"
          />
        ) : (
          <div className="text-primary-inv border-primary flex h-8 w-8 items-center justify-center rounded-full border bg-blue-600 font-semibold dark:bg-blue-400">
            {initials || "?"}
          </div>
        )
      }
    >
      <div className="m-1 flex flex-col">
        <div className="border-primary border-b p-2 text-sm font-medium">
          <div className="text-primary-inv font-semibold">{userData.name}</div>
          {userData.email && (
            <div className="text-secondary-inv mt-0.5 text-xs font-normal">{userData.email}</div>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="text-primary-inv my-1 flex cursor-pointer items-center gap-1 rounded-sm p-2 text-left text-sm transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          <LuLogOut />
          {t("cta.signOut")}
        </button>
      </div>
    </MiracleTooltip>
  )
}
