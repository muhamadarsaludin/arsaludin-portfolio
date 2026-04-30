"use client"

import { InspirationWebsite } from '../types/inspiration-website.types';
import { LuArrowUpRight, LuBriefcaseBusiness, LuCrown, LuExternalLink, LuMapPin, LuStar } from 'react-icons/lu';
import MiracleBadge from '@/components/miracle/Badge';
import { useTranslations } from 'next-intl';
import Heading from '@/components/Heading';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type InspirationCardProps = {
  item: InspirationWebsite
  locale: string
}

export default function InspirationCard({ item, locale }: InspirationCardProps) {
  const desc = item.description?.[locale as 'en' | 'id'] || item.description?.en;
  const t = useTranslations("components.inspirationCard")
  const {isMobile} = useMediaQuery()

  return (
    <div className="flex gap-6 p-5 md:p-6 rounded-2xl border border-primary items-start justify-between group/card overflow-hidden relative">
      <a
        href={item.link}
        className="absolute inset-0 rounded-2xl cursor-pointer"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("ariaLabel", {website: item.author})}
      />
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-primary font-semibold text-lg md:text-xl xl:text-2xl">
            {item.author}
          </h3>
          {item.is_favorite && (
            <MiracleBadge startIcon={<LuStar />} color="yellow" variant="secondary">
              {!isMobile ? t("favorite") : undefined}
            </MiracleBadge>
          )}
        </div>

        <p className="text-secondary flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
          {(item.role || item.company) && (
            <span className="flex items-center gap-1">
              <LuBriefcaseBusiness className="shrink-0" />
              <span>
                {item.role && (
                  <span>{item.role}</span>
                )}
                {item.company && (
                  <span> {t("at")} {item.company}</span>
                )}
              </span>
            </span>
          )}
          <span className="flex items-center gap-0.5">
            <LuMapPin className="shrink-0" />
            {item.location}
          </span>
        </p>

        {desc && (
          <p className="text-sm text-secondary leading-relaxed mt-5 md:mt-6 pl-2 py-0.5 border-l-2 border-blue italic">
            "{desc}"
          </p>
        )}
      </div>

      <div 
        className="hidden md:block p-2 rounded-full border-2 border-primary relative z-1 opacity-0 group-hover/card:opacity-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300 ease-in-out cursor-pointer"
      >
        <LuArrowUpRight size={20} className="text-primary" />
      </div>
    </div>
  )
}
