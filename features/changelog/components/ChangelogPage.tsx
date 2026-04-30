import { getTranslations } from 'next-intl/server';
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs';
import Section from '@/components/Section';
import { routing } from '@/i18n/routing';
import Container from '@/components/Container';
import TableOfContents from '@/components/TableOfContents';
import Heading from '@/components/Heading';
import { getChangelog } from '../data';
import { compileMDX } from '@/lib/mdx';
import ChangelogItem from './ChangelogItem';
import Article from '@/components/Article';

type ChangelogPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ChangelogPage({params}: ChangelogPageProps) {
  const {locale} = await params
  const t = await getTranslations("pages.changelog")
  const changelog = getChangelog(locale)
  

  return (
    <Container className="flex gap-6 md:gap-8 items-start w-full">
      <Article className="pb-13 lg:pb-23 flex-1 w-full">
        <MiracleBreadcrumbs 
          locales={routing.locales}
          overrides={{
            home: t("breadcrumbs.home"),
            changelog: t("breadcrumbs.changelog")
          }}
          className="mb-5 md:mb-6"
        />
        <div className="mb-10 md:mb-12 w-full">
          <Heading 
            id={t("title")}
            level={1}
            className="font-semibold">
              {t("title")}
          </Heading>
          <p className="mt-4 text-secondary">{t("description")}</p>
        </div>
        
        <Section className="flex flex-col w-full">
          {await Promise.all(
            changelog.map(async (item, index) =>{
              const MDXContent = await compileMDX(item.changes);
              const isLatest = index === 0;
              return (
                <ChangelogItem key={item.version} version={item.version} releaseDate={item.releaseDate} banner={item.banner} showDetail={isLatest} isLatest={isLatest}>
                  <MDXContent />
                </ChangelogItem>
              )
            })
          )}
        </Section>
      </Article>
      <TableOfContents className="hidden lg:block sticky top-30 shrink-0" />
    </Container>
  )
}
