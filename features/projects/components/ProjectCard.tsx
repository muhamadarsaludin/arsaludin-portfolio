"use client"

import clsx from 'clsx'
import React, { useState, useRef, useEffect } from 'react'
import Image from "next/image"
import MiracleTooltip from '@/components/miracle/Tooltip'
import MiracleBadge from '@/components/miracle/Badge'
import { Link } from '@/i18n/navigation'
import { Project } from '@/features/projects/services/projects'
import { skillIcons } from '@/features/shared/services/skills'
import { LuCircleFadingPlus, LuMessageCircleMore } from 'react-icons/lu'
import EmojiPicker from 'emoji-picker-react'
import { useAuth } from '@/providers/AuthProvider'
import { useTranslations } from 'next-intl'
import { signInWithGoogle } from "@/features/auth/services/authService";
import { useRouter } from '@/i18n/navigation'

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
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleReactionClick = async () => {
    if (!isSignedIn) {
      // Jika pengguna belum login, panggil fungsi signIn.
      // Implementasi signIn() akan tergantung pada AuthProvider Anda (misalnya, redirect ke halaman login atau membuka modal).
      console.log("User not signed in. Initiating sign-in process for reaction.");
      await signInWithGoogle(); 
    } else {
      setShowEmojiPicker((prev) => !prev);
    }
  };

  const handleCommentClick = async () => {
    if (!isSignedIn) {
      console.log("User not signed in. Initiating sign-in process for comment.");
      await signInWithGoogle();
    } else {
      console.log("User signed in. Opening comment section/modal.");
      // TODO: Implementasi fungsionalitas komentar yang sebenarnya (misalnya, membuka modal komentar, navigasi ke bagian komentar)
    }
  };

  return (
    <div
      // href={`/projects/${project.slug}`}
      // aria-label={project.name}
      className={clsx(
        "relative group flex flex-col w-[80vw] max-w-[300px] sm:w-auto sm:max-w-none shrink-0 snap-start",
        "border border-primary rounded-2xl"
      )}
    >
      {/* Stretched Link for entire card */}
      <Link 
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`Lihat detail proyek ${project.name}`}
      />
      
      {/* Card Image */}
      <div className="w-full aspect-4/3 relative flex justify-center items-center px-5 sm:px-6 py-3 rounded-t-2xl overflow-hidden">
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
        <h3 className="mb-2 font-semibold text-primary text-lg md:text-xl xl:text-2xl">
          {project.name}
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {project.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          {project.skills.slice(0, 7).map((skill, i) => {
            const IconComponent = skill.icon ? (skillIcons as Record<string, React.ElementType>)[skill.icon] : null
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
              <div className="max-w-[180px] p-2 text-center text-[11px] font-medium leading-snug whitespace-normal flex flex-col gap-1">
                {project.skills.slice(7).map((additonalSkill, i) => {
                  const IconComponent = additonalSkill.icon ? (skillIcons as Record<string, React.ElementType>)[additonalSkill.icon] : null
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
      <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-primary bg-surface-secondary rounded-b-2xl">
          {/* Left Side: Reactions */}
          <div className="flex items-center gap-1">
            {project.reaction_sumary.total > 0 && 
              <MiracleTooltip
                trigger={
                  <div className="relative z-20 flex items-center -space-x-2 cursor-help">
                    {project.reaction_sumary?.top.map((reaction, index) => (
                      <div 
                        key={index} 
                        className={clsx(
                          "flex items-center justify-center w-7 h-7 rounded-full bg-surface-secondary border-2 border-primary shadow-sm",
                          zIndexClasses[index]
                        )}
                      >
                        <span className="text-xs">{reaction.emoji}</span>
                      </div>
                    ))}
                    <div 
                      className="flex items-center justify-center h-7 min-w-7 px-1 rounded-full bg-surface-secondary border-2 border-primary shadow-sm z-13"
                    >
                      <span className="text-xs font-bold text-secondary">+{project.reaction_sumary.remaining}</span>
                    </div>
                  </div>  
                }
                noPadding
                hoverContent
              >
                <div className="flex gap-1 flex-wrap p-2 max-w-[150px] cursor-help">
                  {project.reaction_sumary.all.map((reaction, index) => (
                    <MiracleBadge
                      key={index}
                    >
                      {reaction.emoji} {reaction.count}
                    </MiracleBadge>
                  ))}
                  {
                    project.reaction_sumary.isLimit && 
                    <MiracleBadge>
                      •••
                    </MiracleBadge>
                  }
                </div>
              </MiracleTooltip>
            }
            
            <div className="relative z-20 flex items-center" ref={pickerRef}>
              <MiracleTooltip 
                trigger={
                  <button 
                    className="group p-1 cursor-pointer"
                    onClick={handleReactionClick} // Menggunakan handler baru
                  >
                    <LuCircleFadingPlus 
                      size={20} 
                      className="text-secondary group-hover:scale-110 transition-transform" 
                    />
                  </button>
                }
                noPadding
              >
                <span className="flex text-nowrap text-xs font-medium p-2">{isSignedIn ? t("reaction-tooltip.default") : t("reaction-tooltip.auth")}</span>
              </MiracleTooltip>

              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-50">
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
            { project.reaction_sumary.total > 0 && 
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-primary">
                {project.reaction_sumary?.total}
              </span>
            }
          </div>
          {/* Right Side: Comments */}
          <div className="flex items-center gap-1">
            <MiracleTooltip 
              trigger={
                <button className="relative z-20 group p-1 cursor-pointer">
                <LuMessageCircleMore 
                    size={20} 
                    className="text-secondary group-hover:scale-110 transition-transform" 
                  />
                </button>
              }
              noPadding
            >
              <span className="flex text-nowrap text-xs font-medium p-2">{isSignedIn ? t("comment-tooltip.default") : t("reaction-tooltip.auth")}</span>
            </MiracleTooltip>
            {project.comments_count > 0 && (
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-primary">
                {project.comments_count} <span className="hidden xs:inline">comments</span>
              </span>
            )}
          </div>
        </div>
    </div>
  )
}
