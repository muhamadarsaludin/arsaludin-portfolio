"use client"

import React, { useState } from 'react';
import Heading from '@/components/Heading';
import clsx from 'clsx';
import { LuCalendar, LuChevronDown, LuOrbit, LuPartyPopper, LuRefreshCcwDot } from 'react-icons/lu';
import MiracleBadge from '@/components/miracle/Badge';
import { useLocale, useTranslations } from 'next-intl';
import { formatDate } from '@/utils/format-date';
import Section from '@/components/Section';
import MiracleBanner from '@/components/miracle/Banner';

interface ChangelogItemProps {
  version: string;
  releaseDate: string;
  banner?: React.ReactNode;
  showDetail?: boolean;
  isLatest?: boolean;
  children: React.ReactNode;
}

export default function ChangelogItem({
  version,
  releaseDate,
  banner,
  showDetail = false,
  isLatest = false,
  children
}: ChangelogItemProps) {
  const [isOpen, setIsOpen] = useState(showDetail);
  const slugifiedId = `version-${version.replaceAll('.', '-')}`;
  const t = useTranslations("components.changelogItem")
  const locale = useLocale()

  return (
    <Section className="pl-4 md:pl-5">
      <div className={clsx(
        "flex w-full relative border-l-2 pl-8 md:pl-10 pb-6 md:pb-8 last:pb-0 transition-all duration-500 ease-in-out",
        isOpen ? "border-blue" : "border-primary"
        )}>
        {/* Button Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle version details"
          className={clsx(
            "absolute -left-4.25 md:-left-5.25 top-0 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full transition-all duration-500 ease-in-out cursor-pointer border-2",
            isOpen 
              ? "bg-blue text-primary-inv border-primary" 
              : "bg-secondary text-blue border-primary"
          )}
        >
          <LuOrbit
            className={clsx(
              "transition-transform duration-500 ease-in-out size-4 md:size-5",
              isOpen ? "rotate-180" : "rotate-0"
            )} 
          />
        </button>
        <div className={clsx("flex w-full flex-col border border-primary bg-primary p-5 md:p-6 rounded-2xl")}> 
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="w-full flex flex-col items-start">
              <div className="flex items-center gap-3 mb-1">
                <Heading 
                  id={slugifiedId}
                  level={2}
                  className="text-lg! md:text-xl! lg:text-2xl!"
                  linkClassName="text-[0.7em]!"
                  noMarginTop
                >
                  Version {version}
                </Heading>
                {isLatest && 
                  <MiracleBadge color="blue" variant="secondary">
                    {t("latest")}
                  </MiracleBadge>
                }
              </div>
              <p className="text-secondary flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                <span className="flex items-center gap-0.5">
                  <LuCalendar className="shrink-0" />
                  {t("release", {date: formatDate({date: releaseDate, locale, dateStyle:"full"})})}
                </span>
              </p>
              <div className="mt-4">
                {banner}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(!isOpen)
              }}
              aria-label={isOpen ? t("hide") : t("show")}
              className="cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 focus:outline-none dark:hover:bg-neutral-800"
            >
              <LuChevronDown
                size={20}
                className={clsx(
                  "cursor-pointer transition-transform duration-500 ease-in-out",
                  isOpen && "-rotate-180"
                )}
              />
            </button>
          </div>
          {/* Body */}
          <div className={clsx(
            "max-h-0 transition-all overflow-hidden duration-500 ease-in-out",
            isOpen && "max-h-250"
            )}>
            <div className="border-primary mt-5 flex flex-col gap-4 border-t pt-5 sm:mt-6 sm:pt-6">
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold uppercase">{t("changes")} :</h4>
                <div className="text-secondary max-w-full">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}