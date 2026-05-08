import React, { use } from 'react'
import { Article } from '../types/articles.types';
import clsx from 'clsx';
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { MiracleSkeleton } from '@/components/miracle/Skeleton';
import { formatDate } from '@/utils/format-date';
import MiracleBadge from '@/components/miracle/Badge';
import UserAvatar from '@/features/auth/components/UserAvatar';
import { LuCalendar } from 'react-icons/lu';
import { useTranslations } from 'next-intl';

type ArticleCardHighlightProps = {
  article: Article
  locale: string
  className?: string
};


export default function ArticleCardHighlight({ article, locale, className }: ArticleCardHighlightProps) {
  const td = useTranslations("data")
  
  return (
    <Link 
      href={`/articles/${article.slug}`}
      className={clsx("group relative block aspect-video overflow-hidden rounded-2xl", className)}
      aria-label={article.title}
    >
      {/* Background Image */}
      {article.thumbnail ? (
        <Image
          className="object-cover transition-transform duration-700 group-hover:scale-103 w-full inset-0"
          src={article.thumbnail}
          alt={article.title}
          fill
          priority
          sizes="1000px"
        />
      ) : (
        <MiracleSkeleton className="w-full h-full" />
      )}
      
      {/* content */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="flex flex-col p-4 bg-white/10 dark:bg-neutral-950/10 backdrop-blur-xl border border-primary shadow-xl translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div>
            {article.published_at && (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm mb-1">
                <span className="flex items-center gap-1">
                  <LuCalendar className="shrink-0" />
                  {formatDate({date: article.published_at, locale, dateStyle: "medium"})}
                </span>
              </p>
            )}
            <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl mb-2 line-clamp-1">
              {article.title}
            </h2>
            {article.summary && (
              <p className="text-sm line-clamp-2">
                {article.summary}
              </p>
            )}
          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-primary">
            <div className="flex items-center gap-2">
              <UserAvatar user={article.author}/>
              <p className="font-semibold">
                {article.author.full_name}
              </p>
            </div>

            {article.categories.length > 0 &&(
              <div className="flex items-center gap-2">
                {article.categories.map((category) => (
                  <MiracleBadge key={category.id}>
                    {td.has(`categories.${category.slug}`) 
                      ? td(`categories.${category.slug}`) 
                      : category.name
                    }
                  </MiracleBadge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
