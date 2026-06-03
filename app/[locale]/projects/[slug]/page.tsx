import { constructMetadata } from "@/configs/metadata"
import ProjectDetailPage from "@/features/projects/components/ProjectDetailPage"
import { getProject, getAllProjectsSlugs } from "@/features/projects/services/projects"
import type { BasePageProps } from "@/types/page.types"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"

export async function generateStaticParams() {
  try {
    const projects = await getAllProjectsSlugs() 
    const paths: { locale: string; slug: string }[] = []
    
    routing.locales.forEach((locale) => {
      projects.forEach((project) => {
        if (project.slug) {
          paths.push({ locale, slug: project.slug })
        }
      })
    })
    
    return paths
  } catch (error) {
    console.error("Failed to generate static params for project detail:", error)
    return []
  }
}

export const revalidate = 300

export async function generateMetadata({ params }: BasePageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await getProject({ slug, locale })
  const t = await getTranslations("pages.project-detail")

  if (!slug || !project)
    return constructMetadata({
      title: t("title"),
      description: t("description"),
      locale: locale,
    })

  return constructMetadata({
    title: project.name,
    description: project.description,
    locale: locale,
  })
}

export default async function ProjectDetail({ params }: BasePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <ProjectDetailPage params={params} />
}