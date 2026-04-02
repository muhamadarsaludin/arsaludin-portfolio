"use client"

import { CommentData } from "@/features/shared/types/comments"
import { useAuth } from "@/providers/AuthProvider"
import { getInitials } from "@/utils/initials"
import { timeAgo } from "@/utils/time-ago"
import { useLocale, useTranslations } from "next-intl"
import { LuUserRound } from "react-icons/lu"

type CommentItemProps = {
  item: CommentData
}

export default function CommentItem({ item }: CommentItemProps) {
  const locale = useLocale()
  const initials = getInitials(item.author.full_name)
  const {user, profile} = useAuth()
  const t = useTranslations("components.comment")

  return (
    <div className="flex gap-3">
      {/* Avatar Section */}
      {item.author?.avatar_url ? (
        <img
          src={item.author.avatar_url}
          alt={item.author.full_name || "Avatar"}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold bg-blue text-primary-inv">
          {initials}
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col gap-0.5 group/comment">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">
            {item.author.full_name}
          </span>
          { user?.id === item.author.id && (
            <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-blue bg-blue-100 dark:bg-blue-950">
              {t("authorLabel")}
            </span>
          )}
          {item.author.role === "admin" && (
            <span className="rounded px-1.5 py-0.5 text-[10px] font-bold text-green bg-green-100 dark:bg-green-950 flex gap-0.5 items-center">
              <LuUserRound/>
              Admin
            </span>
          )}
        </div>
        <p className="text-sm text-secondary">
          {item.reply_profile && <span className="text-blue">@{item.reply_profile.full_name}</span>} {item.content}
        </p>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-neutral-500">{timeAgo(item.created_at, locale)}</span>
          <button className="text-xs font-bold text-neutral-500 cursor-pointer">{t("reply")}</button>
          {(profile?.role === "admin" || (user?.id === item.author.id)) &&
            <button className="text-xs font-bold text-neutral-500 cursor-pointer opacity-0 group-hover/comment:opacity-100 transition-opacity ease-in-out duration-300">
              •••
            </button> 
          }
        </div>
      </div>
    </div>
  )
}