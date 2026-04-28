"use client"

import { useState } from "react"
import clsx from "clsx"
import Image from "next/image"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import { useLocale } from "next-intl"
import { useTranslations } from "use-intl"
import { Testimonial } from "../types/testimonials.types"
import { getInitials } from "@/utils/initials"
import MiracleTooltip from "@/components/miracle/Tooltip"
import { LuInfo } from "react-icons/lu"
import { FaLinkedin } from "react-icons/fa6"
import Quote from "./Quote"

export default function TestimonialCard({ testimonial, className }: { testimonial: Testimonial, className?: string}) {
  const t = useTranslations("components.testimonialCard")
  const [avatar, setAvatar] = useState(testimonial.avatar_url || "/dummy.webp")
  const initials = getInitials(testimonial.name)

  return (
    <div className={clsx(
        "relative flex flex-col",
        className
      )}>
      <div className="p-4 border border-primary rounded-md flex-1 bg-primary-inv relative flex flex-col gap-2">
        <Quote className="text-primary-inv text-2xl"/>
        <p className="text-secondary-inv text-sm">
          "{testimonial.content}"
        </p>
        {/* Rectangle */}
        <div
          className={clsx(
            "absolute z-1 h-3 w-3 rotate-45",
            "bg-primary-inv",
            "-bottom-1.5 left-4"
          )}
        />
      </div>
      <div className="flex items-center justify-between gap-4 pt-4">
        <div className="flex gap-2 items-center min-w-0">
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
              <div className="flex h-full w-full items-center justify-center text-primary-inv bg-blue font-semibold">
                {initials}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-primary text-md font-semibold tracking-tight line-clamp-1">
              {testimonial.name}
            </p>
            <div className="flex items-center gap-1">
              <p className="text-secondary text-sm tracking-tight line-clamp-1">
                {testimonial.role} {t("at")} {testimonial.company}
              </p>
              {testimonial.additional_info && (
                <MiracleTooltip
                  className="shrink-0"
                  trigger={
                    <LuInfo className="text-sm text-blue hover:scale-110 transition-all duration-300 ease-in-out" />
                  }>
                    <div className="max-w-45">
                      {testimonial.additional_info}
                    </div>
                </MiracleTooltip>
              )}
            </div>
          </div>
        </div>
        <div className="shrink-0 flex gap-1 items-center">
          {testimonial.linkedin && (
            <a 
              href={testimonial.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={`View ${testimonial.name}'s LinkedIn profile`}
              className="flex items-center justify-center cursor-pointer hover:scale-105 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 hover:dark:text-blue-400 transition-all duration-300 ease-in-out p-1">
              <FaLinkedin size={20}/>
            </a>
          )}
          <ReactionGroup
            targetId={testimonial.id}
            targetType="testimonial"
            initialSummary={testimonial.reaction_summary}
          />
        </div>
        
      </div>
    </div>
  )
}