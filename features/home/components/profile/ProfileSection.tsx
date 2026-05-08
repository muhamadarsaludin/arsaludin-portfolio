import Section from "@/components/Section"
import ProfileHero from "./ProfileHero"
import ProfileStats from "./ProfileStats"
import ProfileInfo from "./ProfileInfo"
import { getTranslations } from "next-intl/server"
import ProfileImage from "./ProfileImage"
import clsx from "clsx"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { getStats } from "@/features/stats/services/stats"
import { MiracleReveal } from "@/components/miracle/Reveal"

export default async function ProfileSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.profile")
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["stats"],
    queryFn: () => getStats(),
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={clsx("relative", className)}>
        <ProfileHero />
          {/* Container */}
        <div className="w-full grid grid-cols-1 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] gap-4 md:gap-6 lg:gap-8 -mt-20 relative z-1">
          {/* Image */}
          <MiracleReveal animation="fade-right" className="flex justify-start">
            <ProfileImage className="ml-4 lg:ml-6 xl:ml-8"/>
          </MiracleReveal>
          {/* data */}
          <MiracleReveal animation="fade-right" className="min-w-max md:mt-20 md:pt-6">
            <ProfileInfo />
          </MiracleReveal>
          {/* stats */}
          <MiracleReveal 
            animation={{
              default: "fade-right",
              lg: "fade-left"
            }}
            className="md:col-span-full lg:col-auto max-w-full overflow-hidden lg:mt-20 lg:pt-6">
            <ProfileStats/>
          </MiracleReveal>
          {/* description */}
          <MiracleReveal animation="fade-right" className="col-span-full">
            <p className="text-secondary max-w-full lg:max-w-7/12 text-sm md:text-base">
              {t("about")}
            </p>
          </MiracleReveal>
        </div>
      </Section>
    </HydrationBoundary>
  )
}
