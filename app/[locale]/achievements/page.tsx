import { constructMetadata } from "@/configs/metadata"
import AchievementsPage from "@/features/achievements/components/AchievementsPage"
import type { BasePageProps } from "@/types/page.types"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("pages.achievements")

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  })
}

export default async function Achievements({ params, searchParams }: BasePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AchievementsPage params={params} searchParams={searchParams} />
}
