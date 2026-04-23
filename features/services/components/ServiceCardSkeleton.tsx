import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import clsx from "clsx"

export default function ServiceCardSkeleton({className}: {className?: string}) {
  return (
    <div
      className={clsx(
        "flex flex-col border-primary rounded-2xl border",
        className
      )}
    >
      <MiracleSkeleton className="aspect-video w-full rounded-none" variant="med" />
      <div className="flex flex-1 flex-col p-6">
        <MiracleSkeleton className="mb-2.5 h-6 w-3/4" variant="med" />
        <MiracleSkeleton className="mb-2 h-4 w-full" />
        <MiracleSkeleton className="h-4 w-2/4" />
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {[...Array(4)].map((_, j) => (
            <MiracleSkeleton key={j} className="h-6 w-14" />
          ))}
        </div>
      </div>
    </div>
  )
}
