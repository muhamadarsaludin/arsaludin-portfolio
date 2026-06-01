import React from "react"
import { getTranslations } from "next-intl/server"
import { LuCalendar } from "react-icons/lu"

import { routing } from "@/i18n/routing"
import { formatDate } from "@/utils/format-date"

import Article from "@/components/Article"
import Container from "@/components/Container"
import TableOfContents from "@/components/TableOfContents"
import MiracleBadge from "@/components/miracle/Badge"
import MiracleBreadcrumbs from "@/components/miracle/Breadcrumbs"
import { MiracleReveal } from "@/components/miracle/Reveal"

type PrivacyPolicyPageProps = {
  params: Promise<{ locale: string }>
}

/* -------------------------------
   FALLBACK CONFIG
--------------------------------*/
const FALLBACK_LOCALES = ["en", "id"]

async function resolvePrivacyMdx(locale: string) {
  const localesToTry = [locale, ...FALLBACK_LOCALES.filter((l) => l !== locale)]

  for (const loc of localesToTry) {
    try {
      const mod = await import(`../markdown/privacy-policy-${loc}.mdx`)
      return mod.default
    } catch {
      continue
    }
  }

  return () => null
}

export default async function PrivacyPolicyPage({ params }: PrivacyPolicyPageProps) {
  const { locale } = await params
  const t = await getTranslations("pages.privacy-policy")

  /* -------------------------------
     MDX LOAD (NON-BLOCKING CROSS-FALLBACK)
  --------------------------------*/
  const Content = await resolvePrivacyMdx(locale)

  const LATEST_UPDATE_DATE = "2026-06-01"

  return (
    <Container className="flex w-full items-start gap-6 md:gap-8">
      <Article className="w-full flex-1 pb-13 lg:pb-23">
        <MiracleReveal animation="fade-right">
          <MiracleBreadcrumbs
            locales={routing.locales}
            overrides={{
              home: t("breadcrumbs.home"),
              "privacy-policy": t("breadcrumbs.privacy-policy"),
            }}
            className="mb-5 md:mb-6"
          />
          <div className="flex w-full flex-col items-start">
            <MiracleBadge startIcon={<LuCalendar />} className="mb-4">
              {t("latestUpdate", {
                date: formatDate({ date: LATEST_UPDATE_DATE, locale }),
              })}
            </MiracleBadge>
            <div className="w-full max-w-none">
              <Content />
            </div>
          </div>
        </MiracleReveal>
      </Article>
      <TableOfContents className="sticky top-30 hidden shrink-0 lg:block" />
    </Container>
  )
}
