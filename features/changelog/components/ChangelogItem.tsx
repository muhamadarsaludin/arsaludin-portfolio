"use client"

import React, { useState } from 'react';
import Heading from '@/components/Heading';
import clsx from 'clsx';
import { LuOrbit, LuRefreshCcwDot } from 'react-icons/lu';
import MiracleBadge from '@/components/miracle/Badge';
import { useLocale, useTranslations } from 'next-intl';
import { formatDate } from '@/utils/format-date';
import Section from '@/components/Section';

interface ChangelogItemProps {
  version: string;
  releaseDate: string;
  index: number;
  children: React.ReactNode;
}

export default function ChangelogItem({
  version,
  releaseDate,
  index,
  children
}: ChangelogItemProps) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const slugifiedId = `version-${version.replaceAll('.', '-')}`;
  const t = useTranslations("components.changelogItem")
  const locale = useLocale()

  return (
    <Section className={clsx(
      "relative border-l-2 pl-8 md:pl-10 ml-4 md:ml-5 pb-6 md:pb-8 last:pb-0 transition-all duration-500 ease-in-out", 
      isOpen ? "border-blue" : "border-primary"
    )}>
      
      {/* Button Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle version details"
        className={clsx(
          "absolute -left-4.25 md:-left-5.25 top-0 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full transition-all duration-500 ease-in-out cursor-pointer",
          isOpen 
            ? "bg-blue" 
            : "bg-secondary"
        )}
      >
        <LuOrbit
          size={18} 
          className={clsx(
            "transition-transform duration-500 ease-in-out",
            isOpen ? "rotate-180" : "rotate-0"
          )} 
        />
      </button>
      
      <div className={clsx(
        "flex w-full flex-col"
      )}>
        {/* Header */}
        <div className="w-full flex flex-col gap-2 items-start">
          <div className="flex items-center gap-3">
            <Heading 
              id={slugifiedId}
              level={2}
              className="font-semibold"
              noMarginTop
            >
              Version {version}
            </Heading>
            {index === 0 && 
              <MiracleBadge color="blue">
                {t("latest")}
              </MiracleBadge>
            }
          </div>
          <MiracleBadge>
            {t(
              "released", {date: formatDate({date: releaseDate, locale, dateStyle:"long"})}
            )}
          </MiracleBadge>
        </div>
        
        <div className={clsx(
          "max-h-0 transition-all overflow-hidden duration-500 ease-in-out",
          isOpen && "max-h-250"
          )}>
            <div className="pt-4 mt-4 md:pt-6 md:mt-6 border-t border-dashed border-primary max-h-150 overflow-auto">
              {children}
            </div>
        </div>
      </div>
    </Section>
  );
}