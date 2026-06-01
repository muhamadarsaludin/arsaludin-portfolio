"use client"

import React, { useState } from "react"
import Heading from "@/components/Heading"
import { cn } from "@/utils/class-name"
import { LuCalendar, LuChevronDown, LuOrbit } from "react-icons/lu"
import MiracleBadge from "@/components/miracle/Badge"
import { useLocale, useTranslations } from "next-intl"
import { formatDate } from "@/utils/format-date"

interface ChangelogItemProps {
  version: string
  releaseDate: string
  banner?: React.ReactNode
  showDetail?: boolean
  isLatest?: boolean
  children: React.ReactNode
}

export default function ChangelogItem({
  version,
  releaseDate,
  banner,
  showDetail = false,
  isLatest = false,
  children,
}: ChangelogItemProps) {
  const [isOpen, setIsOpen] = useState(showDetail)
  const [shouldRender, setShouldRender] = useState(showDetail)
  const [prevShowDetail, setPrevShowDetail] = useState(showDetail)

  const slugifiedId = `version-${version.replaceAll(".", "-")}`
  const t = useTranslations("components.changelogItem")
  const locale = useLocale()

  if (showDetail !== prevShowDetail) {
    setPrevShowDetail(showDetail)
    if (showDetail) {
      setIsOpen(true)
      setShouldRender(true)
    }
  }

  const toggleOpen = () => {
    if (!isOpen) {
      setShouldRender(true)
      requestAnimationFrame(() => setIsOpen(true))
    } else {
      setIsOpen(false)
    }
  }

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setShouldRender(false)
    }
  }

  return (
    <div className="w-full pl-4 md:pl-5">
      <div
        className={cn(
          "relative flex w-full border-l-2 pb-6 pl-8 transition-all duration-500 ease-in-out last:pb-0 md:pb-8 md:pl-10",
          isOpen ? "border-blue" : "border-primary"
        )}
      >
        <button
          onClick={toggleOpen}
          aria-label={`Toggle version ${version} details`}
          aria-expanded={isOpen}
          className={cn(
            "absolute top-0 -left-4.25 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-500 ease-in-out md:-left-5.25 md:h-10 md:w-10",
            isOpen
              ? "bg-blue text-primary-inv border-primary"
              : "bg-secondary text-blue border-primary"
          )}
        >
          <LuOrbit
            className={cn(
              "size-4 transition-transform duration-500 ease-in-out md:size-5",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </button>
        <div className="border-primary bg-primary flex w-full flex-col overflow-hidden rounded-2xl border p-5 shadow-sm md:p-6">
          <div
            onClick={toggleOpen}
            className="group/header flex w-full cursor-pointer items-start justify-between gap-3 select-none"
          >
            <div className="flex w-full flex-col items-start">
              <div className="mb-1 flex items-center gap-3">
                <Heading
                  id={slugifiedId}
                  level={2}
                  className="group-hover/header:text-blue text-lg! transition-colors duration-300 md:text-xl! lg:text-2xl!"
                  linkClassName="text-[0.7em]!"
                  noMarginTop
                >
                  Version {version}
                </Heading>
                {isLatest && (
                  <MiracleBadge color="blue" variant="secondary">
                    {t("latest")}
                  </MiracleBadge>
                )}
              </div>
              <p className="text-secondary flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                <span className="flex items-center gap-0.5">
                  <LuCalendar className="shrink-0" />
                  {t("release", {
                    date: formatDate({ date: releaseDate, locale, dateStyle: "full" }),
                  })}
                </span>
              </p>
              {banner && (
                <div className="mt-4 w-full" onClick={(e) => e.stopPropagation()}>
                  {banner}
                </div>
              )}
            </div>
            <div className="shrink-0 rounded-md p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 dark:hover:bg-neutral-800">
              <LuChevronDown
                size={20}
                className={cn(
                  "text-secondary group-hover/header:text-primary transition-transform duration-500 ease-in-out",
                  isOpen && "-rotate-180"
                )}
              />
            </div>
          </div>
          <div
            onTransitionEnd={handleTransitionEnd}
            className={cn(
              "grid transition-all duration-500 ease-in-out",
              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              {shouldRender && (
                <div className="border-primary mt-5 flex flex-col gap-4 border-t pt-5 sm:mt-6 sm:pt-6">
                  <div className="flex flex-col gap-3">
                    <h4 className="text-primary text-sm font-bold tracking-wider uppercase">
                      {t("changes")} :
                    </h4>
                    <div className="text-secondary prose prose-sm dark:prose-invert max-w-full">
                      {children}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
