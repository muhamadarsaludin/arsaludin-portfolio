import { constructMetadata } from "@/configs/metadata"
import HomePage from "@/features/home/components/HomePage"
import type { BasePageProps } from "@/types/page.types"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

export const revalidate = 300

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("pages.home")

  return constructMetadata({
    description: t("description"),
    locale: locale,
  })
}

export default async function Home({ params }: BasePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HomePage />
}
