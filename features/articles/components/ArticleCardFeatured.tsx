import React from 'react'
import { Article } from '../types/articles.types';
import clsx from 'clsx';
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { MiracleSkeleton } from '@/components/miracle/Skeleton';
import { LuCalendar } from 'react-icons/lu';
import { formatDate } from '@/utils/format-date';

type ArticleCardFeaturedProps = {
  article: Article
  locale: string
  className?: string
};

export default function ArticleCardFeatured({ article, locale, className }: ArticleCardFeaturedProps) {
  return (
    <Link 
      href={`/articles/${article.slug}`}
      className={clsx("group flex items-start bg-secondary rounded-lg overflow-hidden", className)}
    >
      <div className="relative aspect-square h-full shrink-0 rounded-l-lg overflow-hidden">
        {article.thumbnail ? (
          <Image
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            src={article.thumbnail}
            alt={article.title}
            fill
            sizes="220px"
          />
        ) : (
          <MiracleSkeleton className="h-full w-full" />
        )}
      </div>
      
      <div className="w-full h-full flex flex-col p-4">
        <h3 className="text-primary font-semibold text-base md:text-lg line-clamp-1">
          {article.title}
        </h3>

        {article.summary && (
          <div className="text-secondary text-sm line-clamp-1 my-0.5">
            {article.summary}
          </div>
        )}
        
        {article.published_at && (
          <div className="flex items-center gap-1.5 text-xs text-secondary mt-auto">
            <LuCalendar className="shrink-0" size={14} />
            <span>
              {formatDate({date: article.published_at, locale, dateStyle: "medium"})}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
