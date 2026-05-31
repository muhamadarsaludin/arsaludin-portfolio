import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import { cn } from "@/utils/class-name"

export default function AchievementCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col",
        className
      )}
    >
      <MiracleSkeleton className="aspect-7/5 w-full rounded-2xl!" />
      
      {/* Footer Meta Layout */}
      <div className="flex items-center justify-between gap-4 pt-5">
        <div className="flex gap-2 items-start min-w-0 flex-1">
          {/* Organization Brand Avatar Stub */}
          <MiracleSkeleton className="h-10 w-10 shrink-0 rounded-lg" />
          
          {/* Metadata Stack Stubs */}
          <div className="flex flex-col items-start flex-1 gap-1.5 pt-0.5">
            {/* Title Line Placeholder */}
            <MiracleSkeleton className="h-4 w-11/12" />
            
            {/* Issuing Organization & Type Badge Double Placeholder Inline Row */}
            <div className="flex items-center gap-1.5 w-full">
              <MiracleSkeleton className="h-4 w-1/2" />
              <MiracleSkeleton className="h-4 w-14 rounded-full" />
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <MiracleSkeleton className="h-5 w-5 m-1 rounded-full" />
        </div>
      </div>
    </div>
  )
}