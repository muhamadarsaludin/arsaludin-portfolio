import Article from '@/components/Article'
import Container from '@/components/Container'
import Heading from '@/components/Heading'
import MiracleBreadcrumbs from '@/components/miracle/Breadcrumbs'
import TableOfContents from '@/components/TableOfContents'
import { routing } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import GearAndSetupCard from './GearAndSetupCard'
import { MiracleReveal } from '@/components/miracle/Reveal'
import Image from 'next/image'
import { getGearAndSetup } from '../data'

type GearAndSetupPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function GearAndSetupPage({ params }: GearAndSetupPageProps) {
  const { locale } = await params
  const t = await getTranslations("pages.gear-and-setup")
  const gearAndSetupData = getGearAndSetup(locale)

  const renderedGearSetups = gearAndSetupData.map((group, groupIndex) => {
    const categoryId = group.category
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

    return (
      <div key={groupIndex} className="w-full">
        <MiracleReveal animation="fade-right">
          <Heading 
            id={categoryId} 
            level={2} 
            className="mb-6 capitalize font-semibold"
          >
            {group.category}
          </Heading>
        </MiracleReveal>
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {group.items.map((item, itemIndex) => (
            <MiracleReveal key={itemIndex} animation="fade-up">
              <GearAndSetupCard item={item} />
            </MiracleReveal>
          ))}
        </div>
      </div>
    )
  })

  return (
    <Container className="flex gap-6 md:gap-8 items-start w-full">
      <Article className="pb-13 lg:pb-23 flex-1 w-full">
        <MiracleReveal animation="fade-right">
          <MiracleBreadcrumbs 
            locales={routing.locales}
            overrides={{
              home: t("breadcrumbs.home"),
              "gear-and-setup": t("breadcrumbs.gear-and-setup")
            }}
            className="mb-5 md:mb-6"
          />
          <header>
            <Heading 
              id={t("title")}
              level={1}
              className="font-semibold"
            >
              {t("title")}
            </Heading>
            <p className='mt-4 text-secondary'>{t("description")}</p>
          </header>
        </MiracleReveal>
        {/* Hero Setup Image */}
        <MiracleReveal animation="zoom-in">
          <div className="w-full aspect-video bg-secondary border border-primary rounded-2xl overflow-hidden mt-6 md:mt-8 relative shadow-sm">
            <Image
              src="/gear-and-setup/gear-and-setup.webp"
              alt="My Workspace Gear and Setup"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        </MiracleReveal>
        <div className="mt-12 space-y-12">
          {renderedGearSetups}
        </div>
      </Article>
      <TableOfContents className="hidden lg:block sticky top-30 shrink-0" />
    </Container>
  )
}