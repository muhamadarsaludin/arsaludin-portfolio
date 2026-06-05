import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { StaticPageProps } from "@/types/page.types"
import { getProject } from "../services/projects"
import { routing } from "@/i18n/routing"
import { getQueryClient } from "@/lib/query-client"
import Article from "@/components/Article"
import Container from "@/components/Container"
import TableOfContents from "@/components/TableOfContents"
import MiracleBreadcrumbs from "@/components/miracle/Breadcrumbs"
import { MiracleReveal } from "@/components/miracle/Reveal"
import path from "path"
import { promises as fs } from "fs"
import { formatReadingTime, getMdxReadingTime } from "@/utils/reading-time"
import ViewTracker from "@/features/shared/components/ViewTracker"
import type { Project } from "../types/projects.types"
import ProjectDetailContent from "./ProjectDetailContent"

const FALLBACK_LOCALES = routing.locales

/* -------------------------------
   MDX RESOLVER (locale → fallback → null)
--------------------------------*/
async function resolveMdx(slug: string, locale: string) {
  const localesToTry = [locale, ...FALLBACK_LOCALES.filter((l) => l !== locale)]

  for (const loc of localesToTry) {
    try {
      const mod = await import(`../markdown/${slug}-${loc}.mdx`)
      return {
        Content: mod.default,
        mdxLocale: loc,
      }
    } catch {
      continue
    }
  }

  return { Content: null, mdxLocale: null }
}

export default async function ProjectDetailPage({ params }: StaticPageProps) {
  const t = await getTranslations("pages.project-detail")
  const { locale, slug } = await params

  if (!slug) notFound()

  const queryClient = getQueryClient()
  const queryKey = ["project", slug, locale]
  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => getProject({ locale, slug }),
  })

  const project = queryClient.getQueryData<Project>(queryKey)

  if (!project) notFound()

  /* -------------------------------
     MDX LOAD (ASYNC NON-BLOCKING FALLBACK)
  --------------------------------*/
  const { Content, mdxLocale } = await resolveMdx(slug, locale)
  let mdxText = ""

  if (Content && mdxLocale) {
    try {
      const mdxDir = path.join(process.cwd(), "features", "projects", "markdown")
      const filePath = path.join(mdxDir, `${slug}-${mdxLocale}.mdx`)

      const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false)
      if (fileExists) {
        mdxText = await fs.readFile(filePath, "utf8")
      }
    } catch (err) {
      console.error("MDX read error:", err)
    }
  }

  /* -------------------------------
     RAW CONTENT (READING TIME INPUT)
  --------------------------------*/
  const rawContent = [project.name, project.description, mdxText].filter(Boolean).join(" ")
  const stats = getMdxReadingTime(rawContent)
  const displayReadingTime = stats?.minutes ? formatReadingTime(stats.minutes, locale) : ""

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ViewTracker id={project.id} rpcName="increment_project_view" rpcParamKey="project_id" />
      <Container className="flex flex-col items-start gap-8 py-6 lg:flex-row">
        <Article className="w-full flex-1 pb-13 lg:pb-23">
          <MiracleReveal animation="fade-right">
            <MiracleBreadcrumbs
              locales={routing.locales}
              overrides={{
                home: t("breadcrumbs.home"),
                projects: t("breadcrumbs.projects"),
                [slug]: project.name,
              }}
              className="mb-6"
            />
          </MiracleReveal>
          <ProjectDetailContent
            slug={slug}
            locale={locale}
            displayReadingTime={displayReadingTime}
          />
          {Content && (
            <div className="mt-8 md:mt-10">
              <Content />
            </div>
          )}
        </Article>

        <aside className="sticky top-30 hidden w-64 shrink-0 lg:block">
          <TableOfContents />
        </aside>
      </Container>
    </HydrationBoundary>
  )
}
