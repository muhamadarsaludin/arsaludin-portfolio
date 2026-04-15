import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { AchievementList } from "./AchievementList" // Komponen Client Reusable
import MiracleButton from "@/components/miracle/Button"
import Link from "next/link"
import clsx from "clsx"
import { getFeaturedAchievements } from "@/features/achievements/services/achievements"
import { LuArrowRight } from "react-icons/lu"

/**
 * Server Component: Prefetches featured achievement for optimal SEO and performance.
 * Uses HydrationBoundary to pass data to the client-side TanStack Query cache.
 */
export default async function AchievementsSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.achievements")
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["featured-achievements"],
    queryFn: () => getFeaturedAchievements(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={clsx(className)}>
        <Heading
          id="featured-achievements"
          className="text-3xl md:text-4xl lg:text-5xl mb-10 md:mb-12"
          linkClassName="text-[0.4em]!"
          noMarginTop
          fontWeight="semibold"
        >
          {t("title")}
        </Heading>
        <AchievementList />
        <div className="mt-8 flex justify-center md:mt-10">
          <Link href="/achievements" aria-label={t("cta")}>
            <MiracleButton 
              variant="secondary"
              endIcon={<LuArrowRight />}
              tabIndex={-1}>
              {t("cta")}
            </MiracleButton>
          </Link>
        </div>
      </Section>
    </HydrationBoundary>
  )
}
