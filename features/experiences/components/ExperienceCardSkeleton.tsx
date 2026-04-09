import { MiracleSkeleton } from "@/components/miracle/Skeleton"

export const ExperienceCardSkeleton = () => {
  return (
    <div className="border-primary bg-primary flex flex-col rounded-2xl border p-5 sm:p-6">
      <div className="flex items-start justify-between gap-6">
        <div className="flex w-full gap-6">
          {/* Logo Skeleton */}
          <MiracleSkeleton
            className="border-primary h-20 w-20 shrink-0 rounded-full! border"
            variant="med"
          />

          <div className="flex w-full max-w-md flex-col gap-3">
            <MiracleSkeleton className="h-6 w-3/4" variant="med" />
            <MiracleSkeleton className="h-4 w-1/2" />
            {/* Meta Info Skeleton */}
            <div className="mt-1 flex gap-3">
              <MiracleSkeleton className="h-4 w-24" />
              <MiracleSkeleton className="h-4 w-20" />
              <MiracleSkeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Chevron Button Skeleton */}
        <MiracleSkeleton className="h-9 w-9 shrink-0" variant="med" />
      </div>
    </div>
  )
}
