"use client"

import { useMemo } from "react"
import Image from "next/image"
import Heading from "@/components/Heading"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { LuCalendar, LuCrown, LuEye, LuTimer } from "react-icons/lu"
import MiracleBadge from "@/components/miracle/Badge"
import { formatDate } from "@/utils/format-date"
import UserAvatar from "@/features/auth/components/UserAvatar"
import CommentGroup from "@/features/comments/components/CommentGroup"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import ArticleShareButton from "./ArticleShareButton"
import { useBatchReactions } from "@/features/reactions/hooks/useBatchReactions"
import { useTranslations } from "next-intl"
import { useArticle } from "../hooks/useArticle"

type ArticleDetailContentProps = {
  slug: string
  locale: string
  displayReadingTime: string
}

export default function ArticleDetailContent({
  slug,
  locale,
  displayReadingTime,
}: ArticleDetailContentProps) {
  const t = useTranslations("pages.article-detail")
  const { data: article } = useArticle({ slug, locale })

  if (!article) return null

  const articleIds = useMemo(() => [article.id], [article.id])

  const { data: dataReactions } = useBatchReactions({
    targetIds: articleIds,
    targetType: "article",
  })

  const dataReaction = dataReactions?.[article.id]
  const reactionSummary = dataReaction?.summary || null
  const userReaction = dataReaction?.userReaction || null

  return (
    <div className="w-full">
      {article.thumbnail && (
        <MiracleReveal animation="zoom-in" className="hidden w-full md:block">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-sm">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>
        </MiracleReveal>
      )}

      {/* Card Meta Data */}
      <MiracleReveal animation="fade-up" delay={0.1}>
        <div className="bg-primary border-primary relative z-1 rounded-2xl border md:mx-6 md:-mt-40 lg:mx-8 lg:-mt-60">
          {article.thumbnail && (
            <div className="relative block aspect-video w-full overflow-hidden rounded-t-2xl shadow-sm md:hidden">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </div>
          )}

          {/* Top Section*/}
          <div className="p-5 md:p-6">
            <header className="mb-4 flex items-start gap-4 md:gap-5">
              <div className="flex flex-1 flex-col items-start gap-1.5">
                {article.is_featured && (
                  <MiracleBadge
                    color="yellow"
                    variant="secondary"
                    startIcon={<LuCrown />}
                    className="mb-2"
                  >
                    {t("featured")}
                  </MiracleBadge>
                )}

                <Heading
                  id={slug}
                  level={1}
                  className="text-2xl! font-bold md:text-3xl! lg:text-4xl!"
                  linkClassName="text-[0.5em]!"
                >
                  {article.title}
                </Heading>

                <p className="text-secondary flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
                  <span className="flex items-center gap-1">
                    <LuEye className="shrink-0" />
                    {article.view_count + 1} {t("views", { count: article.view_count + 1 })}
                  </span>

                  <span className="flex items-center gap-1">
                    <LuTimer className="shrink-0" />
                    {displayReadingTime} {t("read")}
                  </span>
                </p>
              </div>

              <ArticleShareButton title={article.title} description={article.summary ?? ""} />
            </header>

            {article.summary && (
              <p className="text-secondary mt-2 text-sm">{article.summary}</p>
            )}
          </div>
          {/* Mid Section*/}
          <div className="border-primary grid grid-cols-1 gap-5 border-t p-5 md:grid-cols-2 md:p-6">
            {/* Author */}
            <div className="flex flex-col gap-2">
              <p className="text-secondary text-xs tracking-tight uppercase">
                {t("label.author")}
              </p>
              <div className="flex items-center gap-2">
                <UserAvatar user={article.author} className="h-8 w-8" />
                <p className="text-primary text-sm font-medium">{article.author.full_name}</p>
              </div>
            </div>

            {/* Date Created*/}
            {article.published_at && (
              <div className="flex flex-col gap-2">
                <p className="text-secondary text-xs tracking-tight uppercase">
                  {t("label.date")}
                </p>
                <div className="text-primary flex items-center gap-2 text-sm font-medium">
                  <LuCalendar size={16} className="text-secondary" />
                  {formatDate({ date: article.published_at, locale, dateStyle: "full" })}
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="col-span-full flex flex-col gap-2">
              <p className="text-secondary text-xs tracking-tight uppercase">
                {t("label.categories")}
              </p>

              <div className="text-primary flex flex-wrap items-center gap-2 text-sm font-medium">
                {article.categories.map((category, index) => (
                  <MiracleBadge
                    key={index}
                    className="capitalize"
                    color="blue"
                    variant="secondary"
                    pill
                  >
                    {category.name}
                  </MiracleBadge>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-primary flex items-center justify-end border-t px-5 py-3 md:px-6">
            <ReactionGroup
              targetId={article.id}
              targetIds={articleIds}
              targetType="article"
              userReaction={userReaction}
              reactionSummary={reactionSummary}
            />
            <CommentGroup
              title={article.title}
              targetId={article.id}
              targetType="article"
              initialCount={article.comment_count}
            />
          </div>
        </div>
      </MiracleReveal>
    </div>
  )
}