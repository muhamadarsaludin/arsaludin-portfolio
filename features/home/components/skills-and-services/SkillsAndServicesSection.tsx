import Section from '@/components/Section'
import Heading from '@/components/Heading'
import { useLocale, useTranslations } from 'next-intl'
import { getServices } from '../../services/services'
import ServiceCard, { ServiceType } from './ServiceCard'
import FrontEndIllustration from './illustrations/FrontEndIllustration'
import BackEndIllustration from './illustrations/BackEndIllustration'
import AndroidIllustration from './illustrations/AndroidIllustration'
import UiUxIllustration from './illustrations/UiUxIllustration'
import PmIllustration from './illustrations/PmIllustration'
import DevOpsIllustration from './illustrations/DevOpsIllustration'
import React, { Suspense } from 'react'
import ServiceCardSkeleton from './ServiceCardSkeleton'

const illustrationsMap: Record<string, React.ReactNode> = {
  "front-end": <FrontEndIllustration />,
  "back-end": <BackEndIllustration />,
  "ui-ux": <UiUxIllustration />,
  android: <AndroidIllustration/>,
  pm: <PmIllustration />,
  devops: <DevOpsIllustration />,
}

async function ServiceList({ locale }: { locale: string }) {
  const dbServices = await getServices(locale)
  return (
    <div className="mt-8 flex snap-x snap-mandatory gap-4 pb-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {dbServices.map((dbService) => {
        const service: ServiceType = {
          title: dbService.name,
          description: dbService.description,
          illustration: illustrationsMap[dbService.slug] || null,
          skills: dbService.skills,
          featured: dbService.level === "expert",
        }
        return <ServiceCard key={dbService.id} service={service} />
      })}
    </div>
  )
}

function ServiceListSkeleton() {
  return (
    <div className="mt-8 flex snap-x snap-mandatory gap-4 pb-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {[...Array(6)].map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function SkillsAndServicesSection({className} : {className?: string}) {
  const t = useTranslations("pages.home.skills-and-services")
  const locale = useLocale()
  return (
    <Section className={className}>
      <Heading id="skills-and-services">
        {t("title")}
      </Heading>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        {t("description")}
      </p>
      <Suspense fallback={<ServiceListSkeleton />}>
        <ServiceList locale={locale} />
      </Suspense>
      
    </Section>
  )
}
