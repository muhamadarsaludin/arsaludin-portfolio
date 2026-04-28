import Container from '@/components/Container';
import Heading from '@/components/Heading';
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs';
import Section from '@/components/Section';
import TableOfContents from '@/components/TableOfContents';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { INSPIRATION_WEBSITE } from '../data/inspiration-website';
import { InspirationWebsite } from '../types/inspiration-website.types';
import Article from '@/components/Article';
import InspirationCard from './InspirationCard';

type InspirationWebsitePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function InspirationWebsitePage({ params }: InspirationWebsitePageProps) {
  const {locale} = await params
  const t = await getTranslations("pages.inspiration-website")

  const sortData = (data: InspirationWebsite[]) => {
    return [...data].sort((a, b) => {
      if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;
      return a.author.localeCompare(b.author);
    });
  };

  const personals = sortData(INSPIRATION_WEBSITE.filter(i => i.type === "personal"));
  const organizations = sortData(INSPIRATION_WEBSITE.filter(i => i.type === "organization"));

  return (
    <Container className="flex gap-6 md:gap-8 items-start w-full">
      <Article className="pb-13 lg:pb-23 flex-1 w-full">
        <MiracleBreadcrumbs 
          locales={routing.locales}
          overrides={{
            home: t("breadcrumbs.home"),
            "inspiration-website": t("breadcrumbs.inspiration-website")
          }}
          className="mb-5 md:mb-6"
        />
        <header>
          <Heading 
            id={t("title")}
            level={1}>
              {t("title")}
          </Heading>
          <p className="mt-4 text-secondary">{t("description")}</p>
        </header>
        <Section>
          <Heading level={2}>
            {t("personal")}
          </Heading>
          <div className="flex flex-col gap-4 mt-4">
            {personals.map((item) => (
              <InspirationCard key={item.link} item={item} locale={locale} />
            ))}
          </div>
        </Section>
        <Section>
          <Heading level={2}>
            {t("organization")}
          </Heading>
          <div className="flex flex-col gap-4 mt-4">
            {organizations.map((item) => (
              <InspirationCard key={item.link} item={item} locale={locale} />
            ))}
          </div>
        </Section>
      </Article>
      <TableOfContents className="hidden lg:block sticky top-30 shrink-0" />
    </Container>
  )
}
