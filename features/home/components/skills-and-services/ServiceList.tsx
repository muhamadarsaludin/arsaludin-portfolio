"use client"

import { MiracleReveal } from "@/components/miracle/Reveal"
import ServiceCard from "@/features/services/components/ServiceCard"
import ServiceCardSkeleton from "@/features/services/components/ServiceCardSkeleton"
import { useServices } from "@/features/services/hooks/useServices"
import EmptyStateCard from "@/features/shared/types/components/EmptyStateCard"
import ErrorStateCard from "@/features/shared/types/components/ErrorStateCard"

export function ServiceList({ locale }: { locale: string }) {
  const { 
    data: services, 
    isLoading, 
    isError,
    refetch
  } = useServices({ locale })

  if (isLoading) return <ServiceListSkeleton />
  if (isError) return <ErrorStateCard onRetry={refetch}/>
  if (!services || services.length === 0) return <EmptyStateCard />
  return (
    <div className="max-w-full overflow-x-auto sm:overflow-x-hidden overflow-y-hidden flex gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
      {services.map((service, index) => (
        <MiracleReveal 
          animation={{
            default: "zoom-in",
            sm: "fade-up"
          }} 
          delay={{
            default: 0,
            sm: (index % 2) * 0.2,
            lg: (index % 3) * 0.2
          }}
          className="w-[75vw] sm:w-auto shrink-0 snap-start" 
          key={service.id}>
          <ServiceCard service={service} className="w-full h-full"/>
        </MiracleReveal>
      ))}
    </div>
  )
}

export function ServiceListSkeleton() {
  return (
    <div className="max-w-full overflow-x-auto sm:overflow-x-hidden overflow-y-hidden flex gap-4 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <ServiceCardSkeleton key={i} className="w-[75vw] sm:w-auto shrink-0 snap-start"/>
      ))}
    </div>
  )
}
