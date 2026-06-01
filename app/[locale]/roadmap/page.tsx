import { constructMetadata } from "@/configs/metadata"
import RoadmapPage from "@/features/roadmap/components/RoadmapPage"
import type { BasePageProps } from "@/types/page.types"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server" // 👈 Impor setRequestLocale

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("pages.roadmap")

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  })
}

export default async function Roadmap({ params, searchParams }: BasePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <RoadmapPage params={params} searchParams={searchParams} />
}