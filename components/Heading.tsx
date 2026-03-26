"use client"

import clsx from "clsx"
import { toKebabCase } from "@/utils/stringCase"
import React, { JSX } from "react"
import MiracleTooltip from "./miracle/Tooltip"
import { LuLink2 } from "react-icons/lu"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import { Link } from "@/i18n/navigation"

export type HeadingProps = {
  id?: string
  level?: 1 | 2 | 3 | 4 | 5
  children: React.ReactNode
  className?: string
  copyLink?: boolean
  noMarginTop?: boolean
}

export default function Heading({
  id,
  level = 2,
  children,
  className,
  copyLink = true,
  noMarginTop = false,
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  const baseId = id ?? (typeof children === "string" ? children : "")
  const headingId = toKebabCase(baseId)
  const {message, copy} = useCopyToClipboard({
    defaultMessage: "Copy link",
    successMessage: "Link copied!",
  })

  const handleCopy = () => {
    const url = `${window.location.origin}${window.location.pathname}#${headingId}`
    copy(url)
  }

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById(headingId)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
      window.history.pushState(null, "", `#${headingId}`)
    }
  }

  const fontSizeClass: Record<number, string> = {
    1: "text-3xl md:text-4xl xl:text-5xl",
    2: "text-2xl md:text-3xl xl:text-4xl",
    3: "text-xl md:text-2xl xl:text-3xl",
    4: "text-lg md:text-xl xl:text-2xl",
    5: "text-md md:text-lg xl:text-xl"
  }

  const marginClass: Record<number, string> = {
    1: "mt-0",
    2: "mt-8 lg:mt-10 xl:mt-12",
    3: "mt-6 lg:mt-8",
    4: "mt-4 lg:mt-6",
    5: "mt-2 lg:mt-4"
  }

  return (
    <Tag 
      id={headingId} 
      className={clsx(
        "relative leading-tight group/heading scroll-mt-24 font-bold",
        fontSizeClass[level],
        !noMarginTop && marginClass[level],
        className
      )}>
      <Link href={`#${headingId}`} onClick={handleScroll}>
        {children}
      </Link>
      {copyLink && (
        <div className="absolute right-full top-1/2 -translate-y-1/2 pr-1 invisible opacity-0 translate-x-1 group-hover/heading:translate-x-0 group-hover/heading:visible group-hover/heading:opacity-100 transition duration-300 ease shrink-0 flex-1 z-200">
          <MiracleTooltip
            hoverContent
            trigger={
              <button
                onClick={handleCopy}
                className="cursor-pointer p-2 rounded-full text-blue-600 dark:text-blue-400 group-hover/tooltip:bg-blue-100 dark:group-hover/tooltip:bg-blue-900 transition-colors duration-300 ease"
                aria-label="Copy link to this section"
                title="Copy link"
              >
                <LuLink2 className="text-[0.5em]"/>
              </button>
            }>
            <span className="flex text-nowrap text-xs font-medium">{message}</span>
          </MiracleTooltip>
        </div>
      )}
    </Tag>
  )
}