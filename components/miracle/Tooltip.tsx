"use client"

import clsx from "clsx"
import type { ReactNode } from "react"
import { useEffect, useRef, useState, useLayoutEffect } from "react"
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
  const [adaptedPos, setAdaptedPos] = useState(defaultPosition)
  const [mounted, setMounted] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 100)
  }

  const updatePosition = () => {
    if (!containerRef.current || !contentRef.current) return

    const triggerRect = containerRef.current.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const gap = 8 // Jarak tooltip ke trigger

    let [side, align] = defaultPosition.split("-")

    // --- 1. FLIP LOGIC (Vertical) ---
    if (side === "top" && triggerRect.top - contentRect.height < gap) {
      side = "bottom"
    } else if (side === "bottom" && triggerRect.bottom + contentRect.height > viewportHeight - gap) {
      side = "top"
    }

    // --- 2. FLIP LOGIC (Horizontal) ---
    if (side === "left" && triggerRect.left - contentRect.width < gap) {
      side = "right"
    } else if (side === "right" && triggerRect.right + contentRect.width > viewportWidth - gap) {
      side = "left"
    }

    let top = 0
    let left = 0

    // --- 3. COORDINATE CALCULATION ---
    // Calculate Top
    if (side === "top") {
      top = triggerRect.top + scrollY - contentRect.height - gap
    } else if (side === "bottom") {
      top = triggerRect.bottom + scrollY + gap
    } else { // left or right
      if (align === "start") top = triggerRect.top + scrollY
      else if (align === "end") top = triggerRect.bottom + scrollY - contentRect.height
      else top = triggerRect.top + scrollY + (triggerRect.height / 2) - (contentRect.height / 2)
    }

    // Calculate Left
    if (side === "left") {
      left = triggerRect.left + scrollX - contentRect.width - gap
    } else if (side === "right") {
      left = triggerRect.right + scrollX + gap
    } else { // top or bottom
      if (align === "start") left = triggerRect.left + scrollX
      else if (align === "end") left = triggerRect.left + scrollX + triggerRect.width - contentRect.width
      else left = triggerRect.left + scrollX + (triggerRect.width / 2) - (contentRect.width / 2)
    }

    // --- 4. VIEWPORT BOUNDARY PROTECTION (Clamping) ---
    // Mencegah tooltip keluar dari sisi kiri atau kanan layar
    const minLeft = scrollX + gap
    const maxLeft = scrollX + viewportWidth - contentRect.width - gap
    const safeLeft = Math.max(minLeft, Math.min(left, maxLeft))

    // Mencegah tooltip keluar dari sisi atas atau bawah layar
    const minTop = scrollY + gap
    const maxTop = scrollY + viewportHeight - contentRect.height - gap
    const safeTop = Math.max(minTop, Math.min(top, maxTop))

    setCoords({ top: safeTop, left: safeLeft })
    setAdaptedPos(`${side}-${align}` as any)
  }

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition()
      // Gunakan event capture true untuk scroll agar lebih akurat
      window.addEventListener("scroll", updatePosition, true)
      window.addEventListener("resize", updatePosition)
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
    }
  }, [isOpen, defaultPosition])

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
        className={clsx("group/tooltip relative inline-flex cursor-pointer", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trigger}
      </div>

      {mounted && createPortal(
        <div
          ref={contentRef}
          style={{
            position: "absolute",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            zIndex: 9999,
          }}
          className={clsx(
            "pointer-events-none transition-opacity duration-300 ease-in-out",
            isOpen ? "opacity-100" : "opacity-0",
            hoverContent && isOpen && "pointer-events-auto"
          )}
          onMouseEnter={hoverContent ? handleMouseEnter : undefined}
          onMouseLeave={hoverContent ? handleMouseLeave : undefined}
        >
          <div
            className={clsx(
              "text-primary-inv relative w-max rounded-md text-xs font-medium",
              "max-w-[calc(100vw-32px)] break-words whitespace-normal", // Mencegah konten terlalu lebar di layar kecil
              !noShadow && "shadow-md shadow-black/20 dark:shadow-white/10",
              !noBackground && "bg-primary-inv",
              !noPadding && "p-2"
            )}
          >
            {!noArrow && (
              <div
                className={clsx(
                  "absolute z-[-1] h-2.5 w-2.5 rotate-45",
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