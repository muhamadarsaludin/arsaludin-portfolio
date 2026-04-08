"use client"

import ServiceCardSkeleton from "@/features/projects/components/ProjectCardSkeleton"
import ServiceCard from "@/features/services/components/ServiceCard"
import { useServices } from "@/features/services/hooks/useServices"

export function ServiceList({ locale }: { locale: string }) {
  const { data: services, isLoading, isError } = useServices({ locale })

  if (isLoading) return <ServiceListSkeleton />

  if (isError) {
    return (
      <div className="flex h-30 flex-col items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950 p-4">
        <p className="text-red text-sm font-medium text-center">
          Unable to load services. Please try again later.
        </p>
      </div>
    )
  }

  if (!services || services.length === 0) {
    return (
      <div className="border-primaryflex h-30 flex-col items-center justify-center rounded-2xl border border-dashed p-4">
        <p className="text-secondary text-sm font-medium text-center">No services found for this language.</p>
      </div>
    )
  }

  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}

/**
 * Skeleton Loader matches the grid layout.
 */
export function ServiceListSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  )
}