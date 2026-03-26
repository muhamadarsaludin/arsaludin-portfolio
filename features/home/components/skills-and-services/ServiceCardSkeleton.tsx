import { MiracleSkeleton } from '@/components/miracle/Skeleton'
import clsx from 'clsx'

export default function ServiceCardSkeleton() {
  return (
    <div className={clsx(
      "flex flex-col w-[80vw] max-w-[300px] sm:w-auto sm:max-w-none shrink-0 snap-start overflow-hidden",
      "border border-primary rounded-2xl",
    )}>
      <MiracleSkeleton className="w-full aspect-video rounded-none"/>
      <div className="flex flex-1 flex-col p-6">
        <MiracleSkeleton className="w-3/4 h-6 mb-3"/>
        <MiracleSkeleton className="w-full h-4 mb-2"/>
        <MiracleSkeleton className="w-2/4 h-4"/>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {[...Array(4)].map((_, j) => (
            <MiracleSkeleton key={j} className="h-6 w-14" />
          ))}
        </div>
      </div>
    </div>
  )
}
