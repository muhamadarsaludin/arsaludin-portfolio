import Section from "@/components/Section"
import Heading from "@/components/Heading"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getServices } from "@/features/services/services/services"
import { ServiceList } from "./ServiceList"
import clsx from "clsx"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { getQueryClient } from "@/lib/query-client"

export default async function SkillsAndServicesSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.skills-and-services")
  const locale = await getLocale()
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["services", locale],
    queryFn: () => getServices({ locale }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={clsx(className)}>
        <MiracleReveal animation="slide-blur-up">
          <div className="mx-auto mb-8 lg:mb-10 xl:mb-12 flex w-full flex-col items-center text-center md:w-8/12 lg:w-6/12">
            <Heading
              id="skills-and-services"
              fontWeight="semibold"
              className="text-3xl md:text-4xl lg:text-5xl"
              linkClassName="text-[0.4em]!"
              noMarginTop
            >
              {t("title")}
            </Heading>
            <p className="text-secondary mt-3 text-sm md:text-base">{t("description")}</p>
          </div>
        </MiracleReveal>
        <ServiceList locale={locale} />
      </Section>
    </HydrationBoundary>
  )
}