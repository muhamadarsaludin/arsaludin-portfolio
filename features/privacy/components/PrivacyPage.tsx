import { getTranslations } from 'next-intl/server';
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs';
import Section from '@/components/Section';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import TableOfContents from '@/components/TableOfContents';

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({params}: PrivacyPageProps) {
  const {locale} = await params
  const t = await getTranslations("pages.privacy")

  let Content;
  try {
    Content = locale === 'id' 
      ? (await import('../markdown/privacy-id.mdx')).default
      : (await import('../markdown/privacy-en.mdx')).default;
  } catch (error) {
    console.error("MDX file not found", error);
    notFound();
  }

  return (
    <Container className="flex gap-4 md:gap-6 items-start">
      <Section className="pb-13 lg:pb-23 flex-1">
        <MiracleBreadcrumbs 
          locales={routing.locales}
          overrides={{
            home: t("breadcrumbs.home"),
            privacy: t("breadcrumbs.privacy")
          }}
          className="mb-5 md:mb-6"
        />
        <article className="w-full">
          <Content />
        </article>
      </Section>
      <TableOfContents className="hidden lg:block sticky top-30 shrink-0" />
    </Container>
  )
}


