import { MiracleSkeleton } from "@/components/miracle/Skeleton"

export const ExperienceCardSkeleton = () => {
  return (
    <div className="border-primary bg-primary flex flex-col rounded-2xl border p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-3 md:flex-row md:gap-6 w-full">
          
          {/* Company Logo Placeholder */}
          <MiracleSkeleton className="border-primary h-12 w-12 md:h-20 md:w-20 shrink-0 rounded-full border"/>

          <div className="flex w-full max-w-md flex-col gap-1.5 md:gap-2">
            {/* Job Role */}
            <MiracleSkeleton className="h-6 w-3/4" />
            
            {/* Company Name */}
            <MiracleSkeleton className="h-4 w-1/2" />
            
            {/* Context Metadata Row (Calendar, Location, Employment Type) */}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <MiracleSkeleton className="h-4 w-24" />
              <MiracleSkeleton className="h-4 w-20" />
              <MiracleSkeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Action Toggle Button Placeholder */}
        <MiracleSkeleton className="h-9 w-9 shrink-0" />
      </div>
    </div>
  )
}