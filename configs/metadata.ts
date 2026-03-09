import { Metadata } from "next";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_SITE_URL ?? "https://arsaludin.my.id";

export const metadata: Metadata = {
  title: "Arsaludin - UX Engineer",
  description:
    "Arsaludin - UX Engineer with 4+ years of experience in front end engineering and design systems. Specialized in building scalable UI libraries, translating product requirements and UI/UX designs into high-quality code across web and Android, and bridging collaboration between designers, product managers, and developers.",
  authors: { 
    name: "Muhamad Arsaludin",
    url: baseUrl
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
    "Software Engineer"
  ],
  applicationName: "Arsaludin Portfolio",
  metadataBase: baseUrl ? new URL(baseUrl) : undefined,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  openGraph: {
    title: "Arsaludin - UX Engineer",
    description: "Arsaludin - UX Engineer with 4+ years of experience in front end engineering and design systems. Specialized in building scalable UI libraries, translating product requirements and UI/UX designs into high-quality code across web and Android, and bridging collaboration between designers, product managers, and developers.",
    url: baseUrl,
    siteName: "Arsaludin Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arsaludin Portfolio",
      },
    ]
  },
}