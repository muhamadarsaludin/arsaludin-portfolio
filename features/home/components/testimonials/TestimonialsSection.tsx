import Heading from "@/components/Heading"
import Section from "@/components/Section"
import { getLocale, getTranslations } from "next-intl/server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { IoSparkles } from "react-icons/io5"
import clsx from "clsx"
import { getFeaturedTestimonials } from "@/features/testimonials/services/testimonials"
import { TestimonialList } from "./TestimonialList"
import Quote from "@/features/testimonials/components/Quote"
import Link from "next/link"
import MiracleButton from "@/components/miracle/Button"

/**
 * Server Component: Prefetches featured testimonials for optimal SEO and performance.
 * Uses HydrationBoundary to pass data to the client-side TanStack Query cache.
 */
export default async function TestimonialsSection({ className }: { className?: string }) {
  const t = await getTranslations("pages.home.testimonials")
  const locale = await getLocale()
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["featured-testimonials", locale],
    queryFn: () => getFeaturedTestimonials({ locale })
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Section className={clsx(className)}>
        <div className="relative mb-8 flex w-fit md:mb-10">
          <Heading
            id="featured-projects"
            className="text-3xl md:text-4xl lg:text-5xl"
            linkClassName="text-[0.4em]!"
            noMarginTop
            fontWeight="semibold"
          >
            {t("title")}
          </Heading>
          <Quote className="text-primary absolute -top-4 -right-9 text-4xl md:-top-6 md:-right-12 lg:-right-15 md:text-5xl lg:text-6xl"/>
        </div>
        <TestimonialList locale={locale} />
        <div className="mt-6 flex justify-center md:mt-8">
          <Link href="/testimonials">
            <MiracleButton variant="secondary">{t("cta")}</MiracleButton>
          </Link>
        </div>
      </Section>
    </HydrationBoundary>
  )
}
