import Container from "@/components/Container"
import Heading from "@/components/Heading"
import MiracleBreadcrumbs from "@/components/miracle/Breadcrumbs"
import TableOfContents from "@/components/TableOfContents"
import { routing } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { INSPIRATION_WEBSITE } from "../data/inspiration-website"
import type { InspirationWebsite } from "../types/inspiration-website.types"
import Article from "@/components/Article"
import InspirationCard from "./InspirationCard"
import { MiracleReveal } from "@/components/miracle/Reveal"

type InspirationWebsitePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function InspirationWebsitePage({ params }: InspirationWebsitePageProps) {
  const { locale } = await params
  const t = await getTranslations("pages.inspiration-website")

  const sortData = (data: InspirationWebsite[]) => {
    return [...data].sort((a, b) => {
      if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1
      return a.author.localeCompare(b.author)
    })
  }

  const sortedPersonals = sortData(INSPIRATION_WEBSITE.filter(i => i.type === "personal"))
  const sortedOrganizations = sortData(INSPIRATION_WEBSITE.filter(i => i.type === "organization"))

  const renderedPersonals = sortedPersonals.map((item) => (
    <MiracleReveal key={item.link} animation="fade-up">
      <InspirationCard item={item} locale={locale} />
    </MiracleReveal>
  ))

  const renderedOrganizations = sortedOrganizations.map((item) => (
    <MiracleReveal key={item.link} animation="fade-up">
      <InspirationCard item={item} locale={locale} />
    </MiracleReveal>
  ))

  return (
    <Container className="flex gap-6 md:gap-8 items-start w-full">
      <Article className="pb-13 lg:pb-23 flex-1 w-full">
        <MiracleReveal animation="fade-right">
          <MiracleBreadcrumbs 
            locales={routing.locales}
            overrides={{
              home: t("breadcrumbs.home"),
              "inspiration-website": t("breadcrumbs.inspiration-website")
            }}
            className="mb-5 md:mb-6"
          />
          <header>
            <Heading 
              level={1}
              className="font-semibold"
            >
              {t("title")}
            </Heading>
            <p className="mt-4 text-secondary">{t("description")}</p>
          </header>
        </MiracleReveal>
        <div className="mt-12 space-y-12 w-full">
          {/* SECTION 1: PERSONAL WEBSITES */}
          <div className="w-full">
            <MiracleReveal animation="fade-right">
              <Heading level={2} className="font-semibold">
                {t("personal")}
              </Heading>
            </MiracleReveal>
            <div className="flex flex-col gap-4 mt-4 w-full">
              {renderedPersonals}
            </div>
          </div>

          {/* SECTION 2: ORGANIZATION WEBSITES */}
          <div className="w-full">
            <MiracleReveal animation="fade-right">
            <Heading level={2} className="font-semibold">
                {t("organization")}
              </Heading>
            </MiracleReveal>
            <div className="flex flex-col gap-4 mt-4 w-full">
              {renderedOrganizations}
            </div>
          </div>
        </div>
      </Article>
      <TableOfContents className="hidden lg:block sticky top-30 shrink-0" />
    </Container>
  )
}