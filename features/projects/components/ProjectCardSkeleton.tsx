import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import { cn } from "@/utils/class-name"

export default function ProjectCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-primary bg-card flex flex-col overflow-hidden rounded-2xl border",
        className
      )}
    >
      {/* Skeleton Thumbnail */}
      <MiracleSkeleton className="aspect-4/3 w-full rounded-none" />

      {/* Skeleton Body Section */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* Title */}
        <MiracleSkeleton className="mb-2 h-6 w-3/4" />

        {/* Description */}
        <MiracleSkeleton className="mb-2 h-4 w-full" />
        <MiracleSkeleton className="mb-6 h-4 w-2/4" />

        {/* Skeleton Skill Badges */}
        <div className="mt-auto flex flex-wrap items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <MiracleSkeleton key={`project-skill-skel-${i}`} className="h-6 w-14 rounded-full" />
          ))}
        </div>
      </div>

      {/* Skeleton Footer Section */}
      <div className="border-primary bg-secondary flex items-center justify-between border-t px-5 py-3 md:px-6">
        <MiracleSkeleton className="m-1 h-5 w-5 rounded-full" variant="med" />
        <MiracleSkeleton className="m-1 h-5 w-5 rounded-full" variant="med" />
      </div>
    </div>
  )
}
