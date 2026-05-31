"use client"

import { cn } from "@/utils/class-name"
import { toKebabCase } from "@/utils/string-case"
import type { JSX } from "react"
import React from "react"
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
  linkClassName?: string
  noMarginTop?: boolean
  fontWeight?: "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black"
}

export default function Heading({
  id,
  level = 2,
  children,
  className,
  copyLink = true,
  linkClassName,
  noMarginTop = false,
  fontWeight = "normal",
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  const baseId = id ?? (typeof children === "string" ? children : "")
  const headingId = toKebabCase(baseId)

  const { message, copy } = useCopyToClipboard({
    defaultMessage: "Copy link",
    successMessage: "Link copied!",
  })

  const handleCopy = () => {
    const url = `${window.location.origin}${window.location.pathname}#${headingId}`
    copy(url)
  }

  const fontWeightClass: Record<NonNullable<HeadingProps["fontWeight"]>, string> = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
  }

  const fontSizeClass: Record<number, string> = {
    1: "text-3xl md:text-4xl lg:text-5xl",
    2: "text-2xl md:text-3xl lg:text-4xl",
    3: "text-xl md:text-2xl lg:text-3xl",
    4: "text-lg md:text-xl lg:text-2xl",
    5: "text-base md:text-lg lg:text-xl",
  }

  const linkSizeClass: Record<number, string> = {
    1: "text-[0.4em]",
    2: "text-[0.5em]",
    3: "text-[0.6em]",
    4: "text-[0.7em]",
    5: "text-[0.8em]",
  }

  const marginClass: Record<number, string> = {
    1: "mt-0",
    2: "mt-8 lg:mt-10 xl:mt-12",
    3: "mt-6 lg:mt-8",
    4: "mt-4 lg:mt-6",
    5: "mt-2 lg:mt-4",
  }

  return (
    <Tag
      id={headingId}
      className={cn(
        "group/heading relative w-fit scroll-mt-24 leading-tight font-semibold",
        fontSizeClass[level],
        fontWeightClass[fontWeight],
        !noMarginTop && marginClass[level],
        className
      )}
    >
      <Link href={`#${headingId}`} >
        {children}
      </Link>
      {copyLink && (
        <div className="invisible absolute top-1/2 right-full z-[10] flex-1 shrink-0 translate-x-1 -translate-y-1/2 pr-1 opacity-0 transition duration-300 ease-in-out group-hover/heading:visible group-hover/heading:translate-x-0 group-hover/heading:opacity-100">
          <MiracleTooltip
            hoverContent
            noPadding
            trigger={
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy()
                }}
                className={cn(
                  linkSizeClass[level],
                  "relative z-20 cursor-pointer rounded-full p-1.5 text-blue-600 transition-colors duration-300 ease-in-out hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900",
                  linkClassName
                )}
                aria-label="Copy link to this section"
                title="Copy link"
              >
                <LuLink2 />
              </button>
            }
          >
            <span className="flex p-2 text-xs font-medium text-nowrap">{message}</span>
          </MiracleTooltip>
        </div>
      )}
    </Tag>
  )
}
