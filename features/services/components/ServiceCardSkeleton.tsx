import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import clsx from "clsx"

export default function ServiceCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "flex flex-col rounded-2xl border border-primary overflow-hidden",
        className
      )}
    >
      <MiracleSkeleton className="aspect-video w-full rounded-none"/>
      
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* Skeleton Level Badge & Title */}
        <MiracleSkeleton className="mb-2.5 h-5 w-20"/>
        <MiracleSkeleton className="mb-3 h-6 w-3/4"/>
        
        {/* Skeleton Description */}
        <MiracleSkeleton className="mb-2 h-4 w-full" />
        <MiracleSkeleton className="h-4 w-2/4" />
        
        {/* Skeleton Skill Badges */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {Array.from({ length: 4 }).map((_, j) => (
            <MiracleSkeleton key={`skill-skeleton-${j}`} className="h-6 w-14" />
          ))}
        </div>
      </div>
    </div>
  )
}