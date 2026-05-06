import clsx from 'clsx';
import { MiracleSkeleton } from '@/components/miracle/Skeleton';

export default function ArticleCardFeaturedSkeleton({ className }: {className?: string}) {
  return (
    <div 
      className={clsx("group flex items-start border border-primary rounded-lg overflow-hidden", className)}
    >
      <MiracleSkeleton className="relative aspect-square h-full shrink-0 rounded-l-lg! rounded-r-none! overflow-hidden"/>
      
      <div className="w-full h-full flex flex-col p-4">
        <MiracleSkeleton className='h-5 w-3/4'/>
        <MiracleSkeleton className='h-3 w-full my-2'/>
        <MiracleSkeleton className='h-3 w-2/4 mt-auto'/>
      </div>
    </div>
  )
}
