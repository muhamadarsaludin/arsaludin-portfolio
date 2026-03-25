import React from 'react'
import { MiracleSkeleton } from '@/components/miracle/Skeleton'

export default function SkillsAndServicesSkeleton() {
  return (
    <div className="mt-8 flex snap-x snap-mandatory gap-4 pb-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="flex w-[80vw] max-w-[300px] shrink-0 snap-start flex-col gap-5 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800 sm:w-auto sm:max-w-none"
        >
          {/* Illustration Skeleton */}
          <div className="flex w-full items-center justify-center">
            <MiracleSkeleton className="h-32 w-32 !rounded-full" />
          </div>
            
          {/* Text Skeleton */}
          <div className="flex flex-1 flex-col items-center text-center">
            <MiracleSkeleton className="mb-4 h-6 w-3/4" />
            <MiracleSkeleton className="mb-2 h-4 w-full" />
            <MiracleSkeleton className="mb-2 h-4 w-5/6" />
            <MiracleSkeleton className="h-4 w-4/6" />
              
            {/* Skills Skeletons */}
            <div className="mt-auto flex flex-wrap items-center justify-center gap-2 pt-5">
              {[...Array(4)].map((_, j) => (
                <MiracleSkeleton key={j} className="h-6 w-14" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
