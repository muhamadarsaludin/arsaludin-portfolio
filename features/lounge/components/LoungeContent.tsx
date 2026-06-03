"use client"

import { supabase } from "@/lib/supabase/client"
import { useEffect, useMemo, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import Section from "@/components/Section"
import ErrorStateCard from "@/features/shared/components/ErrorStateCard"
import MiracleBanner from "@/components/miracle/Banner"
import { LuMegaphone, LuArrowDown, LuMessagesSquare } from "react-icons/lu"
import { useTranslations } from "next-intl"
import type { Message, MessageType } from "@/features/messages/types/messages.types"
import { useInfiniteMessages } from "@/features/messages/hooks/useInfiniteMessages"
import MessageBubble from "@/features/messages/components/MessageBubble"
import MessageInput from "@/features/messages/components/MessageInput"
import MessageBubbleSkeleton from "@/features/messages/components/MessageBubbleSkeleton"
import { cn } from "@/utils/class-name"
import { MiracleReveal } from "@/components/miracle/Reveal"

type LoungeContentProps = {
  messageType: MessageType
  pageSize: number
}

export default function LoungeContent({ messageType, pageSize }: LoungeContentProps) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ["messages", messageType, { pageSize }], [messageType, pageSize])

  const [isBannerVisible, setIsBannerVisible] = useState(true)
  const [repliedMessage, setRepliedMessage] = useState<Message | null>(null)
  const [showScrollBottom, setShowScrollBottom] = useState(false)

  const t = useTranslations("pages.lounge")

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const prevScrollHeightRef = useRef(0)

  const { data, fetchNextPage, hasNextPage, isError, isLoading, isFetchingNextPage, refetch } =
    useInfiniteMessages({
      type: messageType,
      pageSize,
    })

  const messages = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data])

  useIntersectionObserver({
    targetRef: loadMoreRef,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        if (scrollContainerRef.current) {
          prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight
        }
        fetchNextPage()
      }
    },
    enabled: !!hasNextPage && !isLoading,
  })

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el || isFetchingNextPage) return

    const diff = el.scrollHeight - prevScrollHeightRef.current
    if (diff > 0 && prevScrollHeightRef.current !== 0) {
      el.scrollTop += diff
    }
  }, [messages.length, isFetchingNextPage])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const offset = Math.abs(e.currentTarget.scrollTop)
    setShowScrollBottom(offset > 100)
  }

  const scrollToBottom = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${messageType}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `type=eq.${messageType}` },
        () => {
          queryClient.invalidateQueries({
            queryKey,
            refetchType: "active",
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryKey, queryClient, messageType])

  if (isError) return <ErrorStateCard onRetry={() => refetch()} />

  return (
    <Section className="border-primary bg-primary relative flex h-187.5 flex-col gap-4 overflow-hidden rounded-2xl border p-4 md:p-6">
      {isBannerVisible && (
        <MiracleBanner
          color="blue"
          variant="secondary"
          startIcon={<LuMegaphone />}
          isClearable
          onClear={() => setIsBannerVisible(false)}
          title={t("banner.title")}
        >
          <div className="text-sm">{t("banner.content")}</div>
        </MiracleBanner>
      )}

      {/* WRAPPER FOR CHAT */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* CHAT CONTAINER */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex flex-1 flex-col-reverse overflow-y-auto px-2"
        >
          <div
            className={cn(
              "flex flex-col-reverse gap-5",
              !isLoading && messages.length === 0 && "min-h-full"
            )}
          >
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <MessageBubbleSkeleton key={i} isAuthor={i % 2 === 0} />
              ))
            ) : messages.length > 0 ? (
              <>
                {messages.map((message) => (
                  <MiracleReveal key={message.id} animation="zoom-in">
                    <MessageBubble
                      messageType={messageType}
                      pageSize={pageSize}
                      message={message}
                      onReply={setRepliedMessage}
                    />
                  </MiracleReveal>
                ))}
                {isFetchingNextPage &&
                  Array.from({ length: 2 }).map((_, i) => (
                    <MessageBubbleSkeleton key={i} isAuthor={i % 2 === 0} />
                  ))}
                <div ref={loadMoreRef} className="h-1" />
              </>
            ) : (
              <div className="border-primary flex flex-1 flex-col items-center justify-center rounded-md border border-dashed p-6 text-center">
                <div className="mb-3">
                  <LuMessagesSquare className="text-primary h-18 w-18 md:h-25 md:w-25" />
                </div>
                <h3 className="text-primary mb-1 text-lg font-semibold md:text-xl lg:text-2xl">
                  {t("empty.title")}
                </h3>
                <p className="text-secondary max-w-75 text-sm">{t("empty.subtitle")}</p>
              </div>
            )}
          </div>
        </div>

        {/* FLOATING BUTTON */}
        <button
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          className={cn(
            "absolute right-0 bottom-6 z-50",
            "flex h-10 w-10 items-center justify-center rounded-md",
            "bg-primary-inv text-primary-inv shadow-lg",
            "transition-all duration-300 ease-in-out",
            "hover:scale-105 active:scale-95",
            "hover:-translate-y-1 hover:transform active:translate-y-0",
            "cursor-pointer",
            showScrollBottom
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-10 scale-50 opacity-0"
          )}
        >
          <LuArrowDown className="h-5 w-5" />
        </button>
      </div>

      {/* INPUT */}
      <MessageInput
        messageType={messageType}
        pageSize={pageSize}
        repliedMessage={repliedMessage}
        onClearReply={() => setRepliedMessage(null)}
      />
    </Section>
  )
}