import { constructMetadata } from "@/configs/metadata"
import ArticlesPage from "@/features/articles/components/ArticlesPage"
import type { BasePageProps } from "@/types/page.types"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

export const revalidate = 300

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("pages.articles")

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  })
}

export default async function Articles({ params }: BasePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ArticlesPage params={params} />
}
