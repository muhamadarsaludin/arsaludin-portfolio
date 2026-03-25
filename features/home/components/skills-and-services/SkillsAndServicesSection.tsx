import Section from '@/components/Section'
import Link from 'next/link'
import Heading from '@/components/Heading'
import { getLocale, getTranslations } from 'next-intl/server'
import { getServices } from '../../services/services'
import ServiceCard, { ServiceType } from './ServiceCard'
import FrontendIllustration from './illustrations/FrontendIllustration'
import BackendIllustration from './illustrations/BackendIllustration'
import AndroidIllustration from './illustrations/AndroidIllustration'
import UxIllustration from './illustrations/UxIllustration'
import PmIllustration from './illustrations/PmIllustration'
import DevopsIllustration from './illustrations/DevopsIllustration'
import React from 'react'

const illustrationsMap: Record<string, React.ReactNode> = {
  "front-end": <FrontendIllustration />,
  "back-end": <BackendIllustration />,
  "ui-ux": <UxIllustration />,
  android: <AndroidIllustration />,
  pm: <PmIllustration />,
  devops: <DevopsIllustration />,
}

export default async function SkillsAndServicesSection() {
  const t = await getTranslations("pages.home.skills-and-services")
  const locale = await getLocale()
  const dbServices = await getServices(locale)

  return (
    <Section data-aos="fade-up">
      <Heading id="skills-and-services">
        {t("title")}
      </Heading>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        {t("description")}
      </p>      
      <div 
        className="mt-8 flex snap-x snap-mandatory gap-4 pb-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        {dbServices.map((dbService) => {
          const service: ServiceType = {
            title: dbService.name,
            description: dbService.description,
            illustration: illustrationsMap[dbService.slug] || null,
            skills: [],
            featured: dbService.level === "expert",
          }
          return (
            <ServiceCard key={dbService.id} service={service} />
          )
        })}
      </div>
    </Section>
  )
}
