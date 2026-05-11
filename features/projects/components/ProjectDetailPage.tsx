import React from 'react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { BasePageProps } from '@/types/page.types'
import { getProject } from '../services/projects'
import { routing } from '@/i18n/routing'

import Article from '@/components/Article'
import Container from '@/components/Container'
import Heading from '@/components/Heading'
import TableOfContents from '@/components/TableOfContents'
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs'
import { MiracleReveal } from '@/components/miracle/Reveal'
import Image from 'next/image'
import { LuArrowUpRight, LuCalendar, LuCrown, LuEye, LuGithub, LuShare2, LuTimer, LuTriangleAlert } from 'react-icons/lu'
import MiracleBadge from '@/components/miracle/Badge'
import ReactionGroup from '@/features/reactions/components/ReactionGroup'
import CommentGroup from '@/features/comments/components/CommentGroup'
import { formatDate } from '@/utils/format-date'
import UserAvatar from '@/features/auth/components/UserAvatar'
import SkillBadges from '@/features/skills/components/SkillBadges'
import MiracleButton from '@/components/miracle/Button'
import clsx from 'clsx'
import { createClient } from '@/lib/supabase/server'
import path from 'path'
import fs from "fs"
import { formatReadingTime, getMdxReadingTime } from '@/utils/reading-time'
import MiracleBanner from '@/components/miracle/Banner'
import ProjectShareButton from './ProjectShareButton'

export default async function ProjectDetailPage({ params }: BasePageProps) {
  const t = await getTranslations("pages.project-detail")
  const { locale, slug } = await params
  const supabase = await createClient()
  
  if (!slug) notFound()

  const queryClient = new QueryClient()
  const project = await queryClient.fetchQuery({
    queryKey: ["project", slug, locale],
    queryFn: () => getProject({ locale, slug }),
  })

  if (!project) notFound()

  const { error: viewError } = await supabase.rpc('increment_view', { 
    project_id: project.id 
  });

  if (viewError) {
    console.error("Error increment view:", viewError.message);
  } 

  /**
   * Reading Time Calculation
   * Get string from Title + Description + Raw MDX
   */
  let rawContent = `${project.name} ${project.description}`;
  try {
    const mdxDir = path.join(process.cwd(), 'src/app/[locale]/projects/markdown');
    const targetPath = path.join(mdxDir, `${slug}-${locale}.mdx`);
    const fallbackPath = path.join(mdxDir, `${slug}-en.mdx`);

    if (fs.existsSync(targetPath)) {
      rawContent += " " + fs.readFileSync(targetPath, 'utf8');
    } else if (locale !== 'en' && fs.existsSync(fallbackPath)) {
      rawContent += " " + fs.readFileSync(fallbackPath, 'utf8');
    }
  } catch (err) {
    console.error("Gagal mengambil teks MDX:", err);
  }

  // Hitung menit (angka)
  const stats = getMdxReadingTime(rawContent);
  const displayReadingTime = formatReadingTime(stats.minutes, locale);

  /**
   * Load MDX Content
   */
  const Content = await import(`../markdown/${slug}-${locale}.mdx`)
    .then((mod) => mod.default)
    .catch(async () => {
      try {
        if (locale !== 'en') {
          return (await import(`../markdown/${slug}-en.mdx`)).default
        }
        return null
      } catch (err) {
        return null
      }
    })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className="flex flex-col lg:flex-row gap-8 items-start py-6">
        <Article className="pb-13 lg:pb-23 flex-1 w-full">
          <MiracleReveal animation="fade-right">
            <MiracleBreadcrumbs 
              locales={routing.locales}
              overrides={{
                home: t("breadcrumbs.home"),
                projects: t("breadcrumbs.projects"),
                [slug]: project.name 
              }}
              className="mb-6"
            />
          </MiracleReveal>

          <div className="w-full mb-10">
            {project.thumbnail && (
              <MiracleReveal animation="zoom-in" className="w-full hidden md:block">
                <div className="w-full aspect-video relative rounded-2xl overflow-hidden shadow-sm">
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
              <div className="bg-primary border border-primary md:-mt-40 relative z-1 md:mx-6 lg:mx-8 rounded-2xl">
                {project.thumbnail && (
                  <div className="w-full block md:hidden aspect-video relative rounded-t-2xl overflow-hidden shadow-sm">
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

                {/* Top */}
                <div className='p-5 md:p-6'>
                  {/* Header */}
                  <header className="flex gap-4 md:gap-5 items-start mb-4">
                    {/* Header Content */}
                    <div className="flex-1 flex flex-col gap-1.5 items-start">
                      {project.is_featured && (
                        <MiracleBadge color="yellow" variant="secondary" startIcon={<LuCrown />} className="mb-2">
                          {t("featured")}
                        </MiracleBadge>
                      )}
                      
                      <Heading 
                        id={slug}
                        level={1}
                        className="text-2xl! md:text-3xl! lg:text-4xl! font-bold"
                        linkClassName="text-[0.5em]!">
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
                    
                    <ProjectShareButton title={project.name} description={project.description}/>
                  </header>

                  <p className="mt-2 text-secondary text-sm">
                    {project.description}
                  </p>

                  {/* Banner */}
                  {(project.additional_info || project.additional_info_label) && (
                    <div className="col-span-full mt-4">
                      <MiracleBanner color="yellow" variant="secondary" startIcon={<LuTriangleAlert />} title={project.additional_info_label ?? undefined}>
                        {project.additional_info ?? undefined}
                      </MiracleBanner>
                    </div>
                  )}
                </div>
                {/* Mid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-primary p-5 md:p-6">
                  {/* Author */}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-tight text-secondary">
                      {t("label.author")}
                    </p>
                    <div className="flex items-center gap-2">
                      <UserAvatar user={project.author} className="h-8 w-8"/>
                      <p className="text-sm text-primary font-medium">
                        {project.author.full_name}
                      </p>
                    </div>
                  </div>
      
                  {/* Date Created*/}
                  <div className="flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-tight text-secondary">
                      {t("label.date")}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <LuCalendar size={16} className="text-secondary" />
                      {formatDate({ date: project.created_at, locale, dateStyle: "full" })}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-col gap-2 col-span-full">
                    <p className="text-xs uppercase tracking-tight text-secondary">
                      {t("label.categories")}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-primary font-medium">
                      {project.categories.map((category, index) => (
                        <MiracleBadge key={index} className="capitalize" color="blue" variant="secondary" pill>
                          {category.name}
                        </MiracleBadge>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-col gap-2 col-span-full">
                    <p className="text-xs uppercase tracking-tight text-secondary">
                      {t("label.tech-stack")}
                    </p>
                    <SkillBadges skills={project.skills} />
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col md:flex-row gap-2 col-span-full mt-1">
                    <MiracleButton href={project.url ?? undefined} endIcon={<LuArrowUpRight />} disabled={!project.url} fullWidth>
                      {t("live-demo")}
                    </MiracleButton>
                    <MiracleButton href={project.github_url ?? undefined} startIcon={<LuGithub />} variant="secondary" disabled={!project.github_url} className="shrink-0">
                      {t("source-code")}
                    </MiracleButton>
                  </div>
                </div>  

                {/* Bottom */}
                <div className="flex items-center justify-end px-5 md:px-6 py-3 border-t border-primary">
                  <ReactionGroup targetId={project.id} targetType="project" initialSummary={project.reaction_summary} />
                  <CommentGroup targetId={project.id} targetType="project" initialCount={project.comment_count} />
                </div>              
              </div>
            </MiracleReveal>
          </div>


          {/* Render MDX Content jika ada, jika tidak biarkan kosong */}
          <div className="mt-4">
            {Content && <Content />}
          </div>
        </Article>

        <aside className="hidden lg:block sticky top-30 w-64 shrink-0">
          <TableOfContents />
        </aside>
      </Container>
    </HydrationBoundary>
  )
}