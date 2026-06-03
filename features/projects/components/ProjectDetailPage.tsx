import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { StaticPageProps } from "@/types/page.types"
import { getProject } from "../services/projects"
import { routing } from "@/i18n/routing"
import { getQueryClient } from "@/lib/query-client"
import Article from "@/components/Article"
import Container from "@/components/Container"
import Heading from "@/components/Heading"
import TableOfContents from "@/components/TableOfContents"
import MiracleBreadcrumbs from "@/components/miracle/Breadcrumbs"
import { MiracleReveal } from "@/components/miracle/Reveal"
import Image from "next/image"
import {
  LuArrowUpRight,
  LuCalendar,
  LuCrown,
  LuEye,
  LuGithub,
  LuTimer,
  LuTriangleAlert,
} from "react-icons/lu"
import MiracleBadge from "@/components/miracle/Badge"
import ReactionGroup from "@/features/reactions/components/ReactionGroup"
import CommentGroup from "@/features/comments/components/CommentGroup"
import { formatDate } from "@/utils/format-date"
import UserAvatar from "@/features/auth/components/UserAvatar"
import SkillBadges from "@/features/skills/components/SkillBadges"
import MiracleButton from "@/components/miracle/Button"
import path from "path"
import { promises as fs } from "fs"
import { formatReadingTime, getMdxReadingTime } from "@/utils/reading-time"
import MiracleBanner from "@/components/miracle/Banner"
import ProjectShareButton from "./ProjectShareButton"
import ViewTracker from "@/features/shared/components/ViewTracker"

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

  const project = await queryClient.fetchQuery({
    queryKey: ["project", slug, locale],
    queryFn: () => getProject({ locale, slug }),
  })

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

      const fileExists = await fs.access(filePath).then(() => true).catch(() => false)
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
      <ViewTracker 
        id={project.id} 
        rpcName="increment_project_view" 
        rpcParamKey="project_id" 
      />
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

          <div className="mb-10 w-full">
            {project.thumbnail && (
              <MiracleReveal animation="zoom-in" className="hidden w-full md:block">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-sm">
                  <Image
                    src={project.thumbnail}
                    alt={project.name}
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 1280px) 100vw, 1200px"
                  />
                </div>
              </MiracleReveal>
            )}

            {/* Card Meta Data */}
            <MiracleReveal animation="fade-up" delay={0.1}>
              <div className="bg-primary border-primary relative z-1 rounded-2xl border md:mx-6 md:-mt-40 lg:mx-8 lg:-mt-60">
                {project.thumbnail && (
                  <div className="relative block aspect-video w-full overflow-hidden rounded-t-2xl shadow-sm md:hidden">
                    <Image
                      src={project.thumbnail}
                      alt={project.name}
                      fill
                      className="object-cover object-top"
                      priority
                      sizes="(max-width: 1280px) 100vw, 1200px"
                    />
                  </div>
                )}

                {/* Top Section */}
                <div className="p-5 md:p-6">
                  <header className="mb-4 flex items-start gap-4 md:gap-5">
                    <div className="flex flex-1 flex-col items-start gap-1.5">
                      {project.is_featured && (
                        <MiracleBadge color="yellow" variant="secondary" startIcon={<LuCrown />} className="mb-2">
                          {t("featured")}
                        </MiracleBadge>
                      )}

                      <Heading id={slug} level={1} className="text-2xl! font-bold md:text-3xl! lg:text-4xl!">
                        {project.name}
                      </Heading>

                      <p className="text-secondary flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
                        <span className="flex items-center gap-1">
                          <LuEye className="shrink-0" />
                          {project.view_count + 1} {t("views", { count: project.view_count + 1 })}
                        </span>

                        <span className="flex items-center gap-1">
                          <LuTimer className="shrink-0" />
                          {displayReadingTime} {t("read")}
                        </span>
                      </p>
                    </div>

                    <ProjectShareButton title={project.name} description={project.description} />
                  </header>

                  <p className="text-secondary mt-2 text-sm">{project.description}</p>

                  {(project.additional_info || project.additional_info_label) && (
                    <div className="col-span-full mt-4">
                      <MiracleBanner color="yellow" variant="secondary" startIcon={<LuTriangleAlert />} title={project.additional_info_label ?? undefined}>
                        {project.additional_info ?? undefined}
                      </MiracleBanner>
                    </div>
                  )}
                </div>

                {/* Mid Section */}
                <div className="border-primary grid grid-cols-1 gap-5 border-t p-5 md:grid-cols-2 md:p-6">
                  {/* Author */}
                  <div className="flex flex-col gap-2">
                    <p className="text-secondary text-xs tracking-tight uppercase">{t("label.author")}</p>
                    <div className="flex items-center gap-2">
                      <UserAvatar user={project.author} className="h-8 w-8" />
                      <p className="text-primary text-sm font-medium">{project.author.full_name}</p>
                    </div>
                  </div>

                  {/* Date Created */}
                  {project.published_at && (
                    <div className="flex flex-col gap-2">
                      <p className="text-secondary text-xs tracking-tight uppercase">{t("label.date")}</p>
                      <div className="text-primary flex items-center gap-2 text-sm font-medium">
                        <LuCalendar size={16} className="text-secondary" />
                        {formatDate({ date: project.published_at, locale, dateStyle: "full" })}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  <div className="col-span-full flex flex-col gap-2">
                    <p className="text-secondary text-xs tracking-tight uppercase">{t("label.categories")}</p>
                    <div className="text-primary flex flex-wrap items-center gap-2 text-sm font-medium">
                      {project.categories.map((category, index) => (
                        <MiracleBadge key={index} className="capitalize" color="blue" variant="secondary" pill>
                          {category.name}
                        </MiracleBadge>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack */}
                  <div className="col-span-full flex flex-col gap-2">
                    <p className="text-secondary text-xs tracking-tight uppercase">{t("label.tech-stack")}</p>
                    <SkillBadges skills={project.skills} />
                  </div>

                  {/* Actions */}
                  <div className="col-span-full mt-1 flex flex-col gap-2 md:flex-row">
                    <MiracleButton href={project.url ?? undefined} endIcon={<LuArrowUpRight />} disabled={!project.url} fullWidth>
                      {t("live-demo")}
                    </MiracleButton>
                    <MiracleButton href={project.github_url ?? undefined} startIcon={<LuGithub />} variant="secondary" disabled={!project.github_url} className="shrink-0">
                      {t("source-code")}
                    </MiracleButton>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="border-primary flex items-center justify-end border-t px-5 py-3 md:px-6">
                  <ReactionGroup targetId={project.id} targetType="project" initialSummary={project.reaction_summary} />
                  <CommentGroup targetId={project.id} targetType="project" initialCount={project.comment_count} />
                </div>
              </div>
            </MiracleReveal>
          </div>

          {/* Render MDX Content */}
          {Content && <Content />}
        </Article>

        <aside className="sticky top-30 hidden w-64 shrink-0 lg:block">
          <TableOfContents />
        </aside>
      </Container>
    </HydrationBoundary>
  )
}