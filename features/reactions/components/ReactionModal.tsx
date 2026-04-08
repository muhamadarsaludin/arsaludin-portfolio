"use client"

import { useRef } from "react"
import { useTranslations } from "next-intl"
import MiracleModal from "@/components/miracle/Modal"
import MiracleLoader from "@/components/miracle/Loader"

import { useReactions } from "@/features/reactions/hooks/useReactions"
import { ReactionTargetType } from "@/features/reactions/types/reactions.types"
import ReactionItem from "./ReactionItem"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"

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

  useIntersectionObserver({
    targetRef: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage && isOpen,
  })

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
      <div className="flex flex-col gap-1">
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
          <ul className="flex flex-col gap-4">
            {allReactions.map((reaction) => (
             <ReactionItem key={reaction.id} reaction={reaction} />
            ))}
          </ul>
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
                {t("loadingDetail")}
              </span>
            </div>
          )}
        </div>
      </div>
    </MiracleModal>
  )
}