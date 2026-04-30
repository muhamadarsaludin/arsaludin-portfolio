"use client"

import { LuArrowUpRight, LuCpu } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { GearAndSetupItem } from '../types/gear-and-setup.types';
import MiracleBadge from '@/components/miracle/Badge';

type GearAndSetupCardProps = {
  item: GearAndSetupItem;
};

export default function GearAndSetupCard({ item }: GearAndSetupCardProps) {
  const t = useTranslations("pages.gear-and-setup");

  return (
    <div className="flex gap-4 md:gap-6 p-5 md:p-6 rounded-2xl border border-primary items-start justify-between group/card overflow-hidden relative bg-card transition-all duration-300">
      {item.link && (
        <a
          href={item.link}
          className="absolute inset-0 rounded-2xl cursor-pointer z-10"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${item.name}`}
        />
      )}

      <div className="flex flex-col items-start w-full relative z-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="text-primary font-semibold text-lg md:text-xl xl:text-2xl">
            {item.name}
          </h3>
          <MiracleBadge color="blue" variant="secondary">
            {item.type}
          </MiracleBadge>
        </div>

        <div className="flex items-start gap-2 text-sm text-secondary leading-relaxed pl-3 py-1 border-l-2 border-blue italic mt-5 md:mt-6">
          <p>"{item.description}"</p>
        </div>

        {item.specs && item.specs.length > 0 && (
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-start gap-y-6 gap-x-0 sm:gap-x-0 mt-6 w-full">
            {item.specs.map((spec, index) => (
              <div 
                key={index} 
                className={`flex flex-col gap-1 pr-4 sm:pr-8 
                  ${index !== 0 ? "sm:border-l sm:border-default sm:pl-8" : ""}
                  ${index % 2 !== 0 ? "border-l border-default pl-4 sm:pl-8" : ""}
                `}
              >
                <p className="text-[10px] md:text-xs uppercase tracking-tight text-secondary">
                  {spec.name}
                </p>
                <p className="text-sm text-primary font-medium leading-none">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {item.link && (
        <div 
          className="hidden md:block p-2 rounded-full border-2 border-primary relative z-20 opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-0 translate-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300 ease-in-out shrink-0 cursor-pointer"
        >
          <LuArrowUpRight size={20} className="text-primary" />
        </div>
      )}
    </div>
  );
}