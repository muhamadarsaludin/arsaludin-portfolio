import Section from "@/components/Section"
import Heading from "@/components/Heading"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { getServices } from "@/features/services/services/services"
import { ServiceList } from "./ServiceList"

/**
 * Server Component: Prefetches data and provides a hydration boundary.
 * This ensures SEO-friendly content and zero layout shift on initial load.
 */
export default async function SkillsAndServicesSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.skills-and-services")
  const locale = await getLocale()
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["services", locale, false],
    queryFn: () => getServices({ locale, isAdminView: false }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={className}>
        <Heading id="skills-and-services">{t("title")}</Heading>
        <p className="text-secondary mt-4">{t("description")}</p>
        <ServiceList locale={locale} />
      </Section>
    </HydrationBoundary>
  )
}