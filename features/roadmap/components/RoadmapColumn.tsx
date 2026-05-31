"use client"

import React, { useMemo, useRef, useState } from 'react'
import { useInfiniteCardsByStatus } from '@/features/cards/hooks/useInfiniteCardsByStatus'
import { Card, CardPriority, CardStatus, CardType } from '@/features/cards/types/cards.types'
import MiracleButton from '@/components/miracle/Button'
import { useTranslations } from 'next-intl'
import { LuPlus } from 'react-icons/lu'
import { cn } from "@/utils/class-name"
import { useAuth } from '@/providers/AuthProvider'
import CardItem from '@/features/cards/components/CardItem'
import { signInWithGoogle } from '@/features/auth/services/auth'
import { SiGoogle } from 'react-icons/si'
import MiracleTooltip from '@/components/miracle/Tooltip'
import CardEmpty from '@/features/cards/components/CardEmpty'
import CardItemSkeleton from '@/features/cards/components/CardItemSkeleton'
import ErrorStateCard from '@/features/shared/components/ErrorStateCard'
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import MiracleLoader from '@/components/miracle/Loader'
import CardFormModal from '@/features/cards/components/CardFormModal'
import { MiracleReveal } from '@/components/miracle/Reveal'

type RoadmapColumnProps = {
  status: CardStatus
  filters: {
    search?: string;
    types?: CardType[];
    priorities?: CardPriority[];
    pageSize: number;
  },
  columnDelay: number;
  className?: string;
}

export default function RoadmapColumn({ status, filters, className, columnDelay }: RoadmapColumnProps) {
  const td = useTranslations("data")
  const t = useTranslations("pages.roadmap")
  const { isSignedIn, profile } = useAuth()
  const isAdmin = profile?.role === "admin"

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isError, 
    isLoading, 
    isFetchingNextPage,
    refetch
  } = useInfiniteCardsByStatus({ status, ...filters })
  const allCards = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])

  const loadMoreRef = useRef<HTMLDivElement>(null)
  useIntersectionObserver({
    targetRef: loadMoreRef,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    enabled: !!hasNextPage && !isLoading,
  })

  const handleOpenForm = (card?: Card) => {
    setSelectedCard(card || null)
    setIsFormOpen(true)
  }

  const handleSignIn = async () => {
    await signInWithGoogle()
  }

  const renderActionButton = () => {
    const isAuthAction = !isSignedIn
    const isIdeasColumn = status === "ideas"
    
    if (!isAuthAction && !isAdmin && !isIdeasColumn) return null

    const buttonLabel = isAuthAction ? t("signIn.label") : t("create")
    const buttonIcon = isAuthAction ? <SiGoogle /> : <LuPlus />
    const tooltipMessage = isAuthAction ? t("signIn.tooltip") : ""
    const ariaLabel = isAuthAction ? t("signIn.tooltip") : t("create") 

    const handleClick = () => {
      if (isAuthAction) return handleSignIn()
      handleOpenForm()
    }

    const buttonNode = (
      <MiracleButton aria-label={ariaLabel} startIcon={buttonIcon} size="sm" onClick={handleClick}>
        {buttonLabel}
      </MiracleButton>
    )

    if (isAuthAction) {
      return (
        <MiracleTooltip trigger={buttonNode}>
          <div className="max-w-45 text-center">{tooltipMessage}</div>
        </MiracleTooltip>
      )
    }

    return buttonNode
  }

  return (
    <div className={cn("flex flex-col gap-4 w-full bg-secondary p-4 md:p-5 rounded-2xl", className)}>
      <div className="flex items-center justify-between px-1">
        <h2 className="text-primary font-semibold text-md">
          {td(`roadmap.status.${status}`)}
        </h2>
        {renderActionButton()}
      </div>

      <div className="flex flex-col gap-3 min-h-150 max-h-150 overflow-y-auto">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <CardItemSkeleton key={i} />
          ))  
        ) : isError ? (
          <ErrorStateCard onRetry={() => refetch()}/>
        ) : allCards.length === 0 ? (
          <CardEmpty />
        ) : (
          <>
            {allCards.map((card) => (
              <MiracleReveal key={card.id} animation="zoom-in">
                <CardItem 
                  card={card} 
                  onUpdate={handleOpenForm}
                />
              </MiracleReveal>
            ))}

            {isFetchingNextPage && (
              <div className="flex flex-col gap-3">
                <CardItemSkeleton />
              </div>
            )}

            <div ref={loadMoreRef} className="h-4 w-full flex items-center justify-center">
              {isFetchingNextPage && <MiracleLoader size={20}/>}
            </div>
          </>
        )}
      </div>

      <CardFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedCard}
        defaultStatus={status}
      />
    </div>
  )
}