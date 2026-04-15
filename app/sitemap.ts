import { MetadataRoute } from "next";

const BASE_URL = "https://arsaludin.my.id";
const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const getAlternates = (path: string) => ({
    languages: {
      en: `${BASE_URL}/en${path}`,
      id: `${BASE_URL}/id${path}`,
      'x-default': `${BASE_URL}/en${path}`,
    },
  });

  const pages = [
    { path: "", priority: 1.0 },
    { path: "/projects", priority: 0.8 },
    { path: "/achievements", priority: 0.8 },
    { path: "/blogs", priority: 0.8 },
    { path: "/forum", priority: 0.8 },
    { path: "/changelog", priority: 0.8 },
    { path: "/tech-stack", priority: 0.8 },
    { path: "/vault", priority: 0.8 },
    { path: "/privacy", priority: 0.8 }
  ];

  return pages.map((page) => ({
    url: `${BASE_URL}/en${page.path}`,
    lastModified: now,
    priority: page.priority,
    alternates: getAlternates(page.path),
  }));
}