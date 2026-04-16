import React, { useState } from "react"
import type { Reaction } from "../types/reactions.types"
import Image from "next/image"
import { getInitials } from "@/utils/initials"
import { LuUserRound } from "react-icons/lu"
import { useLocale, useTranslations } from "next-intl"
import { formatDate } from "@/utils/format-date"
import { timeAgo } from "@/utils/time-ago"

export default function ReactionItem({ reaction }: { reaction: Reaction }) {
  const [authorAvatar, setAuthorAvatar] = useState(reaction.author.avatar_url || "/dummy.webp")
  const initials = getInitials(reaction.author.full_name)
  const locale = useLocale()
  const t = useTranslations("components.reaction.modal")

  return (
    <li className="flex flex-col gap-2 transition-opacity">
      <div className="group/reaction flex items-center justify-between gap-5">
        <div className="flex flex-1 gap-4 items-center">
          <div className="bg-blue text-primary-inv relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
            {reaction.author.avatar_url ? (
              <Image
                src={authorAvatar}
                alt={reaction.author.full_name}
                fill
                sizes="32px"
                className="object-cover"
                onError={() => setAuthorAvatar("/dummy.webp")}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-bold">
                {initials}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-primary font-semibold">{reaction.author.full_name}</h3>
              {reaction.author.role === "admin" && (
                <span className="bg-blue text-primary-inv inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase">
                  <LuUserRound size={10} />
                  {reaction.author.role}
                </span>
              )}
            </div>
            <p className="text-secondary text-sm">
              {t("timestamp", { timestamp: formatDate({ date: reaction.created_at, locale: locale, dateStyle: "medium" })})}
            </p>
          </div>
        </div>
        <p className="text-2xl">{reaction.emoji}</p>
      </div>
    </li>
  )
}
