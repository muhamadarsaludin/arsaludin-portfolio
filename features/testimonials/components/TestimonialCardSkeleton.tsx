import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import clsx from "clsx"

export default function TestimonialCardSkeleton({className}: {className?: string}) {
  return (
    <div className={clsx(
      "relative flex flex-col",
      className
    )}>
      <MiracleSkeleton className="w-full h-35 rounded-2xl!" variant="med" />
      <div className="flex flex-1 gap-2 pt-5 items-center">
        <MiracleSkeleton className="h-10 w-10 rounded-full!" variant="med" />
        <div className="flex flex-col flex-1">
          <MiracleSkeleton className="mb-2 h-4 w-full" variant="med" />
          <MiracleSkeleton className="h-3 w-3/4" />
        </div>
        <div className="flex items-center gap-1 ml-2">
          <MiracleSkeleton className="h-6 w-6 rounded-full!" variant="med" />
          <MiracleSkeleton className="h-6 w-6 rounded-full!" variant="med" />
        </div>
      </div>
    </div>
  )
}
