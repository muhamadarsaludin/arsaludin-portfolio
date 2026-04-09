import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { EducationList } from "./EducationList"
import clsx from "clsx"
import { getEducations } from "@/features/educations/services/educations"

/**
 * Server Component: Prefetches education for optimal SEO and performance.
 * Uses HydrationBoundary to pass data to the client-side TanStack Query cache.
 */
export default async function EducationsSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.educations")
  const locale = await getLocale()
  const queryClient = new QueryClient()
  const isAdminView = false

  await queryClient.prefetchQuery({
    queryKey: ["educations", locale, { isAdminView }],
    queryFn: () => getEducations({ locale, isAdminView }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={clsx(
        className
      )}>
        <Heading 
          id="education"
          className="text-3xl md:text-4xl lg:text-5xl mb-8 md:mb-10"
          linkClassName="text-[0.4em]!"
          noMarginTop
          fontWeight="semibold">
          {t("title")}
        </Heading>
        <EducationList locale={locale}/>
      </Section>
    </HydrationBoundary>
  )
}