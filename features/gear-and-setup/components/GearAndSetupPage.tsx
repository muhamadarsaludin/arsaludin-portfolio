import Article from '@/components/Article';
import Container from '@/components/Container';
import Heading from '@/components/Heading';
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs';
import Section from '@/components/Section';
import TableOfContents from '@/components/TableOfContents';
import { routing } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { GEAR_AND_SETUP_DATA_EN, GEAR_AND_SETUP_DATA_ID } from '../data/gear-and-setup';
import GearAndSetupCard from './GearAndSetupCard';

type GearAndSetupPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function GearAndSetupPage({ params }: GearAndSetupPageProps) {
  const { locale } = await params;
  const t = await getTranslations("pages.gear-and-setup");
  
  const gearAndSetupData = locale === 'id' ? GEAR_AND_SETUP_DATA_ID : GEAR_AND_SETUP_DATA_EN;

  return (
    <Container className="flex gap-6 md:gap-8 items-start w-full">
      <Article className="pb-13 lg:pb-23 flex-1 w-full">
        <MiracleBreadcrumbs 
          locales={routing.locales}
          overrides={{
            home: t("breadcrumbs.home"),
            "gear-and-setup": t("breadcrumbs.gear-and-setup")
          }}
          className="mb-5 md:mb-6"
        />
        
        <Section className="w-full">
          <Heading 
            id={t("title")}
            level={1}>
              {t("title")}
          </Heading>
          <p className='mt-4 text-secondary'>{t("description")}</p>
          
          <div className="w-full aspect-16/6 bg-secondary border border-primary rounded-2xl mt-6 md:mt-8">
            <div className="flex items-center justify-center h-full">
              <span className="text-sm font-medium text-secondary italic opacity-50">Setup Image Placeholder</span>
            </div>
          </div>
        </Section>

        <div className="mt-12 space-y-12">
          {gearAndSetupData.map((group, groupIndex) => (
            <Section key={groupIndex} className="w-full">
              <Heading 
                id={group.category.toLowerCase().replace(/\s+/g, '-')} 
                level={2} 
                className="mb-6 capitalize">
                {group.category}
              </Heading>
              
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {group.items.map((item, itemIndex) => (
                  <GearAndSetupCard key={itemIndex} item={item} />
                ))}
              </div>
            </Section>
          ))}
        </div>
      </Article>
      
      <TableOfContents className="hidden lg:block sticky top-30 shrink-0" />
    </Container>
  )
}