import { constructMetadata } from "@/configs/metadata"
import ChangelogPage from "@/features/changelog/components/ChangelogPage"
import type { BasePageProps } from "@/types/page.types"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("pages.changelog")

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  })
}

export default async function Changelog({params}: BasePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ChangelogPage params={params}/>
}
