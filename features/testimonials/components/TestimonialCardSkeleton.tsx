import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import { cn } from "@/utils/class-name"

export default function TestimonialCardSkeleton({className}: {className?: string}) {
  return (
    <div className={cn(
      "relative flex flex-col",
      className
    )}>
      <MiracleSkeleton className="w-full h-35 rounded-2xl relative" >
        <MiracleSkeleton
          className={cn(
            "absolute z-1 h-3 w-3 rotate-45 rounded-none",
            "-bottom-1.5 left-4"
          )}
        />
      </MiracleSkeleton>
      <div className="flex flex-1 gap-2 pt-5 items-center">
        <MiracleSkeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col flex-1">
          <MiracleSkeleton className="mb-2 h-4 w-full" />
          <MiracleSkeleton className="h-3 w-3/4" />
        </div>
        <div className="flex items-center ml-2">
          <MiracleSkeleton className="h-5 w-5 m-1 rounded-full" />
          <MiracleSkeleton className="h-5 w-5 m-1 rounded-full" />
        </div>
      </div>
    </div>
  )
}
