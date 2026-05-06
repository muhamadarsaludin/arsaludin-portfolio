"use client"

import clsx from "clsx"
import { MiracleSkeleton } from "@/components/miracle/Skeleton"
import ArticleCardFeaturedSkeleton from "./ArticleCardFeaturedSkeleton"

export default function FeaturedArticlesSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className={clsx(
        "grid gap-6",
        "grid-cols-1 lg:grid-cols-12"
      )}>
        {/* Main Highlight */}
        <MiracleSkeleton className="lg:col-span-8 rounded-2xl! aspect-video"/>
        <div className="lg:col-span-4"> 
          <div className={clsx(
            "w-full h-full flex flex-row overflow-x-auto snap-x snap-mandatory gap-4",
            "lg:grid lg:grid-cols-1 lg:grid-rows-3 lg:h-full lg:gap-6",
            "custom-scrollbar"
          )}>
            {Array.from({ length: 3 }).map((_, i) => (
              <ArticleCardFeaturedSkeleton key={i} className="w-[75vw] md:w-full md:max-w-87.5 lg:max-w-full lg:h-full snap-start shrink-0 overflow-hidden"/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}