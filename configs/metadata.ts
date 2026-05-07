import { routing } from "@/i18n/routing"
import type { Metadata } from "next"

const baseUrl =
  process.env.NODE_ENV === "production"
    ? (process.env.NEXT_PUBLIC_SITE_URL ?? "https://arsaludin.my.id")
    : "http://localhost:3000"

type ConstructMetadataParams = {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
  locale?: string
}

export function constructMetadata ({
  title,
  description,
  image = "/og-image.webp",
  noIndex = false,
  locale = routing.defaultLocale,
}: ConstructMetadataParams = {}) : Metadata {
  const localeMapper: Record<string, string> = {
    en: "en_US",
    id: "id_ID",
  }
  const selectedLocale = localeMapper[locale] || "en_US"

  const metaTitle = title ? `${title} | Arsaludin` : "Arsaludin — UX Engineer"
  const metaDescription = description ?? "Arsaludin - UX Engineer with 4+ years of experience in front end engineering and design systems. Specialized in building scalable UI libraries, translating product requirements and UI/UX designs into high-quality code across web and Android, and bridging collaboration between designers, product managers, and developers."

  return {
    title: metaTitle,
    description: metaDescription,
    metadataBase: new URL(baseUrl),
    authors: {
      name: "Muhamad Arsaludin",
      url: baseUrl,
    },
    keywords: [
      "Arsaludin",
      "Muhamad Arsaludin",
      "Portfolio",
      "UX Engineer",
      "UI Engineer",
      "Design System",
      "Design Engineer",
      "Design Technologist",
      "Frontend Developer",
      "Web Developer",
      "Android Developer",
      "Software Engineer",
    ],
    applicationName: "Arsaludin Portfolio",
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    icons: {
      icon: "/favicon/favicon.ico",
      shortcut: "/favicon/favicon.ico",
      apple: "/favicon/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      url: baseUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: "Arsaludin Portfolio",
      locale: selectedLocale,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Arsaludin Portfolio",
        },
      ],
    },
    alternates: {
      canonical: "./",
      languages: {
        "en-US": "/en",
        "id-ID": "/id",
      },
    },
  }
}
