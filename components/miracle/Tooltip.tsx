"use client"

import clsx from "clsx"
import { ReactNode, useEffect, useRef, useState } from "react"

export type TooltipProps = {
  className?: string
  trigger: ReactNode
  children: ReactNode
  defaultPosition?: 
    | "top-start" | "top-center" | "top-end"
    | "bottom-start" | "bottom-center" | "bottom-end"
    | "left-start" | "left-center" | "left-end"
    | "right-start" | "right-center" | "right-end"
  hoverContent?: boolean
  noPadding?: boolean
  showArrow?: boolean
}

export default function MiracleTooltip({
  className,
  trigger, 
  children,
  defaultPosition = "top-center",
  hoverContent = false,
  noPadding = false,
  showArrow = true
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [adaptedPos, setAdaptedPos] = useState(defaultPosition)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 100)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (isOpen && containerRef.current && contentRef.current) {
      const triggerRect = containerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let [side, align] = defaultPosition.split("-")

      // Vertical adaptation
      if (side === "top" && triggerRect.top - contentRect.height < 0) {
        side = "bottom"
      } else if (side === "bottom" && triggerRect.bottom + contentRect.height > viewportHeight) {
        side = "top"
      }

      // Horizontal adaptation
      if (side === "left" && triggerRect.left - contentRect.width < 0) {
        side = "right"
      } else if (side === "right" && triggerRect.right + contentRect.width > viewportWidth) {
        side = "left"
      }

      // Alignment adaptation (horizontal)
      if (side === "top" || side === "bottom") {
        if (align === "start" && triggerRect.left + contentRect.width > viewportWidth) align = "end"
        if (align === "end" && triggerRect.right - contentRect.width < 0) align = "start"
        if (align === "center") {
          if (triggerRect.left + (triggerRect.width / 2) + (contentRect.width / 2) > viewportWidth) align = "end"
          if (triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2) < 0) align = "start"
        }
      }

      // Alignment adaptation (vertical)
      if (side === "left" || side === "right") {
        if (align === "start" && triggerRect.top + contentRect.height > viewportHeight) align = "end"
        if (align === "end" && triggerRect.bottom - contentRect.height < 0) align = "start"
        if (align === "center") {
          if (triggerRect.top + (triggerRect.height / 2) + (contentRect.height / 2) > viewportHeight) align = "end"
          if (triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2) < 0) align = "start"
        }
      }

      setAdaptedPos(`${side}-${align}` as any)
    }
  }, [isOpen, defaultPosition])

  const tooltipPositionClass: Record<string, string> = {
    "top-start": "bottom-full left-0 pb-2",
    "top-center": "bottom-full left-1/2 -translate-x-1/2 pb-2",
    "top-end": "bottom-full right-0 pb-2",
    "bottom-start": "top-full left-0 pt-2",
    "bottom-center": "top-full left-1/2 -translate-x-1/2 pt-2",
    "bottom-end": "top-full right-0 pt-2",
    "left-start": "right-full top-0 pr-2",
    "left-center": "right-full top-1/2 -translate-y-1/2 pr-2",
    "left-end": "right-full bottom-0 pr-2",
    "right-start": "left-full top-0 pl-2",
    "right-center": "left-full top-1/2 -translate-y-1/2 pl-2",
    "right-end": "left-full bottom-0 pl-2",
  }

  const arrowPositionClass: Record<string, string> = {
    "top-start": "-bottom-[5px] left-3",
    "top-center": "-bottom-[5px] left-1/2 -translate-x-1/2",
    "top-end": "-bottom-[5px] right-3",
    "bottom-start": "-top-[5px] left-3",
    "bottom-center": "-top-[5px] left-1/2 -translate-x-1/2",
    "bottom-end": "-top-[5px] right-3",
    "left-start": "-right-[5px] top-3",
    "left-center": "-right-[5px] top-1/2 -translate-y-1/2",
    "left-end": "-right-[5px] bottom-3",
    "right-start": "-left-[5px] top-3",
    "right-center": "-left-[5px] top-1/2 -translate-y-1/2",
    "right-end": "-left-[5px] bottom-3",
  }

  return (
    <div 
      ref={containerRef}
      className={clsx("relative flex w-fit cursor-pointer group/tooltip", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}
      <div 
        ref={contentRef}
        className={clsx(
          "absolute z-1000 transition-[opacity,visibility] duration-300 ease",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none",
          hoverContent ? "pointer-events-auto" : "pointer-events-none",
          tooltipPositionClass[adaptedPos]
        )}
      >
        <div className={clsx("relative bg-surface-primary-inv rounded-md shadow-sm shadow-neutral-700 dark:shadow-neutral-300 text-primary-inv w-max min-w-max", !noPadding && "p-3")}>
          {showArrow && (
            <div
              className={clsx(
                "absolute w-2.5 h-2.5 rotate-45 bg-surface-primary-inv",
                arrowPositionClass[adaptedPos]
              )}
            />
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
