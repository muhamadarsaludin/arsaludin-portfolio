"use client"

import clsx from "clsx"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import MiracleTooltip from "@/components/miracle/Tooltip"
import MiracleBadge from "@/components/miracle/Badge"
import { Link } from "@/i18n/navigation"
import { Project } from "@/features/projects/services/projects"
import { skillIcons } from "@/features/shared/services/skills"
import { LuCircleFadingPlus, LuMessageCircleMore } from "react-icons/lu"
import EmojiPicker from "emoji-picker-react"
import { useAuth } from "@/providers/AuthProvider"
import { useTranslations } from "next-intl"
import { signInWithGoogle } from "@/features/auth/services/authService"
import { useRouter } from "@/i18n/navigation"

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter()
  const zIndexClasses = ["z-10", "z-11", "z-12"]
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("components.project-card")
  const { isSignedIn } = useAuth()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleReactionClick = async () => {
    if (!isSignedIn) {
      // Jika pengguna belum login, panggil fungsi signIn.
      // Implementasi signIn() akan tergantung pada AuthProvider Anda (misalnya, redirect ke halaman login atau membuka modal).
      console.log("User not signed in. Initiating sign-in process for reaction.")
      await signInWithGoogle()
    } else {
      setShowEmojiPicker((prev) => !prev)
    }
  }

  const handleCommentClick = async () => {
    if (!isSignedIn) {
      console.log("User not signed in. Initiating sign-in process for comment.")
      await signInWithGoogle()
    } else {
      console.log("User signed in. Opening comment section/modal.")
      // TODO: Implementasi fungsionalitas komentar yang sebenarnya (misalnya, membuka modal komentar, navigasi ke bagian komentar)
    }
  }

  return (
    <div
      // href={`/projects/${project.slug}`}
      // aria-label={project.name}
      className={clsx(
        "group relative flex w-[80vw] max-w-[300px] shrink-0 snap-start flex-col sm:w-auto sm:max-w-none",
        "border-primary rounded-2xl border"
      )}
    >
      {/* Stretched Link for entire card */}
      <Link
        href={`/projects/${project.slug}`}
        className="focus-visible:ring-primary absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-label={`Lihat detail proyek ${project.name}`}
      />

      {/* Card Image */}
      <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-t-2xl px-5 py-3 sm:px-6">
        <Image
          className="object-cover"
          src={project.thumbnail}
          alt={project.name}
          fill
          sizes="450px"
        />
      </div>
      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-primary mb-2 text-lg font-semibold md:text-xl xl:text-2xl">
          {project.name}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {project.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          {project.skills.slice(0, 7).map((skill, i) => {
            const IconComponent = skill.icon
              ? (skillIcons as Record<string, React.ElementType>)[skill.icon]
              : null
            return (
              <MiracleBadge
                key={i}
                startIcon={IconComponent && <IconComponent className="h-3.5 w-3.5" />}
              >
                {skill.name}
              </MiracleBadge>
            )
          })}
          {project.skills.length > 7 && (
            <MiracleTooltip
              trigger={
                <MiracleBadge className="relative z-20 cursor-help transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700">
                  +{project.skills.length - 7}
                </MiracleBadge>
              }
              noPadding
              hoverContent
            >
              <div className="flex max-w-[180px] flex-col gap-1 p-2 text-center text-[11px] leading-snug font-medium whitespace-normal">
                {project.skills.slice(7).map((additonalSkill, i) => {
                  const IconComponent = additonalSkill.icon
                    ? (skillIcons as Record<string, React.ElementType>)[additonalSkill.icon]
                    : null
                  return (
                    <MiracleBadge
                      key={i}
                      startIcon={IconComponent && <IconComponent className="h-3.5 w-3.5" />}
                    >
                      {additonalSkill.name}
                    </MiracleBadge>
                  )
                })}
              </div>
            </MiracleTooltip>
          )}
        </div>
      </div>
      {/* Footer - Comment & Reaction */}
      <div className="border-primary bg-surface-secondary flex items-center justify-between rounded-b-2xl border-t px-5 py-3 sm:px-6">
        {/* Left Side: Reactions */}
        <div className="flex items-center gap-1">
          {project.reaction_sumary.total > 0 && (
            <MiracleTooltip
              trigger={
                <div className="relative z-20 flex cursor-help items-center -space-x-2">
                  {project.reaction_sumary?.top.map((reaction, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "bg-surface-secondary border-primary flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm",
                        zIndexClasses[index]
                      )}
                    >
                      <span className="text-xs">{reaction.emoji}</span>
                    </div>
                  ))}
                  <div className="bg-surface-secondary border-primary z-13 flex h-7 min-w-7 items-center justify-center rounded-full border-2 px-1 shadow-sm">
                    <span className="text-secondary text-xs font-bold">
                      +{project.reaction_sumary.remaining}
                    </span>
                  </div>
                </div>
              }
              noPadding
              hoverContent
            >
              <div className="flex max-w-[150px] cursor-help flex-wrap gap-1 p-2">
                {project.reaction_sumary.all.map((reaction, index) => (
                  <MiracleBadge key={index}>
                    {reaction.emoji} {reaction.count}
                  </MiracleBadge>
                ))}
                {project.reaction_sumary.isLimit && <MiracleBadge>•••</MiracleBadge>}
              </div>
            </MiracleTooltip>
          )}

          <div className="relative z-20 flex items-center" ref={pickerRef}>
            <MiracleTooltip
              trigger={
                <button
                  className="group cursor-pointer p-1"
                  onClick={handleReactionClick} // Menggunakan handler baru
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
                {isSignedIn ? t("reaction-tooltip.default") : t("reaction-tooltip.auth")}
              </span>
            </MiracleTooltip>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 z-50 mb-2">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    console.log("Selected emoji:", emojiData.emoji)
                    // TODO: Add your reaction submission logic here
                    setShowEmojiPicker(false)
                  }}
                />
              </div>
            )}
          </div>
          {project.reaction_sumary.total > 0 && (
            <span className="group-hover:text-primary text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {project.reaction_sumary?.total}
            </span>
          )}
        </div>
        {/* Right Side: Comments */}
        <div className="flex items-center gap-1">
          <MiracleTooltip
            trigger={
              <button className="group relative z-20 cursor-pointer p-1">
                <LuMessageCircleMore
                  size={20}
                  className="text-secondary transition-transform group-hover:scale-110"
                />
              </button>
            }
            noPadding
          >
            <span className="flex p-2 text-xs font-medium text-nowrap">
              {isSignedIn ? t("comment-tooltip.default") : t("reaction-tooltip.auth")}
            </span>
          </MiracleTooltip>
          {project.comments_count > 0 && (
            <span className="group-hover:text-primary text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {project.comments_count} <span className="xs:inline hidden">comments</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
