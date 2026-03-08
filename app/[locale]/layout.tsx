import { Metadata } from 'next';
import { metadata as metaConfig } from '@/config/metadata';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { Providers } from "@/providers/providers";
import { geist, geistMono } from "@/config/font";
import "../globals.css";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export const metadata: Metadata = metaConfig;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
