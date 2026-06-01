import { constructMetadata } from "@/configs/metadata"
import PrivacyPolicyPage from "@/features/privacy-policy/components/PrivacyPolicyPage"
import type { BasePageProps } from "@/types/page.types"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations("pages.privacy-policy")

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale,
  })
}

export default async function PrivacyPolicy({params}: BasePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <PrivacyPolicyPage params={params}/>
}
