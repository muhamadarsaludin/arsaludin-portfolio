import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { ExperienceList } from "./ExperienceList"
import clsx from "clsx"
import { getExperiences } from "@/features/experiences/services/experiences"

/**
 * Server Component: Prefetches experience for optimal SEO and performance.
 * Uses HydrationBoundary to pass data to the client-side TanStack Query cache.
 */
export default async function ExperiencesSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.experiences")
  const locale = await getLocale()
  const queryClient = new QueryClient()
  const isAdminView = false

  await queryClient.prefetchQuery({
    queryKey: ["experiences", locale, { isAdminView }],
    queryFn: () => getExperiences({ locale, isAdminView }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={clsx(className)}>
        <Heading
          id="experience"
          className="text-3xl md:text-4xl lg:text-5xl mb-10 md:mb-12"
          linkClassName="text-[0.4em]!"
          noMarginTop
          fontWeight="semibold"
        >
          {t("title")}
        </Heading>
        <ExperienceList locale={locale} />
      </Section>
    </HydrationBoundary>
  )
}
