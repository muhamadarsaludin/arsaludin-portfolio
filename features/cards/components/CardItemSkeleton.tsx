import { MiracleSkeleton } from "@/components/miracle/Skeleton" //

export default function CardItemSkeleton() {
  return (
    <div className="border-primary bg-primary rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        {/* Title */}
        <MiracleSkeleton className="h-5 w-30" />
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <MiracleSkeleton className="h-1 w-1 rounded-full" key={i} />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <MiracleSkeleton className="h-3.5 w-full" />
        <MiracleSkeleton className="h-3.5 w-3/4" />
      </div>

      {/* Date */}
      <MiracleSkeleton className="mt-3 h-3.5 w-1/3" />

      {/* Badges */}
      <div className="mt-3 flex items-center gap-1.5">
        {Array.from({ length: 2 }).map((_, i) => (
          <MiracleSkeleton className="h-4 w-14" key={i} />
        ))}
      </div>

      <div className="border-primary mt-3 flex items-center justify-between border-t pt-2">
        {/* Author Avatar */}
        <MiracleSkeleton className="h-8 w-8 rounded-full" />
        {/* Action */}
        <div className="flex items-center gap-1">
          <MiracleSkeleton className="m-1 h-5 w-5 rounded-full" />
          <MiracleSkeleton className="m-1 h-5 w-5 rounded-full" />
        </div>
      </div>
    </div>
  )
}
