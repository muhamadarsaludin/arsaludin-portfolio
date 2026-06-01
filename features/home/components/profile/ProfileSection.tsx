import Section from "@/components/Section"
import ProfileHero from "./ProfileHero"
import ProfileStats from "./ProfileStats"
import ProfileInfo from "./ProfileInfo"
import { getTranslations } from "next-intl/server"
import ProfileImage from "./ProfileImage"
import { cn } from "@/utils/class-name"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getStats } from "@/features/stats/services/stats"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { getQueryClient } from "@/lib/query-client"

export default async function ProfileSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.profile")
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["stats"],
    queryFn: () => getStats(),
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={cn("relative", className)}>
        <MiracleReveal animation="fade-up">
          <ProfileHero />
        </MiracleReveal>
        {/* Container */}
        <div className="relative z-1 -mt-20 grid w-full grid-cols-1 gap-4 md:grid-cols-[auto_1fr] md:gap-6 lg:grid-cols-[auto_1fr_auto] lg:gap-8">
          {/* Image */}
          <MiracleReveal animation="fade-right" delay={0.5} className="flex justify-start">
            <ProfileImage className="ml-4 lg:ml-6 xl:ml-8" />
          </MiracleReveal>
          {/* data */}
          <MiracleReveal animation="fade-right" delay={0.5} className="min-w-max md:mt-20 md:pt-6">
            <ProfileInfo />
          </MiracleReveal>
          {/* stats */}
          <MiracleReveal
            animation={{
              default: "fade-right",
              lg: "fade-left",
            }}
            delay={0.5}
            className="max-w-full overflow-hidden md:col-span-full lg:col-auto lg:mt-20 lg:pt-6"
          >
            <ProfileStats />
          </MiracleReveal>
          {/* description */}
          <MiracleReveal animation="fade-right" delay={0.5} className="col-span-full">
            <p className="text-secondary max-w-full text-sm md:text-base lg:max-w-7/12">
              {t("about")}
            </p>
          </MiracleReveal>
        </div>
      </Section>
    </HydrationBoundary>
  )
}
