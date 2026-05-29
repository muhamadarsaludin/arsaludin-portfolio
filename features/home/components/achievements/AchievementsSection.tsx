import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import MiracleButton from "@/components/miracle/Button"
import Link from "next/link"
import clsx from "clsx"
import { LuArrowRight } from "react-icons/lu"
import { getFeaturedAchievements } from "@/features/achievements/services/achievements"
import { AchievementList } from "./AchievementList"
import { MiracleReveal } from "@/components/miracle/Reveal"

/**
 * Server Component: Prefetches featured achievement for optimal SEO and performance.
 * Uses HydrationBoundary to pass data to the client-side TanStack Query cache.
 */
export default async function AchievementsSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.achievements")
  const locale = await getLocale()
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["featured-achievements", locale],
    queryFn: () => getFeaturedAchievements({ locale }),
  })

  return (
    <Section className={clsx(className)}>
      <MiracleReveal animation="fade-right">
        <Heading
          id="featured-achievements"
          className="text-3xl md:text-4xl lg:text-5xl mb-8 lg:mb-10 xl:mb-12"
          linkClassName="text-[0.4em]!"
          noMarginTop
          fontWeight="semibold"
        >
          {t("title")}
        </Heading>
      </MiracleReveal>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AchievementList locale={locale} />
      </HydrationBoundary>
      <div className="flex justify-center mt-6 lg:mt-8 xl:mt-10">
        <MiracleReveal animation="zoom-in">
          <Link href="/achievements" aria-label={t("cta")}>
            <MiracleButton 
              variant="secondary"
              endIcon={<LuArrowRight />}
              tabIndex={-1}>
              {t("cta")}
            </MiracleButton>
          </Link>
        </MiracleReveal>
      </div>
    </Section>
  )
}
