import type { Metadata, Viewport } from "next"
import { NextIntlClientProvider } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { geistMono, outfit } from "@/configs/font"
import "../globals.css"
import Header from "@/components/header/Header"
import Footer from "@/components/footer/Footer"
import BackToTop from "@/components/BackToTop"
import { Providers } from "@/providers/Providers"
import { GoogleTagManager } from "@next/third-parties/google"
import { constructMetadata } from "@/configs/metadata"
// import { SpeedInsights } from "@vercel/speed-insights/next"

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  ...constructMetadata(),
  verification: {
    google: "UWxCJFdu6ayRQnwufHhWw2vEaGKQhsE01FHsQ_65334",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e1e" },
  ],
  colorScheme: "light dark",
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params

  type ValidLocale = (typeof routing.locales)[number]

  if (!routing.locales.includes(locale as ValidLocale)) {
    notFound()
  }
  setRequestLocale(locale)

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  const isProduction = process.env.NODE_ENV === "production"

  return (
    <html lang={locale} suppressHydrationWarning>
      {isProduction && gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body
        className={`${geistMono.variable} ${outfit.variable} bg-primary text-primary max-w-screen overflow-x-hidden antialiased`}
      >
        <Providers>
          <NextIntlClientProvider locale={locale}>
            <Header />
            <main className="pt-25 lg:pt-30">{children}</main>
            <Footer />
            <BackToTop />
          </NextIntlClientProvider>
        </Providers>
      </body>
      {/* <SpeedInsights /> */}
    </html>
  )
}
