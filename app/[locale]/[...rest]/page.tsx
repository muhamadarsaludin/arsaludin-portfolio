import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { StaticPageProps } from "@/types/page.types"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
    rest: [],
  }))
}

export default async function CatchAllPage({ params }: StaticPageProps) {
  const { locale } = await params
  setRequestLocale(locale) 
  return notFound()
}