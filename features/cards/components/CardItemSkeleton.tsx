import { MiracleSkeleton } from "@/components/miracle/Skeleton";

export default function CardItemSkeleton() {
  return (
    <div className="p-4 border border-primary rounded-xl bg-primary">
      <div className="flex items-center justify-between mb-2.5">
        <MiracleSkeleton className="h-5 w-25"/>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <MiracleSkeleton className="h-1 w-1 rounded-full!" key={i}/>
          ))}    
        </div>
      </div>
      <MiracleSkeleton className="h-3.5 w-full mb-1"/>
      <MiracleSkeleton className="h-3.5 w-1/2"/>
      <div className="flex items-center gap-1.5 mt-5">
        <MiracleSkeleton className="h-6 w-14"/>
        <MiracleSkeleton className="h-6 w-14"/>
      </div>
      <div className="pt-2 mt-3 border-t border-primary flex items-center justify-between">
        <MiracleSkeleton className="h-8 w-8 rounded-full!"/>
        <div className="flex items-center gap-1">
          <MiracleSkeleton className="h-6 w-6 rounded-full!"/>
          <MiracleSkeleton className="h-6 w-6 rounded-full!"/>
        </div>
      </div>
    </div>
  )
}
