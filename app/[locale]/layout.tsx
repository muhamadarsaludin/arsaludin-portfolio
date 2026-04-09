import type { Metadata, Viewport } from "next"
import { metadata as metaConfig } from "@/configs/metadata"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { geist, geistMono, outfit } from "@/configs/font"
import "../globals.css"
import Header from "@/components/header/Header"
import Footer from "@/components/Footer"
import BackToTop from "@/components/BackToTop"
import { Providers } from "@/providers/Providers"
import { createClient } from "@/lib/supabase/server"

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = metaConfig
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
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  let user = null

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (!error && data?.user) {
      user = data.user
    }
  } catch (err) {
    console.error("Supabase Auth Error in Layout:", err)
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} ${outfit.variable} bg-primary text-primary antialiased`}
      >
        <Providers initialUser={user}>
          <NextIntlClientProvider locale={locale}>
            <Header />
            <main className="pt-25 lg:pt-30">{children}</main>
            <Footer />
            <BackToTop />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
