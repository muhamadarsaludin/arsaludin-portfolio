import React from "react"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { BasePageProps } from "@/types/page.types"
import { routing } from "@/i18n/routing"
import { getQueryClient } from "@/lib/query-client"
import Article from "@/components/Article"
import Container from "@/components/Container"
import Heading from "@/components/Heading"
import TableOfContents from "@/components/TableOfContents"
import MiracleBreadcrumbs from "@/components/miracle/Breadcrumbs"
import { MiracleReveal } from "@/components/miracle/Reveal"
import Image from "next/image"
import {
  LuCalendar,
  LuCrown,
  LuEye,
  LuTimer,
} from "react-icons/lu"
import MiracleBadge from "@/components/miracle/Badge"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import CommentGroup from "@/features/comments/components/CommentGroup"
import { formatDate } from "@/utils/format-date"
import UserAvatar from "@/features/auth/components/UserAvatar"
import { createClient } from "@/lib/supabase/server"
import path from "path"
import { promises as fs } from "fs"
import { formatReadingTime, getMdxReadingTime } from "@/utils/reading-time"
import { getArticle } from "../services/articles"
import ArticleShareButton from "./ArticleShareButton"

/* -------------------------------
   FALLBACK CONFIG
--------------------------------*/
const FALLBACK_LOCALES = ["en", "id"]

/* -------------------------------
   MDX RESOLVER (locale → fallback → null)
--------------------------------*/
async function resolveMdx(slug: string, locale: string) {
  const localesToTry = [
    locale,
    ...FALLBACK_LOCALES.filter((l) => l !== locale),
  ]

  for (const loc of localesToTry) {
    try {
      const mod = await import(`../markdown/${slug}-${loc}.mdx`)
      return {
        Content: mod.default,
        mdxLocale: loc,
      }
    } catch {
      continue
    }
  }

  return {
    Content: null,
    mdxLocale: null,
  }
}

export default async function ArticleDetailPage({ params }: BasePageProps) {
  const t = await getTranslations("pages.article-detail")
  const { locale, slug } = await params

  const supabase = await createClient()

  if (!slug) notFound()

  const queryClient = getQueryClient()

  const article = await queryClient.fetchQuery({
    queryKey: ["article", slug, locale],
    queryFn: () => getArticle({ locale, slug }),
  })

  if (!article) notFound()

  /* -------------------------------
     VIEW INCREMENT
  --------------------------------*/
  if (process.env.NODE_ENV === "production") {
    const { error: viewError } = await supabase.rpc("increment_article_view", {
      article_id: article.id
    })

    if (viewError) {
      console.error("Error incrementing view:", viewError.message)
    }
  }

  /* -------------------------------
     MDX LOAD (ASYNC NON-BLOCKING FALLBACK)
  --------------------------------*/
  const { Content, mdxLocale } = await resolveMdx(slug, locale)

  let mdxText = ""

  if (Content && mdxLocale) {
    try {
      const mdxDir = path.join(process.cwd(), "features", "articles", "markdown")
      const filePath = path.join(mdxDir, `${slug}-${mdxLocale}.mdx`)

      const fileExists = await fs.access(filePath).then(() => true).catch(() => false)
      if (fileExists) {
        mdxText = await fs.readFile(filePath, "utf8")
      }
    } catch (err) {
      console.error("MDX read error:", err)
    }
  }

  /* -------------------------------
     RAW CONTENT (READING TIME INPUT)
  --------------------------------*/
  const rawContent = [
    article.title,
    article.summary ?? "",
    mdxText
  ]
    .filter(Boolean)
    .join(" ")

  const stats = getMdxReadingTime(rawContent)

  const displayReadingTime = stats?.minutes
    ? formatReadingTime(stats.minutes, locale)
    : ""

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className="flex flex-col lg:flex-row gap-8 items-start py-6">
        <Article className="pb-13 lg:pb-23 flex-1 w-full">

          <MiracleReveal animation="fade-right">
            <MiracleBreadcrumbs
              locales={routing.locales}
              overrides={{
                home: t("breadcrumbs.home"),
                articles: t("breadcrumbs.articles"),
                [slug]: article.title
              }}
              className="mb-6"
            />
          </MiracleReveal>

          <div className="w-full mb-10">
            {article.thumbnail && (
              <MiracleReveal animation="zoom-in" className="w-full hidden md:block">
                <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-sm">
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
              <div className="bg-primary border border-primary md:-mt-40 lg:-mt-60 relative z-1 md:mx-6 lg:mx-8 rounded-2xl">

                {article.thumbnail && (
                  <div className="w-full block md:hidden aspect-video relative rounded-t-2xl overflow-hidden shadow-sm">
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

                {/* Top */}
                <div className='p-5 md:p-6'>
                  {/* Header */}
                  <header className="flex gap-4 md:gap-5 items-start mb-4">
                    {/* Header Content */}
                    <div className="flex-1 flex flex-col gap-1.5 items-start">
                      {article.is_featured && (
                        <MiracleBadge color="yellow" variant="secondary" startIcon={<LuCrown />} className="mb-2">
                          {t("featured")}
                        </MiracleBadge>
                      )}

                      <Heading
                        id={slug}
                        level={1}
                        className="text-2xl! md:text-3xl! lg:text-4xl! font-bold"
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

                    <ArticleShareButton
                      title={article.title}
                      description={article.summary ?? ""}
                    />
                  </header>

                  {article.summary &&
                    <p className="mt-2 text-secondary text-sm">
                      {article.summary}
                    </p>
                  }
                </div>
                {/* Mid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-primary p-5 md:p-6">
                  {/* Author */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-tight text-secondary">
                      {t("label.author")}
                    </p>
                    <div className="flex items-center gap-2">
                      <UserAvatar user={article.author} className="h-8 w-8"/>
                      <p className="text-sm text-primary font-medium">
                        {article.author.full_name}
                      </p>
                    </div>
                  </div>

                  {/* Date Created*/}
                  {article.published_at && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs uppercase tracking-tight text-secondary">
                        {t("label.date")}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-primary font-medium">
                        <LuCalendar size={16} className="text-secondary" />
                        {formatDate({ date: article.published_at, locale, dateStyle: "full" })}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  <div className="flex flex-col gap-2 col-span-full">
                    <p className="text-xs uppercase tracking-tight text-secondary">
                      {t("label.categories")}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-primary font-medium">
                      {article.categories.map((category, index) => (
                        <MiracleBadge key={index} className="capitalize" color="blue" variant="secondary" pill>
                          {category.name}
                        </MiracleBadge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-end px-5 md:px-6 py-3 border-t border-primary">
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
            </MiracleReveal>
          </div>

          {Content && <Content />}
        </Article>

        <aside className="hidden lg:block sticky top-30 w-64 shrink-0">
          <TableOfContents />
        </aside>
      </Container>
    </HydrationBoundary>
  )
}