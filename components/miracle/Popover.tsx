"use client"

import clsx from "clsx"
import type { ReactNode } from "react"
import { useEffect, useRef, useState, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import type { TooltipDefaultPosition } from "./Tooltip"

export type PopoverDefaultPosition = TooltipDefaultPosition

export type MiraclePopoverProps = {
  className?: string
  trigger: ReactNode
  children: ReactNode
  defaultPosition?: PopoverDefaultPosition
  noPadding?: boolean
  noArrow?: boolean
  noBackground?: boolean
  noShadow?: boolean
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
  noShadow = false,
  noArrow = false,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: MiraclePopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [adaptedPos, setAdaptedPos] = useState(defaultPosition)
  const [mounted, setMounted] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
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

  // Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const isOutsideTrigger = containerRef.current && !containerRef.current.contains(target)
      const isOutsideContent = contentRef.current && !contentRef.current.contains(target)

      if (isOutsideTrigger && isOutsideContent) {
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

  const updatePosition = () => {
    if (!containerRef.current || !contentRef.current) return

    const triggerRect = containerRef.current.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const gap = 8

    let [side, align] = defaultPosition.split("-")

    // --- 1. FLIP LOGIC ---
    if (side === "top" && triggerRect.top - contentRect.height < gap) side = "bottom"
    else if (side === "bottom" && triggerRect.bottom + contentRect.height > viewportHeight - gap) side = "top"
    
    if (side === "left" && triggerRect.left - contentRect.width < gap) side = "right"
    else if (side === "right" && triggerRect.right + contentRect.width > viewportWidth - gap) side = "left"

    let top = 0
    let left = 0

    // --- 2. COORDINATE CALCULATION ---
    // Y Axis
    if (side === "top") top = triggerRect.top + scrollY - contentRect.height - gap
    else if (side === "bottom") top = triggerRect.bottom + scrollY + gap
    else {
      if (align === "start") top = triggerRect.top + scrollY
      else if (align === "end") top = triggerRect.bottom + scrollY - contentRect.height
      else top = triggerRect.top + scrollY + (triggerRect.height / 2) - (contentRect.height / 2)
    }

    // X Axis
    if (side === "left") left = triggerRect.left + scrollX - contentRect.width - gap
    else if (side === "right") left = triggerRect.right + scrollX + gap
    else {
      if (align === "start") left = triggerRect.left + scrollX
      else if (align === "end") left = triggerRect.left + scrollX + triggerRect.width - contentRect.width
      else left = triggerRect.left + scrollX + (triggerRect.width / 2) - (contentRect.width / 2)
    }

    // --- 3. CLAMPING (Mencegah Keluar Layar) ---
    const minLeft = scrollX + gap
    const maxLeft = scrollX + viewportWidth - contentRect.width - gap
    const safeLeft = Math.max(minLeft, Math.min(left, maxLeft))

    const minTop = scrollY + gap
    const maxTop = scrollY + viewportHeight - contentRect.height - gap
    const safeTop = Math.max(minTop, Math.min(top, maxTop))

    setCoords({ top: safeTop, left: safeLeft })
    setAdaptedPos(`${side}-${align}` as any)
  }

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition()
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
    <div ref={containerRef} className={clsx("relative inline-flex", className)}>
      <div onClick={handleToggle} className="cursor-pointer">
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
            "transition-opacity duration-300 ease-in-out",
            isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
        >
          <div
            className={clsx(
              "text-primary-inv relative rounded-md",
              "w-max max-w-[calc(100vw-32px)] break-words whitespace-normal", // Sangat penting untuk popover
              !noShadow && "shadow-md shadow-black/20 dark:shadow-white/10",
              !noBackground && "bg-primary-inv",
              !noPadding && "p-3" // Popover biasanya padding lebih besar dari tooltip
            )}
            onClick={(e) => e.stopPropagation()}
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
    </div>
  )
}