"use client"

import React from "react"
import { MiracleReveal } from "@/components/miracle/Reveal"
import ServiceCard from "@/features/services/components/ServiceCard"
import ServiceCardSkeleton from "@/features/services/components/ServiceCardSkeleton"
import { useServices } from "@/features/services/hooks/useServices"
import EmptyStateCard from "@/features/shared/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/components/ErrorStateCard"
import FrontEndIllustration from "@/features/services/components/illustrations/FrontEndIllustration"
import BackEndIllustration from "@/features/services/components/illustrations/BackEndIllustration"
import UiUxIllustration from "@/features/services/components/illustrations/UiUxIllustration"
import AndroidIllustration from "@/features/services/components/illustrations/AndroidIllustration"
import PmIllustration from "@/features/services/components/illustrations/PmIllustration"
import DevOpsIllustration from "@/features/services/components/illustrations/DevOpsIllustration"

const SERVICE_ILLUSTRATION_MAP: Record<string, React.ReactNode> = {
  "front-end": <FrontEndIllustration />,
  "back-end": <BackEndIllustration />,
  "ui-ux": <UiUxIllustration />,
  android: <AndroidIllustration />,
  pm: <PmIllustration />,
  devops: <DevOpsIllustration />,
}

export function ServiceList({ locale }: { locale: string }) {
  const { data: services, isLoading, isError, refetch } = useServices({ locale })

  if (isLoading) return <ServiceListSkeleton />
  if (isError) return <ErrorStateCard onRetry={refetch} />
  if (!services || services.length === 0) return <EmptyStateCard />

  return (
    <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-x-hidden lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {services.map((service, index) => (
        <MiracleReveal
          animation={{
            default: "zoom-in",
            sm: "fade-up",
          }}
          delay={{
            default: 0,
            sm: (index % 6) * 0.1,
          }}
          threshold={0}
          className="w-[75vw] shrink-0 snap-start sm:w-auto"
          key={service.id}
        >
          <ServiceCard
            service={service}
            illustration={SERVICE_ILLUSTRATION_MAP[service.slug]}
            className="h-full w-full"
          />
        </MiracleReveal>
      ))}
    </div>
  )
}

export function ServiceListSkeleton() {
  return (
    <div className="flex max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-x-hidden lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <ServiceCardSkeleton key={i} className="w-[75vw] shrink-0 snap-start sm:w-auto" />
      ))}
    </div>
  )
}
