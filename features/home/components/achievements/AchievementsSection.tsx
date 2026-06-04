import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import MiracleButton from "@/components/miracle/Button"
import { cn } from "@/utils/class-name"
import { LuArrowRight } from "react-icons/lu"
import { getFeaturedAchievements } from "@/features/achievements/services/achievements"
import { AchievementList } from "./AchievementList"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { getQueryClient } from "@/lib/query-client"

export default async function AchievementsSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.achievements")
  const locale = await getLocale()
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["featured-achievements", locale],
    queryFn: () => getFeaturedAchievements({ locale }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={cn(className)}>
        <MiracleReveal animation="fade-right">
          <Heading
            id="featured-achievements"
            className="mb-8 text-3xl md:text-4xl lg:mb-10 lg:text-5xl xl:mb-12"
            linkClassName="text-[0.4em]!"
            noMarginTop
          >
            {t("title")}
          </Heading>
        </MiracleReveal>

        <AchievementList locale={locale} />

        <div className="mt-6 flex justify-center lg:mt-8 xl:mt-10">
          <MiracleReveal animation="zoom-in">
            <MiracleButton href="/achievements" variant="secondary" endIcon={<LuArrowRight />}>
              {t("cta")}
            </MiracleButton>
          </MiracleReveal>
        </div>
      </Section>
    </HydrationBoundary>
  )
}
