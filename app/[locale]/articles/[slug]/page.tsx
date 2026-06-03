import { constructMetadata } from "@/configs/metadata"
import ArticleDetailPage from "@/features/articles/components/ArticleDetailPage"
import { getAllArticlesSlugs, getArticle } from "@/features/articles/services/articles"
import { routing } from "@/i18n/routing"
import type { BasePageProps } from "@/types/page.types"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  try {
    const articles = await getAllArticlesSlugs() 
    const paths: { locale: string; slug: string }[] = []
    
    routing.locales.forEach((locale) => {
      articles.forEach((article) => {
        if (article.slug) {
          paths.push({ locale, slug: article.slug })
        }
      })
    })
    
    return paths
  } catch (error) {
    console.error("Failed to generate static params for article detail:", error)
    return []
  }
}

export const revalidate = 300

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await getArticle({ slug, locale })
  const t = await getTranslations("pages.article-detail")

  if (!slug || !article)
    return constructMetadata({
      title: t("title"),
      description: t("description"),
      locale: locale,
    })

  return constructMetadata({
    title: article.title,
    description: article.summary ?? t("description"),
    locale: locale,
  })
}

export default async function ProjectDetail({ params }: BasePageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  if (!slug) return notFound()
  return <ArticleDetailPage params={params} />
}
