import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ExperienceList } from "./ExperienceList"
import clsx from "clsx"
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
      <Section className={clsx(className)}>
        <MiracleReveal animation="fade-right">
          <Heading
            id="experience"
            className="text-3xl md:text-4xl lg:text-5xl mb-8 lg:mb-10 xl:mb-12"
            linkClassName="text-[0.4em]!"
            noMarginTop
            fontWeight="semibold"
          >
            {t("title")}
          </Heading>
        </MiracleReveal>
        <ExperienceList locale={locale} />
      </Section>
    </HydrationBoundary>
  )
}