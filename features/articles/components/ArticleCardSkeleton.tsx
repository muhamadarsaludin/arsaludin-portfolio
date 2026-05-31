import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import { cn } from "@/utils/class-name"

export default function ArticleCardSkeleton({className}: {className?: string}) {
  return (
    <div
      className={cn(
        "relative flex flex-col",
        className
      )}
    >
      <MiracleSkeleton className="aspect-7/5 w-full rounded-2xl!"/>
      <div className="flex flex-1 gap-2 pt-5 items-start">
        <div className="flex flex-col flex-1">
          <MiracleSkeleton className="h-2.5 w-1/4 mb-2.5" />
          <MiracleSkeleton className="h-6 w-3/4 mb-2"/>
          <MiracleSkeleton className="h-3 w-full mb-1.5" />
          <MiracleSkeleton className="h-3 w-2/3" />
        </div>
        <div className="flex items-center gap-1">
          <MiracleSkeleton className="h-6 w-6 rounded-full!"/>
          <MiracleSkeleton className="h-6 w-6 rounded-full!"/>
        </div>
      </div>
    </div>
  )
}
