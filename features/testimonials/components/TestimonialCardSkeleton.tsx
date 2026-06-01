import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import { cn } from "@/utils/class-name"

export default function TestimonialCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex flex-col", className)}>
      <MiracleSkeleton className="relative h-35 w-full rounded-2xl">
        <MiracleSkeleton
          className={cn("absolute z-1 h-3 w-3 rotate-45 rounded-none", "-bottom-1.5 left-4")}
        />
      </MiracleSkeleton>
      <div className="flex flex-1 items-center gap-2 pt-5">
        <MiracleSkeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-1 flex-col">
          <MiracleSkeleton className="mb-2 h-4 w-full" />
          <MiracleSkeleton className="h-3 w-3/4" />
        </div>
        <div className="ml-2 flex items-center">
          <MiracleSkeleton className="m-1 h-5 w-5 rounded-full" />
          <MiracleSkeleton className="m-1 h-5 w-5 rounded-full" />
        </div>
      </div>
    </div>
  )
}
