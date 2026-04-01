"use client"

import clsx from "clsx"
import { ReactNode, useEffect, useRef, useState } from "react"

export type MiraclePopoverProps = {
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
  noPadding?: boolean
  showArrow?: boolean
  noBackground?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function MiraclePopover({
  className,
  trigger,
  children,
  defaultPosition = "top-center",
  noPadding = false,
  noBackground = false,
  showArrow = true,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: MiraclePopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const [adaptedPos, setAdaptedPos] = useState(defaultPosition)

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    const nextState = !isOpen
    if (!isControlled) {
      setInternalOpen(nextState)
    }
    onOpenChange?.(nextState)
  }

  const handleClose = () => {
    if (!isControlled) {
      setInternalOpen(false)
    }
    onOpenChange?.(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && containerRef.current && contentRef.current) {
      const triggerRect = containerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let [side, align] = defaultPosition.split("-")

      if (side === "top" && triggerRect.top - contentRect.height < 0) side = "bottom"
      else if (side === "bottom" && triggerRect.bottom + contentRect.height > viewportHeight) side = "top"

      if (side === "left" && triggerRect.left - contentRect.width < 0) side = "right"
      else if (side === "right" && triggerRect.right + contentRect.width > viewportWidth) side = "left"

      if (side === "top" || side === "bottom") {
        if (align === "start" && triggerRect.left + contentRect.width > viewportWidth) align = "end"
        if (align === "end" && triggerRect.right - contentRect.width < 0) align = "start"
        if (align === "center") {
          if (triggerRect.left + triggerRect.width / 2 + contentRect.width / 2 > viewportWidth) align = "end"
          if (triggerRect.left + triggerRect.width / 2 - contentRect.width / 2 < 0) align = "start"
        }
      }

      if (side === "left" || side === "right") {
        if (align === "start" && triggerRect.top + contentRect.height > viewportHeight) align = "end"
        if (align === "end" && triggerRect.bottom - contentRect.height < 0) align = "start"
        if (align === "center") {
          if (triggerRect.top + triggerRect.height / 2 + contentRect.height / 2 > viewportHeight) align = "end"
          if (triggerRect.top + triggerRect.height / 2 - contentRect.height / 2 < 0) align = "start"
        }
      }

      setAdaptedPos(`${side}-${align}` as any)
    }
  }, [isOpen, defaultPosition])

  const popoverPositionClass: Record<string, string> = {
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
      className={clsx("relative flex w-fit", className)}
    >
      <div onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>

      <div
        ref={contentRef}
        className={clsx(
          "ease absolute z-1000 transition-[opacity,visibility] duration-300",
          isOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
          popoverPositionClass[adaptedPos]
        )}
      >
        <div
          className={clsx(
            "text-primary-inv relative w-max min-w-max rounded-md shadow-lg shadow-neutral-700/20 dark:shadow-neutral-300/10",
            !noBackground && "bg-surface-primary-inv",
            !noPadding && "p-3"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {showArrow && (
            <div
              className={clsx(
                "bg-surface-primary-inv absolute -z-1 h-2.5 w-2.5 rotate-45",
                !noBackground && "bg-surface-primary-inv",
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