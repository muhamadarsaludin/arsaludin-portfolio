import React, { useState } from 'react'
import { Reaction } from '../types/reactions.types'
import Image from 'next/image'
import { getInitials } from '@/utils/initials'
import { LuUserRound } from 'react-icons/lu'
import { useLocale } from 'next-intl'
import { formatDate } from '@/utils/format-date'

export default function ReactionItem({
  reaction,
}: {reaction: Reaction}) {
  const [authorAvatar, setAuthorAvatar] = useState(reaction.author.avatar_url || "/dummy.webp")
  const initials = getInitials(reaction.author.full_name)
  const locale = useLocale()
  
  return (
    <li
      className="flex flex-col gap-2 transition-opacity py-2">
      <div className="group/reaction flex items-center justify-between gap-4">
        <div className="flex flex-1 gap-3">
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
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-primary text-sm font-bold">{reaction.author.full_name}</h3>
              {reaction.author.role === "admin" && (
                <span className="bg-blue inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                  <LuUserRound size={10} />
                  {reaction.author.role}
                </span>
              )}
            </div>
            <p className="text-secondary text-sm leading-relaxed">
              {formatDate({date: reaction.created_at, locale: locale, dateStyle: "full"})}
            </p>
          </div>
        </div>
        <p className="text-2xl">{reaction.emoji}</p>
      </div>
    </li>
  )
}
