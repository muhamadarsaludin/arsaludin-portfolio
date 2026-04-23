import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import clsx from "clsx"

export default function AchievementCardSkeleton({className}: {className?: string}) {
  return (
    <div
      className={clsx(
        "relative flex flex-col",
        className
      )}
    >
      <MiracleSkeleton className="aspect-7/5 w-full rounded-2xl!" variant="med" />
      <div className="flex flex-1 gap-2 pt-5 items-center">
        <MiracleSkeleton className="h-10 w-10" variant="med" />
        <div className="flex flex-col flex-1">
          <MiracleSkeleton className="mb-2 h-4 w-full" variant="med" />
          <MiracleSkeleton className="h-3 w-3/4" />
        </div>
        <MiracleSkeleton className="h-6 w-6 rounded-full! ml-2" variant="med" />
      </div>
    </div>
  )
}
