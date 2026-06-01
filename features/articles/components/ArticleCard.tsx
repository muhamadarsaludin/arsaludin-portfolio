"use client"

import Image from "next/image"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import { formatDate } from "@/utils/format-date"
import { cn } from "@/utils/class-name"
import type { Article } from "../types/articles.types"
import Link from "next/link"
import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import { LuCalendar } from "react-icons/lu"
import { useLocale } from "next-intl"
import CommentGroup from "@/features/comments/components/CommentGroup"

export default function ArticleCard({
  article,
  className,
}: {
  article: Article
  className?: string
}) {
  const locale = useLocale()

  return (
    <div className={cn("relative flex flex-col", className)}>
      <Link
        href={`/articles/${article.slug}`}
        aria-label={`Read ${article.title}`}
        className="group/article border-primary relative block aspect-7/5 w-full cursor-pointer overflow-hidden rounded-2xl border"
      >
        {article.thumbnail ? (
          <Image
            className="object-cover transition-transform duration-300 ease-in-out group-hover/article:scale-103"
            src={article.thumbnail}
            alt={article.title}
            fill
            priority
            sizes="1000px"
          />
        ) : (
          <MiracleSkeleton className="h-full w-full" />
        )}
      </Link>

      {/* Footer */}
      <div className="flex flex-col items-start pt-5">
        <div className="flex w-full items-center justify-between gap-4">
          {article.published_at && (
            <p className="text-secondary flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
              <span className="flex items-center gap-1">
                <LuCalendar className="shrink-0" />
                {formatDate({ date: article.published_at, locale, dateStyle: "medium" })}
              </span>
            </p>
          )}
          <div className="relative flex shrink-0 items-center">
            <ReactionGroup
              targetId={article.id}
              targetType="article"
              initialSummary={article.reaction_summary}
            />
            <CommentGroup
              targetId={article.id}
              targetType="article"
              initialCount={article.comment_count}
            />
          </div>
        </div>
        <Link href={`/articles/${article.slug}`} className="group/title">
          <h3 className="text-primary line-clamp-1 text-base font-semibold tracking-tight transition-all duration-300 md:text-lg lg:text-xl">
            {article.title}
          </h3>
        </Link>
        {article.summary && (
          <div className="text-secondary mt-0.5 line-clamp-2 text-sm">{article.summary}</div>
        )}
      </div>
    </div>
  )
}
