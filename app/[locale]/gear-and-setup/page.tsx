import { constructMetadata } from "@/configs/metadata"
import GearAndSetupPage from "@/features/gear-and-setup/components/GearAndSetupPage"
import type { BasePageProps } from "@/types/page.types"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("pages.gear-and-setup")

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  })
}

export default async function GearAndSetup({ params }: BasePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <GearAndSetupPage params={params} />
}
