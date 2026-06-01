import { getAllArticlesSlugs } from "@/features/articles/services/articles"
import { getAllProjectsSlugs } from "@/features/projects/services/projects"
import type { MetadataRoute } from "next"

const BASE_URL = "https://arsaludin.my.id"
const now = new Date()

// static routes
const staticRoutes = [
  { path: "/", priority: 1.0 },
  { path: "/projects", priority: 0.8 },
  { path: "/achievements", priority: 0.8 },
  { path: "/articles", priority: 0.8 },
  { path: "/roadmap", priority: 0.8 },
  { path: "/lounge", priority: 0.8 },
  { path: "/changelog", priority: 0.7 },
  { path: "/gear-and-setup", priority: 0.7 },
  { path: "/inspiration-website", priority: 0.7 },
  { path: "/privacy-policy", priority: 0.5 },
]

const getAlternates = (path: string) => ({
  languages: {
    en: `${BASE_URL}/en${path}`,
    id: `${BASE_URL}/id${path}`,
    "x-default": `${BASE_URL}/en${path}`,
  },
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = []

  // =========================
  // STATIC PAGES
  // =========================
  for (const route of staticRoutes) {
    urls.push({
      url: `${BASE_URL}/en${route.path}`,
      lastModified: now,
      priority: route.priority,
      alternates: getAlternates(route.path),
    })

    urls.push({
      url: `${BASE_URL}/id${route.path}`,
      lastModified: now,
      priority: route.priority,
      alternates: getAlternates(route.path),
    })
  }

  // =========================
  // PROJECTS (DYNAMIC)
  // =========================
  const projects = await getAllProjectsSlugs()

  for (const project of projects) {
    const path = `/projects/${project.slug}`

    urls.push({
      url: `${BASE_URL}/en${path}`,
      lastModified: project.updated_at ?? now,
      priority: 0.7,
      alternates: getAlternates(path),
    })

    urls.push({
      url: `${BASE_URL}/id${path}`,
      lastModified: project.updated_at ?? now,
      priority: 0.7,
      alternates: getAlternates(path),
    })
  }

  // =========================
  // ARTICLES (DYNAMIC)
  // =========================
  const articles = await getAllArticlesSlugs()

  for (const article of articles) {
    const path = `/articles/${article.slug}`

    urls.push({
      url: `${BASE_URL}/en${path}`,
      lastModified: article.updated_at ?? now,
      priority: 0.7,
      alternates: getAlternates(path),
    })

    urls.push({
      url: `${BASE_URL}/id${path}`,
      lastModified: article.updated_at ?? now,
      priority: 0.7,
      alternates: getAlternates(path),
    })
  }

  return urls
}
