import React from 'react'
import { InspirationWebsite } from '../types/inspiration-website.types';
import { LuExternalLink, LuStar } from 'react-icons/lu';
import MiracleBadge from '@/components/miracle/Badge';

type InspirationCardProps = {
  item: InspirationWebsite
  locale: string
}

export default function InspirationCard({ item, locale }: InspirationCardProps) {
  const desc = item.description?.[locale as 'en' | 'id'] || item.description?.en;

  return (
    <div className="group relative flex flex-col p-5 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">
            {item.author}
          </h3>
          <span className="text-xs text-secondary font-medium">
            {item.role || item.type} {item.company ? ` @ ${item.company}` : ''}
          </span>
        </div>
        <div className="flex gap-2">
          {item.is_favorite && (
            <LuStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          )}
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1 hover:bg-secondary rounded-md transition-colors"
          >
            <LuExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {desc && (
        <p className="text-sm text-secondary leading-relaxed mb-4">
          {desc}
        </p>
      )}

      <div className="mt-auto flex gap-2">
        <MiracleBadge variant="secondary">
          {item.location}
        </MiracleBadge>
        <MiracleBadge variant="secondary">
          {item.type.replace('-', ' ')}
        </MiracleBadge>
      </div>
    </div>
  )
}
