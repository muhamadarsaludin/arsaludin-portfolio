import Section from '@/components/Section'
import Link from 'next/link'
import Heading from '@/components/Heading'
import { useTranslations } from 'next-intl'
import { services } from './servicesData'
import ServiceCard from './ServiceCard'

export default function SkillsAndServicesSection() {
  const t = useTranslations("pages.home.skills-and-services")
  return (
    <Section data-aos="fade-up">
      <Heading id="skills-and-services">
        {t("title")}
      </Heading>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        {t("description")}
      </p>      
      <div className="mt-8 flex snap-x snap-mandatory gap-4 pb-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>
    </Section>
  )
}
