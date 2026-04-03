import Section from "@/components/Section"
import Heading from "@/components/Heading"
import { useLocale, useTranslations } from "next-intl"
import { Suspense } from "react"
import ServiceCardSkeleton from "@/features/services/components/ServiceCardSkeleton"
import ServiceCard from "@/features/services/components/ServiceCard"
import { getServices } from "@/features/services/services/services"

export default function SkillsAndServicesSection({ className }: { className?: string }) {
  const t = useTranslations("pages.home.skills-and-services")
  const locale = useLocale()

  return (
    <Section className={className}>
      <Heading id="skills-and-services">{t("title")}</Heading>
      <p className="text-secondary mt-4">{t("description")}</p>
      
      {/* Suspense handles the loading state (streaming) */}
      <Suspense fallback={<ServiceListSkeleton />}>
        <ServiceList locale={locale} />
      </Suspense>
    </Section>
  )
}

/**
 * ServiceList handles the data fetching and internal states (Empty & Error).
 * This is a Server Component.
 */
async function ServiceList({ locale }: { locale: string }) {
  try {
    const services = await getServices(locale)
    // Handle Empty State (No records in Database)
    if (!services || services.length === 0) {
      return (
        <div className="mt-8 flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-primary">
          <p className="text-sm text-secondary">No services found for this language.</p>
        </div>
      )
    }
    // Success State
    return (
      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    )
  } catch (error) {
    // Error State (Network failure, Supabase error, etc.)
    console.error("Failed to fetch services:", error)
    return (
      <div className="mt-8 rounded-2xl p-8 text-center bg-red-100 dark:bg-red-950">
        <p className="text-sm font-medium text-red">
          Unable to load services. Please try again later.
        </p>
      </div>
    )
  }
}

/**
 * Skeleton Loader matches the grid layout of the actual list.
 */
function ServiceListSkeleton() {
  return (
    <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {[...Array(6)].map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  )
}