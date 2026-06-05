"use client"

import { useState } from "react"
import { cn } from "@/utils/class-name"
import Image from "next/image"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import { useTranslations } from "use-intl"
import type { Testimonial } from "../types/testimonials.types"
import { getInitials } from "@/utils/initials"
import MiracleTooltip from "@/components/miracle/Tooltip"
import { LuInfo } from "react-icons/lu"
import { FaLinkedin } from "react-icons/fa6"
import Quote from "./Quote"
import type { Reaction, ReactionSummary } from "@/features/reactions/types/reactions.types"

type TestimonialCardProps = {
  className?: string
  testimonial: Testimonial
  reactionSummary: ReactionSummary | null
  userReaction: Reaction | null
}

export default function TestimonialCard({
  className,
  testimonial,
  reactionSummary,
  userReaction,
}: TestimonialCardProps) {
  const t = useTranslations("components.testimonialCard")
  const [avatar, setAvatar] = useState(testimonial.avatar_url || "/dummy.webp")
  const initials = getInitials(testimonial.name)

  return (
    <div className={cn("relative flex flex-col", className)}>
      <div className="border-primary bg-primary-inv relative flex flex-1 flex-col gap-2 rounded-md border p-4">
        <Quote className="text-primary-inv text-2xl" />
        <p className="text-secondary-inv text-sm">
          {"“"}
          {testimonial.content}
          {"”"}
        </p>
        {/* Rectangle */}
        <div
          className={cn("absolute z-1 h-3 w-3 rotate-45", "bg-primary-inv", "-bottom-1.5 left-4")}
        />
      </div>
      <div className="flex items-center justify-between gap-4 pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            {testimonial.avatar_url ? (
              <Image
                src={avatar}
                alt={testimonial.name}
                fill
                sizes="40px"
                className="object-cover"
                onError={() => setAvatar("/dummy.webp")}
              />
            ) : (
              <div className="text-primary-inv bg-blue flex h-full w-full items-center justify-center font-semibold">
                {initials}
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col">
            <p className="text-primary text-md line-clamp-1 font-semibold tracking-tight">
              {testimonial.name}
            </p>
            <div className="flex items-center gap-1">
              <p className="text-secondary line-clamp-1 text-sm tracking-tight">
                {testimonial.role} {t("at")} {testimonial.company}
              </p>
              {testimonial.additional_info && (
                <MiracleTooltip
                  className="shrink-0"
                  trigger={
                    <LuInfo className="text-blue text-sm transition-all duration-300 ease-in-out hover:scale-110" />
                  }
                >
                  <div className="max-w-45">{testimonial.additional_info}</div>
                </MiracleTooltip>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {testimonial.linkedin && (
            <a
              href={testimonial.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${testimonial.name}'s LinkedIn profile`}
              className="flex cursor-pointer items-center justify-center p-1 text-neutral-600 transition-all duration-300 ease-in-out hover:scale-105 hover:text-blue-600 dark:text-neutral-400 hover:dark:text-blue-400"
            >
              <FaLinkedin size={20} />
            </a>
          )}
          <ReactionGroup
            targetId={testimonial.id}
            targetType="testimonial"
            reactionSummary={reactionSummary}
            userReaction={userReaction}
          />
        </div>
      </div>
    </div>
  )
}
