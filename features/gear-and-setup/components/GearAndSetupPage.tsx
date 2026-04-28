import Container from '@/components/Container';
import Heading from '@/components/Heading';
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs';
import Section from '@/components/Section';
import TableOfContents from '@/components/TableOfContents';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

type GearAndSetupPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function GearAndSetupPage({ params }: GearAndSetupPageProps) {
  const {locale} = await params
  const t = await getTranslations("pages.gear-and-changelog")

  return (
    <Container className="flex gap-6 md:gap-8 items-start w-full">
      <div className="pb-13 lg:pb-23 flex-1 w-full">
        <MiracleBreadcrumbs 
          locales={routing.locales}
          overrides={{
            home: t("breadcrumbs.home"),
            "gear-and-setup": t("breadcrumbs.gear-and-setup")
          }}
          className="mb-5 md:mb-6"
        />
        <article className="w-full">
          <Heading 
            id={t("title")}
            level={1}>
              {t("title")}
          </Heading>
          <p className='mt-4'>{t("description")}</p>
          <div className="w-full aspect-16/4 bg-secondary border border-primary rounded-2xl mt-6 md:mt-8">
            <div className="flex items-center justify-center h-full">
              <span className="text-sm font-medium">image</span>
            </div>
          </div>
         {/* <Hardware /> */}
        </article>
      </div>
      <TableOfContents className="hidden lg:block sticky top-30 shrink-0" />
    </Container>
  )
}
