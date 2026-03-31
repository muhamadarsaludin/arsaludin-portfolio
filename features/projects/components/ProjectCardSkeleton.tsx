import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import clsx from "clsx"

export default function ServiceCardSkeleton() {
  return (
    <div
      className={clsx(
        "flex w-[80vw] max-w-[300px] shrink-0 snap-start flex-col overflow-hidden sm:w-auto sm:max-w-none",
        "border-primary rounded-2xl border"
      )}
    >
      <MiracleSkeleton className="aspect-video w-full rounded-none" />
      <div className="flex flex-1 flex-col p-6">
        <MiracleSkeleton className="mb-3 h-6 w-3/4" />
        <MiracleSkeleton className="mb-2 h-4 w-full" />
        <MiracleSkeleton className="h-4 w-2/4" />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {[...Array(4)].map((_, j) => (
            <MiracleSkeleton key={j} className="h-6 w-14" />
          ))}
        </div>
      </div>
    </div>
  )
}
