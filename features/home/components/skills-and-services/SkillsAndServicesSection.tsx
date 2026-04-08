import Section from "@/components/Section"
import Heading from "@/components/Heading"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { getServices } from "@/features/services/services/services"
import { ServiceList } from "./ServiceList"
import clsx from "clsx"

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
      <Section className={clsx(className)}>
        <div className="w-full md:w-8/12 lg:w-6/12 mx-auto flex flex-col items-center text-center mb-10">
          <Heading 
            id="skills-and-services" 
            fontWeight="semibold"
            className="text-3xl md:text-4xl lg:text-5xl"
            linkClassName="text-[0.4em]!"
            noMarginTop>
            {t("title")}
          </Heading>
          <p className="text-secondary mt-4">{t("description")}</p>
        </div>
        <ServiceList locale={locale} />
      </Section>
    </HydrationBoundary>
  )
}