"use client"

import { useTranslations } from "next-intl"
import clsx from "clsx"
import { useFeaturedArticles } from "../hooks/useFeaturedArticles"
import ErrorStateCard from "@/features/shared/types/components/ErrorStateCard"
import ArticleCardHighlight from "./ArticleCardHighlight"
import ArticleCardFeatured from "./ArticleCardFeatured"
import Section from "@/components/Section"
import Heading from "@/components/Heading"
import FeaturedArticlesSkeleton from "./FeaturedArticlesSkeleton"
import { MiracleReveal } from "@/components/miracle/Reveal"

type FeaturedArticleContentProps = {
  locale: string
}

export default function FeaturedArticlesContent({ locale }: FeaturedArticleContentProps) {
  const t = useTranslations("pages.articles")
  const { 
    data: articles, 
    isLoading, 
    isError,
    refetch
  } = useFeaturedArticles({ locale })

  if (isError) return <ErrorStateCard onRetry={() => refetch()} />
  if (isLoading) return <FeaturedArticlesSkeleton />
  if (!articles || articles.length === 0) return null
  const firstArticle = articles[0]
  const othersArticles = articles.slice(1)
  const isSingle = articles.length === 1

  return (
    <div className="flex flex-col gap-6">
      <div className={clsx(
        "grid gap-6",
        isSingle ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
      )}>
        {/* Main Highlight */}
        <MiracleReveal animation="zoom-in" className={clsx(isSingle ? "col-span-1" : "lg:col-span-8")}>
          <ArticleCardHighlight article={firstArticle} locale={locale} className="h-full w-full"/>
        </MiracleReveal>
        
        {!isSingle && othersArticles.length > 0 && (
          // 1. Parent utama harus col-span-4 dan punya flex col
          <div className="lg:col-span-4"> 
            <div className={clsx(
              "w-full h-full flex flex-row overflow-x-auto snap-x snap-mandatory gap-4",
              "lg:grid lg:grid-cols-1 lg:grid-rows-3 lg:h-full lg:gap-6",
              "custom-scrollbar"
            )}>
              {othersArticles.map((article, index) => (
                <MiracleReveal 
                  key={article.id} 
                  animation={{
                    default: "zoom-in",
                    lg: "fade-up"
                  }}
                  delay={{
                    default: 0,
                    lg:(index % 6) * 0.1,
                  }}
                  className="w-[75vw] md:w-full md:max-w-87.5 lg:max-w-full lg:h-full snap-start shrink-0 overflow-hidden">
                  <ArticleCardFeatured 
                    article={article} 
                    locale={locale} 
                    className="h-full w-full"
                  />
                </MiracleReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}