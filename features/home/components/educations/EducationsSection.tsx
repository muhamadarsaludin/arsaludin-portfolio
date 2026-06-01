import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { EducationList } from "./EducationList"
import { cn } from "@/utils/class-name"
import { getEducations } from "@/features/educations/services/educations"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { getQueryClient } from "@/lib/query-client"

export default async function EducationsSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.educations")
  const locale = await getLocale()
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["educations", locale],
    queryFn: () => getEducations({ locale }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={cn(className)}>
        <MiracleReveal animation="fade-right">
          <Heading
            id="education"
            className="mb-8 text-3xl md:text-4xl lg:mb-10 lg:text-5xl xl:mb-12"
            linkClassName="text-[0.4em]!"
            noMarginTop
            fontWeight="semibold"
          >
            {t("title")}
          </Heading>
        </MiracleReveal>
        <EducationList locale={locale} />
      </Section>
    </HydrationBoundary>
  )
}
