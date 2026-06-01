"use client"

import { cn } from "@/utils/class-name"
import type { ReactNode } from "react"
import { useEffect, useRef, useState, useLayoutEffect, useCallback } from "react"
import { createPortal } from "react-dom"

export type TooltipDefaultPosition =
  | "top-start" | "top-center" | "top-end"
  | "bottom-start" | "bottom-center" | "bottom-end"
  | "left-start" | "left-center" | "left-end"
  | "right-start" | "right-center" | "right-end"

export type TooltipProps = {
  className?: string
  trigger: ReactNode
  children: ReactNode
  defaultPosition?: TooltipDefaultPosition
  hoverContent?: boolean
  noPadding?: boolean
  noBackground?: boolean
  noShadow?: boolean
  noArrow?: boolean
}

export default function MiracleTooltip({
  className,
  trigger,
  children,
  defaultPosition = "top-center",
  hoverContent = false,
  noPadding = false,
  noBackground = false,
  noShadow = false,
  noArrow = false,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [adaptedPos, setAdaptedPos] = useState<TooltipDefaultPosition>(defaultPosition)
  const [mounted, setMounted] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(frameId)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const updatePosition = useCallback(() => {
    if (!containerRef.current || !contentRef.current || !isOpen) return

    const triggerRect = containerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // --- 1. AUTO CLOSE LOGIC ---
    if (
      triggerRect.bottom < 0 || 
      triggerRect.top > viewportHeight ||
      triggerRect.right < 0 ||
      triggerRect.left > viewportWidth
    ) {
      handleClose()
      return
    }

    const contentRect = contentRef.current.getBoundingClientRect()
    const gap = 8
    let [side, align] = defaultPosition.split("-")

    // --- 2. SMART FLIP ---
    if (side === "top" && triggerRect.top - contentRect.height - gap < 0) side = "bottom"
    else if (side === "bottom" && triggerRect.bottom + contentRect.height + gap > viewportHeight) side = "top"

    // --- 3. SMART ALIGNMENT ---
    if (side === "top" || side === "bottom") {
      const centerX = triggerRect.left + triggerRect.width / 2
      if (centerX - contentRect.width / 2 < 0) align = "start"
      else if (centerX + contentRect.width / 2 > viewportWidth) align = "end"
    }

    if (side === "left" || side === "right") {
      if (triggerRect.left - contentRect.width - gap < 0) side = "right"
      else if (triggerRect.right + contentRect.width + gap > viewportWidth) side = "left"
    }

    let top = 0
    let left = 0

    // --- 4. COORDINATE CALCULATION ---
    if (side === "top") top = triggerRect.top - contentRect.height - gap
    else if (side === "bottom") top = triggerRect.bottom + gap
    else {
      if (align === "start") top = triggerRect.top
      else if (align === "end") top = triggerRect.bottom - contentRect.height
      else top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2)
    }

    if (side === "left") left = triggerRect.left - contentRect.width - gap
    else if (side === "right") left = triggerRect.right + gap
    else {
      if (align === "start") left = triggerRect.left
      else if (align === "end") left = triggerRect.right - contentRect.width
      else left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2)
    }

    // Clamping Safety
    left = Math.max(gap, Math.min(left, viewportWidth - contentRect.width - gap))
    top = Math.max(gap, Math.min(top, viewportHeight - contentRect.height - gap))

    setCoords({ top, left })
    setAdaptedPos(`${side}-${align}` as TooltipDefaultPosition)
  }, [isOpen, defaultPosition, handleClose])

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition()

      const resizeObserver = new ResizeObserver(() => updatePosition())
      if (contentRef.current) resizeObserver.observe(contentRef.current)

      window.addEventListener("scroll", updatePosition, true)
      window.addEventListener("resize", updatePosition)

      return () => {
        resizeObserver.disconnect()
        window.removeEventListener("scroll", updatePosition, true)
        window.removeEventListener("resize", updatePosition)
      }
    }
  }, [isOpen, updatePosition])

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
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
    <>
      <div
        ref={containerRef}
        className={cn("group/tooltip relative flex cursor-pointer", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trigger}
      </div>

      {mounted && createPortal(
        <div
          ref={contentRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            transform: `translate3d(${coords.left}px, ${coords.top}px, 0)`,
            pointerEvents: isOpen && hoverContent ? "auto" : "none",
          }}
          className={cn(
            "z-tooltip transition-opacity duration-300 ease-in-out",
            isOpen ? "visible opacity-100" : "invisible opacity-0"
          )}
          onMouseEnter={hoverContent ? handleMouseEnter : undefined}
          onMouseLeave={hoverContent ? handleMouseLeave : undefined}
        >
          <div
            className={cn(
              "text-primary-inv relative w-max min-w-max rounded-md text-xs font-medium",
              !noShadow && "shadow-sm shadow-neutral-700 dark:shadow-neutral-300",
              !noBackground && "bg-primary-inv",
              !noPadding && "p-2"
            )}
          >
            {!noArrow && (
              <div
                className={cn(
                  "absolute z-1 h-2.5 w-2.5 rotate-45",
                  !noBackground && "bg-primary-inv",
                  arrowPositionClass[adaptedPos]
                )}
              />
            )}
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}