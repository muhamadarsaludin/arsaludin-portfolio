import { MiracleSkeleton } from "@/components/miracle/Skeleton"

export const EducationCardSkeleton = () => {
  return (
    <div className="border-primary bg-primary flex flex-col rounded-2xl border p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-3 md:flex-row md:gap-6 w-full">
          
          {/* Institution Logo Placeholder */}
          <MiracleSkeleton
            className="border-primary h-12 w-12 md:h-20 md:w-20 shrink-0 rounded-full border"
          />

          <div className="flex w-full max-w-md flex-col gap-1.5 md:gap-2 items-start">
            {/* School / Institution Name Line */}
            <MiracleSkeleton className="h-6 w-3/4" />
            
            {/* Degree and Field Subtitle Line */}
            <MiracleSkeleton className="h-4 w-1/2" />
            
            {/* Context Metadata Row (Calendar Timeline, Location) */}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <MiracleSkeleton className="h-4 w-25" />
              <MiracleSkeleton className="h-4 w-25" />
            </div>
          </div>
        </div>

        {/* Action Toggle Button Placeholder */}
        <MiracleSkeleton className="h-9 w-9 shrink-0" />
      </div>
    </div>
  )
}