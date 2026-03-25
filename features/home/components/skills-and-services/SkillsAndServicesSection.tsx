import Section from '@/components/Section'
import Link from 'next/link'
import Heading from '@/components/Heading'
import { useLocale, useTranslations } from 'next-intl'
import { getServices } from '../../services/services'
import ServiceCard, { ServiceType } from './ServiceCard'
import FrontendIllustration from './illustrations/FrontendIllustration'
import BackendIllustration from './illustrations/BackendIllustration'
import AndroidIllustration from './illustrations/AndroidIllustration'
import UxIllustration from './illustrations/UxIllustration'
import PmIllustration from './illustrations/PmIllustration'
import DevopsIllustration from './illustrations/DevopsIllustration'
import React, { Suspense } from 'react'
import SkillsAndServicesSkeleton from './SkillsAndServicesSkeleton'

const illustrationsMap: Record<string, React.ReactNode> = {
  "front-end": <FrontendIllustration />,
  "back-end": <BackendIllustration />,
  "ui-ux": <UxIllustration />,
  android: <AndroidIllustration />,
  pm: <PmIllustration />,
  devops: <DevopsIllustration />,
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
          skills: [],
          featured: dbService.level === "expert",
        }
        return <ServiceCard key={dbService.id} service={service} />
      })}
    </div>
  )
}

export default function SkillsAndServicesSection() {
  const t = useTranslations("pages.home.skills-and-services")
  const locale = useLocale()

  return (
    <Section>
      <Heading id="skills-and-services">
        {t("title")}
      </Heading>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        {t("description")}
      </p>      
      
      <Suspense fallback={<SkillsAndServicesSkeleton />}>
        <ServiceList locale={locale} />
      </Suspense>
    </Section>
  )
}
