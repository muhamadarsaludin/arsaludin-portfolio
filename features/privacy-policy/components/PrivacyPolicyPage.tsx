import React from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { LuCalendar } from 'react-icons/lu';

import { routing } from '@/i18n/routing';
import { formatDate } from '@/utils/format-date';

import Article from '@/components/Article';
import Container from '@/components/Container';
import Section from '@/components/Section';
import TableOfContents from '@/components/TableOfContents';
import MiracleBadge from '@/components/miracle/Badge';
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs';
import { MiracleReveal } from '@/components/miracle/Reveal';

type PrivacyPolicyPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPolicyPage({ params }: PrivacyPolicyPageProps) {
  const { locale } = await params;
  const t = await getTranslations("pages.privacy-policy");

  /**
   * Load MDX Content with English Fallback
   * Priority: privacy-policy-[locale].mdx
   * Fallback: privacy-policy-en.mdx
   */
  const Content = await import(`../markdown/privacy-policy-${locale}.mdx`)
    .then((mod) => mod.default)
    .catch(async () => {
      try {
        // Fallback to English if the current locale version is missing
        if (locale !== 'en') {
          return (await import(`../markdown/privacy-policy-en.mdx`)).default;
        }
        throw new Error("English file missing");
      } catch (err) {
        console.error("[MDX Error] Privacy Policy content not found");
        notFound();
      }
    });

  const LATEST_UPDATE_DATE = "29-05-2026";

  return (
    <Container className="flex gap-6 md:gap-8 items-start">
      <Article className="pb-13 lg:pb-23 flex-1">
        <MiracleReveal animation="fade-right">
          <MiracleBreadcrumbs 
            locales={routing.locales}
            overrides={{
              home: t("breadcrumbs.home"),
              "privacy-policy": t("breadcrumbs.privacy-policy")
            }}
            className="mb-5 md:mb-6"
          />
          <Section className="w-full">
            <MiracleBadge startIcon={<LuCalendar />} className="mb-4">
              {t("latestUpdate", { 
                date: formatDate({ date: LATEST_UPDATE_DATE, locale }) 
              })}
            </MiracleBadge>
            <Content />
          </Section>
        </MiracleReveal> 
      </Article>

      <TableOfContents className="hidden lg:block sticky top-30 shrink-0" />
    </Container>
  );
}