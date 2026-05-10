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

export default async function ProjectDetailPage({ params }: BasePageProps) {
  const t = await getTranslations("pages.project-detail")
  const { locale, slug } = await params
  
  if (!slug) notFound()

  const queryClient = new QueryClient()
  const project = await queryClient.fetchQuery({
    queryKey: ["project", slug, locale],
    queryFn: () => getProject({ locale, slug }),
  })

  if (!project) notFound()

  /**
   * Load MDX Content (Best Practice: Server-side Dynamic Import)
   * Priority: [slug]-[current_locale].mdx 
   * Fallback: [slug]-en.mdx (English as default)
   * Final Error: notFound()
   */
  const Content = await import(`../markdown/${slug}-${locale}.mdx`)
    .then((mod) => mod.default)
    .catch(async () => {
      try {
        if (locale !== 'en') {
          return (await import(`../markdown/${slug}-en.mdx`)).default
        }
        throw new Error("English file missing or already on English locale")
      } catch (err) {
        console.error(`[MDX Error] Content not found for: ${slug}`)
        notFound()
      }
    })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className="flex gap-6 md:gap-8 items-start">
        <Article className="pb-13 lg:pb-23 flex-1 overflow-hidden">
          <MiracleReveal animation="fade-right">
            <MiracleBreadcrumbs 
              locales={routing.locales}
              overrides={{
                home: t("breadcrumbs.home"),
                projects: t("breadcrumbs.projects"),
                [slug]: project.name 
              }}
              className="mb-5 md:mb-6"
            />
            
            <header className="mb-8 lg:mb-10 xl:mb-12 w-full">
              <Heading 
                id={slug}
                level={1}
                className="font-semibold"
              >
                {project.name}
              </Heading>
              <p className="mt-4 text-secondary leading-relaxed max-w-3xl text-lg">
                {project.description}
              </p>
            </header>
          </MiracleReveal>
          <Content />
        </Article>

        <TableOfContents className="hidden lg:block sticky top-30 shrink-0" />
      </Container>
    </HydrationBoundary>
  )
}