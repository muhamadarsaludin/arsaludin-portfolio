import { getTranslations } from 'next-intl/server';
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs';
import Section from '@/components/Section';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import TableOfContents from '@/components/TableOfContents';
import Article from '@/components/Article';
import MiracleBadge from '@/components/miracle/Badge';
import { LuCalendar } from 'react-icons/lu';

type PrivacyPolicyPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPolicyPage({params}: PrivacyPolicyPageProps) {
  const {locale} = await params
  const t = await getTranslations("pages.privacy-policy")

  let Content;
  try {
    Content = locale === 'id' 
      ? (await import('../markdown/privacy-policy-id.mdx')).default
      : (await import('../markdown/privacy-policy-en.mdx')).default;
  } catch (error) {
    console.error("MDX file not found", error);
    notFound();
  }

  return (
    <Container className="flex gap-6 md:gap-8 items-start">
      <Article className="pb-13 lg:pb-23 flex-1">
        <MiracleBreadcrumbs 
          locales={routing.locales}
          overrides={{
            home: t("breadcrumbs.home"),
            "privacy-policy": t("breadcrumbs.privacy-policy")
          }}
          className="mb-5 md:mb-6"
        />
        <Section className="w-full">
          <MiracleBadge startIcon={<LuCalendar/>} className="mb-4">Last Updated: April 24, 2026</MiracleBadge>
          <Content />
        </Section>
      </Article>
      <TableOfContents className="hidden lg:block sticky top-30 shrink-0" />
    </Container>
  )
}


