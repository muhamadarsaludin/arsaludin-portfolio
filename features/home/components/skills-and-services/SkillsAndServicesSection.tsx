import Section from "@/components/Section"
import Heading from "@/components/Heading"
import { useLocale, useTranslations } from "next-intl"
import { getServices } from "../../services/services"
import ServiceCard from "./ServiceCard"
import { Suspense } from "react"
import ServiceCardSkeleton from "./ServiceCardSkeleton"

async function ServiceList({ locale }: { locale: string }) {
  const services = await getServices(locale)
  return (
    <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {services.map((service) => {
        return <ServiceCard key={service.id} service={service} />
      })}
    </div>
  )
}

function ServiceListSkeleton() {
  return (
    <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {[...Array(6)].map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function SkillsAndServicesSection({ className }: { className?: string }) {
  const t = useTranslations("pages.home.skills-and-services")
  const locale = useLocale()
  return (
    <Section className={className}>
      <Heading id="skills-and-services">{t("title")}</Heading>
      <p className="mt-4 text-secondary">{t("description")}</p>
      <Suspense fallback={<ServiceListSkeleton />}>
        <ServiceList locale={locale} />
      </Suspense>
    </Section>
  )
}
