"use client"

import clsx from "clsx"
import { ReactNode, useEffect, useRef, useState } from "react"

export type TooltipProps = {
  className?: string
  trigger: ReactNode
  children: ReactNode
  defaultPosition?:
    | "top-start"
    | "top-center"
    | "top-end"
    | "bottom-start"
    | "bottom-center"
    | "bottom-end"
    | "left-start"
    | "left-center"
    | "left-end"
    | "right-start"
    | "right-center"
    | "right-end"
  hoverContent?: boolean
  noPadding?: boolean
  showArrow?: boolean
  open?: boolean
  triggerMode?: "hover" | "click"
  onOpenChange?: (open: boolean) => void 
}

export default function MiracleTooltip({
  className,
  trigger,
  children,
  defaultPosition = "top-center",
  hoverContent = false,
  noPadding = false,
  showArrow = true,
  triggerMode = "hover",
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [adaptedPos, setAdaptedPos] = useState(defaultPosition)

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Handles opening the tooltip on mouse enter if triggerMode is 'hover'
  const handleMouseEnter = () => {
    if (triggerMode === "hover") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsOpen(true)
    }
  }

  // Handles closing the tooltip on mouse leave if triggerMode is 'hover'
  const handleMouseLeave = () => {
    if (triggerMode === "hover") {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false)
      }, 100)
    }
  }

  // Handles toggling the tooltip on click if triggerMode is 'click'
  const handleClick = () => {
    if (triggerMode === "click") {
      setIsOpen((prev) => !prev)
    }
  }

  // Effect to clear any pending timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])


  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Effect to handle clicks outside the tooltip to close it when triggerMode is 'click'
  useEffect(() => {
    if (triggerMode === "click") {
      const handleClickOutside = (event: MouseEvent) => {
        // Close if click is outside both the trigger and the tooltip content
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node) &&
          contentRef.current &&
          !contentRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false) // Use the potentially controlled setIsOpen
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [triggerMode]) // Re-run this effect if triggerMode changes

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
          if (triggerRect.left + triggerRect.width / 2 + contentRect.width / 2 > viewportWidth)
            align = "end"
          if (triggerRect.left + triggerRect.width / 2 - contentRect.width / 2 < 0) align = "start"
        }
      }

      // Alignment adaptation (vertical)
      if (side === "left" || side === "right") {
        if (align === "start" && triggerRect.top + contentRect.height > viewportHeight)
          align = "end"
        if (align === "end" && triggerRect.bottom - contentRect.height < 0) align = "start"
        if (align === "center") {
          if (triggerRect.top + triggerRect.height / 2 + contentRect.height / 2 > viewportHeight)
            align = "end"
          if (triggerRect.top + triggerRect.height / 2 - contentRect.height / 2 < 0) align = "start"
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
      className={clsx("group/tooltip relative flex w-fit", className, (triggerMode === "hover" || triggerMode === "click") && "cursor-pointer")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {trigger}
      <div
        ref={contentRef}
        className={clsx(
          "ease absolute z-1000 transition-[opacity,visibility] duration-300",
          isOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
          hoverContent || triggerMode === "click" ? "pointer-events-auto" : "pointer-events-none", // Allow interaction with content if hoverContent is true or if triggered by click
          tooltipPositionClass[adaptedPos]
        )}
      >
        <div
          className={clsx(
            "bg-surface-primary-inv text-primary-inv relative w-max min-w-max rounded-md shadow-sm shadow-neutral-700 dark:shadow-neutral-300",
            !noPadding && "p-3"
          )}
        >
          {showArrow && (
            <div
              className={clsx(
                "bg-surface-primary-inv absolute z-1 h-2.5 w-2.5 rotate-45",
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
