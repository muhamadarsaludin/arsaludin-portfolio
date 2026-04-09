import { MiracleSkeleton } from "@/components/miracle/Skeleton"


export const EducationCardSkeleton = () => {
  return (
    <div className="border border-primary p-5 sm:p-6 rounded-2xl flex flex-col bg-primary">
      <div className="flex justify-between gap-6 items-start">
        <div className="flex gap-6 w-full">
          {/* Logo Skeleton */}
          <MiracleSkeleton className="h-20 w-20 shrink-0 rounded-full! border border-primary" variant="med"/>
          
          <div className="flex flex-col gap-3 w-full max-w-md">
            <MiracleSkeleton className="h-6 w-3/4" variant="med"/>
            <MiracleSkeleton className="h-4 w-1/2"/>
            {/* Meta Info Skeleton */}
            <div className="flex gap-3 mt-1">
              <MiracleSkeleton className="h-4 w-24"/>
              <MiracleSkeleton className="h-4 w-20"/>
              <MiracleSkeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
        
        {/* Chevron Button Skeleton */}
        <MiracleSkeleton className="h-9 w-9 shrink-0" variant="med"/>
      </div>
    </div>
  )
}