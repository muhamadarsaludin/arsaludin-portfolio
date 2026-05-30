import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { ProjectList } from "./ProjectList"
import MiracleButton from "@/components/miracle/Button"
import { IoSparkles } from "react-icons/io5"
import clsx from "clsx"
import { LuArrowRight } from "react-icons/lu"
import { getFeaturedProjects } from "@/features/projects/services/projects"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { getQueryClient } from "@/lib/query-client"

export default async function ProjectsSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.projects")
  const locale = await getLocale()
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["featured-projects", locale],
    queryFn: () => getFeaturedProjects({ locale }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={clsx(className)}>
        <MiracleReveal animation="fade-right">
          <div className="relative mb-8 lg:mb-10 xl:mb-12 flex w-fit">
            <Heading
              id="featured-projects"
              className="max-w-[10ch] text-3xl md:text-4xl lg:text-5xl"
              linkClassName="text-[0.4em]!"
              noMarginTop
              fontWeight="semibold"
            >
              {t("title")}
            </Heading>
            <MiracleReveal animation="zoom-in" delay={0.5} className="absolute -top-3 -right-4 md:-top-10 md:-right-5">
              <IoSparkles className="text-yellow text-4xl md:text-5xl lg:text-6xl" />
            </MiracleReveal>
          </div>
        </MiracleReveal>

        <ProjectList locale={locale}/>

        <div className="flex justify-center mt-6 lg:mt-8 xl:mt-10">
          <MiracleReveal animation="zoom-in">
            <MiracleButton 
              href="/projects"
              variant="secondary"
              endIcon={<LuArrowRight />}
            >
              {t("cta")}
            </MiracleButton>
          </MiracleReveal>
        </div>
      </Section>
    </HydrationBoundary>
  )
}