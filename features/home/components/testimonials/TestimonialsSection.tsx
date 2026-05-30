import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import clsx from "clsx"
import { getFeaturedTestimonials } from "@/features/testimonials/services/testimonials"
import { TestimonialList } from "./TestimonialList"
import Quote from "@/features/testimonials/components/Quote"
import { MiracleReveal } from "@/components/miracle/Reveal"
import { getQueryClient } from "@/lib/query-client"

/**
 * Server Component: Prefetches featured testimonials for optimal SEO and performance.
 * Uses HydrationBoundary to pass data to the client-side TanStack Query cache.
 */
export default async function TestimonialsSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.testimonials")
  const locale = await getLocale()
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["featured-testimonials", locale],
    queryFn: () => getFeaturedTestimonials({ locale })
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={clsx(className)}>
        <MiracleReveal animation="fade-right">
          <div className="relative flex w-fit mb-8 lg:mb-10 xl:mb-12">
            <Heading
              id="featured-testimonials"
              className="text-3xl md:text-4xl lg:text-5xl"
              linkClassName="text-[0.4em]!"
              noMarginTop
              fontWeight="semibold"
            >
              {t("title")}
            </Heading>
            <MiracleReveal 
              animation="zoom-in" 
              delay={0.5} 
              className="absolute -top-4 -right-9 md:-top-6 md:-right-12 lg:-right-15"
            >
              <Quote className="text-primary text-4xl md:text-5xl lg:text-6xl"/>
            </MiracleReveal>
          </div>
        </MiracleReveal>
        <TestimonialList locale={locale} />
      </Section>
    </HydrationBoundary>
  )
}