"use client"

import React from "react"
import MiracleTooltip from "../miracle/Tooltip"
import { signOut } from "@/features/auth/services/authService"
import { LuLogOut, LuUserRound } from "react-icons/lu"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useAuth } from "@/providers/AuthProvider"
import MiracleBadge from "../miracle/Badge"

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
  const { profile } = useAuth()
  const t = useTranslations("components.header")

  if (!profile) return null

  const initials = getInitials(profile.full_name)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <MiracleTooltip
      defaultPosition="bottom-center"
      hoverContent
      noPadding
      trigger={
        profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.full_name}
            width={32}
            height={32}
            unoptimized
            referrerPolicy="no-referrer"
            className="border-primary h-8 w-8 rounded-full border object-cover"
          />
        ) : (
          <div className="text-primary-inv border-primary flex h-8 w-8 items-center justify-center rounded-full border font-semibold bg-blue">
            {initials || "?"}
          </div>
        )
      }
    >
      <div className="m-1 flex cursor-pointer flex-col">
        <div className="border-primary border-b p-2 text-sm font-medium">
          <MiracleBadge className="mb-2" startIcon={<LuUserRound />}>
            <span className="capitalize">{profile.role}</span>
          </MiracleBadge>
          <h3 className="text-primary-inv truncate font-semibold">{profile.full_name}</h3>
          <p className="text-secondary-inv mt-0.5 text-xs font-normal">{profile.email}</p>
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
