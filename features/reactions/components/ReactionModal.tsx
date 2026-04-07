"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import MiracleModal from "@/components/miracle/Modal"
import MiracleLoader from "@/components/miracle/Loader"

import { useReactions } from "@/features/reactions/hooks/useReactions"
import { ReactionTargetType } from "@/features/reactions/types/reactions.types"

type ReactionModalProps = {
  isOpen: boolean
  onClose: () => void
  targetId: string
  targetType: ReactionTargetType
}

export default function ReactionModal({ 
  isOpen, 
  onClose, 
  targetId, 
  targetType 
}: ReactionModalProps) {
  const t = useTranslations("components.reaction.modal")
  const loadMoreRef = useRef<HTMLDivElement>(null)
  
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReactions({ 
    targetId, 
    targetType, 
    enabled: isOpen 
  })

  /**
   * Infinite Scroll Logic: 
   * Automagically fetch next page when user scrolls to the bottom sentinel.
   */
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !isOpen) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "100px" // Fetch 100px before reaching the end for better UX
      }
    )

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isOpen])

  const allReactions = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <MiracleModal
      isOpen={isOpen}
      onClose={onClose}
      title={t("title")}
      description={t("description")}
      size="sm"
      className="max-h-[75vh]"
    >
      <div className="flex min-h-[350px] flex-col gap-1">
        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
            <MiracleLoader size={32} />
            <p className="text-secondary/50 text-xs animate-pulse">
              {t("loadingDetail")}
            </p>
          </div>
        ) : allReactions.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-10 text-center">
            <p className="text-secondary/60 text-sm font-medium italic">
              Belum ada reaksi di sini.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {allReactions.map((reaction) => (
              <div 
                key={reaction.id} 
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between rounded-2xl p-2.5 transition-all"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar Section */}
                  <div className="bg-secondary relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-primary/10">
                    {reaction.author.avatar_url ? (
                      <img 
                        src={reaction.author.avatar_url} 
                        alt={reaction.author.full_name}
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-primary flex h-full w-full items-center justify-center bg-blue/10 text-xs font-bold uppercase">
                        {reaction.author.full_name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>

                  {/* User Info Section */}
                  <div className="flex flex-col">
                    <span className="text-secondary text-sm font-bold leading-tight">
                      {reaction.author.full_name}
                    </span>
                    <span className="text-secondary/50 text-[10px] font-semibold uppercase tracking-wider">
                      {reaction.author.role || "Member"}
                    </span>
                  </div>
                </div>

                {/* Reaction Emoji */}
                <span className="pr-1 text-2xl select-none drop-shadow-sm transition-transform hover:scale-125">
                  {reaction.emoji}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* --- INFINITE LOADING SENTINEL --- */}
        <div 
          ref={loadMoreRef} 
          className="flex min-h-[60px] w-full items-center justify-center py-4"
        >
          {isFetchingNextPage && (
            <div className="flex flex-col items-center gap-2">
              <MiracleLoader size={20} />
              <span className="text-secondary/40 text-[10px] italic">
                {t("loadingList")}
              </span>
            </div>
          )}
        </div>
      </div>
    </MiracleModal>
  )
}