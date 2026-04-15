import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import clsx from "clsx"

export default function TestimonialCardSkeleton() {
  return (
    <div
      className={clsx(
        "flex w-[80vw] max-w-[300px] shrink-0 snap-start flex-col overflow-hidden sm:w-auto sm:max-w-none"
      )}
    >
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
