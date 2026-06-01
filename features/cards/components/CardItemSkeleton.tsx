import { MiracleSkeleton } from "@/components/miracle/Skeleton" //

export default function CardItemSkeleton() {
  return (
    <div className="p-4 border border-primary rounded-xl bg-primary">
      <div className="flex items-center justify-between mb-3">
        {/* Title */}
        <MiracleSkeleton className="h-5 w-30"/>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <MiracleSkeleton className="h-1 w-1 rounded-full" key={i}/>
          ))} 
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <MiracleSkeleton className="h-3.5 w-full"/>
        <MiracleSkeleton className="h-3.5 w-3/4"/>
      </div>

      {/* Date */}
      <MiracleSkeleton className="h-3.5 w-1/3 mt-3"/>
      
      {/* Badges */}
      <div className="flex items-center gap-1.5 mt-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <MiracleSkeleton className="h-4 w-14" key={i}/>
        ))}
      </div>
      
      <div className="pt-2 mt-3 border-t border-primary flex items-center justify-between">
        {/* Author Avatar */}
        <MiracleSkeleton className="h-8 w-8 rounded-full"/>
        {/* Action */}
        <div className="flex items-center gap-1">
          <MiracleSkeleton className="h-5 w-5 m-1 rounded-full"/>
          <MiracleSkeleton className="h-5 w-5 m-1 rounded-full"/>
        </div>
      </div>
    </div>
  )
}