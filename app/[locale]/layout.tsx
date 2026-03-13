import { Metadata, Viewport } from 'next';
import { metadata as metaConfig } from '@/configs/metadata';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { Providers } from "@/providers/providers";
import { geist, geistMono, outfit } from "@/configs/font";
import "../globals.css";
import Header from '@/components/header/Header';
import Footer from '@/components/Footer';
import MiracleBackToTop from '@/components/miracle/BackToTop';

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{locale: string}>
}

export const metadata: Metadata = metaConfig;
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
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale)
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} ${outfit.variable} antialiased bg-surface-primary text-primary rounded-md shadow-md`}>
        <NextIntlClientProvider locale={locale}>
          <Providers>
            <Header/>
            <main className="pt-24">
              {children}
            </main>
            <Footer />
            <MiracleBackToTop/>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}