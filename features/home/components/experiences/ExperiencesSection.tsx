import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ExperienceList } from "./ExperienceList"
import { cn } from "@/utils/class-name"
import { getExperiences } from "@/features/experiences/services/experiences"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { getQueryClient } from "@/lib/query-client"

export default async function ExperiencesSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.experiences")
  const locale = await getLocale()
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["experiences", locale],
    queryFn: () => getExperiences({ locale }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={cn(className)}>
        <MiracleReveal animation="fade-right">
          <Heading
            id="experience"
            className="mb-8 text-3xl md:text-4xl lg:mb-10 lg:text-5xl xl:mb-12"
            linkClassName="text-[0.4em]!"
            noMarginTop
          >
            {t("title")}
          </Heading>
        </MiracleReveal>
        <ExperienceList locale={locale} />
      </Section>
    </HydrationBoundary>
  )
}
