import { constructMetadata } from "@/configs/metadata"
import LoungePage from "@/features/lounge/components/LoungePage"
import type { BasePageProps } from "@/types/page.types"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

export const revalidate = 60

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("pages.lounge")

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  })
}

export default async function Lounge({ params }: BasePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <LoungePage />
}
