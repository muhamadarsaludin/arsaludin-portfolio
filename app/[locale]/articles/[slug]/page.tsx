import { constructMetadata } from "@/configs/metadata"
import ArticleDetailPage from "@/features/articles/components/ArticleDetailPage"
import { getArticle } from "@/features/articles/services/articles"
import type { BasePageProps } from "@/types/page.types"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await getArticle({ slug, locale })
  const t = await getTranslations("pages.article-detail")

  if (!slug || !article) return constructMetadata({
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

export default async function ProjectDetail({params, searchParams}: BasePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ArticleDetailPage params={params} searchParams={searchParams} />
}
