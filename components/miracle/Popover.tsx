"use client"

import { cn } from "@/utils/class-name"
import type { ReactNode } from "react"
import { useEffect, useRef, useState, useLayoutEffect, useCallback } from "react"
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

  const handleClose = useCallback(() => {
    if (!isControlled) setInternalOpen(false)
    onOpenChange?.(false)
  }, [isControlled, onOpenChange])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextState = !isOpen
    if (!isControlled) setInternalOpen(nextState)
    onOpenChange?.(nextState)
  }

  const updatePosition = useCallback(() => {
    if (!containerRef.current || !contentRef.current || !isOpen) return

    const triggerRect = containerRef.current.getBoundingClientRect()
    const vW = window.innerWidth
    const vH = window.innerHeight

    // --- 1. AUTO CLOSE LOGIC ---
    // Tutup popover jika pemicu scroll keluar dari pandangan
    const isOffScreen = 
      triggerRect.bottom < 0 || 
      triggerRect.top > vH || 
      triggerRect.right < 0 || 
      triggerRect.left > vW

    if (isOffScreen) {
      handleClose()
      return
    }

    const contentRect = contentRef.current.getBoundingClientRect()
    const gap = 8
    let [side, align] = defaultPosition.split("-")

    // --- 2. SMART FLIP (Collision Vertikal & Horizontal) ---
    if (side === "top" && triggerRect.top - contentRect.height - gap < 0) side = "bottom"
    else if (side === "bottom" && triggerRect.bottom + contentRect.height + gap > vH) side = "top"
    
    if (side === "left" && triggerRect.left - contentRect.width - gap < 0) side = "right"
    else if (side === "right" && triggerRect.right + contentRect.width + gap > vW) side = "left"

    // --- 3. SMART ALIGNMENT (Koreksi Start/Center/End) ---
    if (side === "top" || side === "bottom") {
      const centerX = triggerRect.left + triggerRect.width / 2
      if (centerX - contentRect.width / 2 < 0) align = "start"
      else if (centerX + contentRect.width / 2 > vW) align = "end"
    }

    let top = 0
    let left = 0

    // --- 4. COORDINATE CALCULATION (Fixed Coordinates) ---
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

    // Safety Clamp
    left = Math.max(gap, Math.min(left, vW - contentRect.width - gap))
    top = Math.max(gap, Math.min(top, vH - contentRect.height - gap))

    setCoords({ top, left })
    setAdaptedPos(`${side}-${align}` as any)
  }, [isOpen, defaultPosition, handleClose])

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        contentRef.current && !contentRef.current.contains(target)
      ) {
        handleClose()
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, handleClose])

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition()

      // Monitor perubahan ukuran (Misal: dari Loading ke EmojiPicker)
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
    <div ref={containerRef} className={cn("relative inline-flex", className)}>
      <div onClick={handleToggle} className="cursor-pointer">
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
            zIndex: 9999,
          }}
          className={cn(
            "transition-opacity duration-300 ease-in-out",
            isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
        >
          <div
            className={cn(
              "text-primary-inv relative rounded-md",
              "w-max max-w-[calc(100vw-32px)] break-words whitespace-normal",
              !noShadow && "shadow-lg shadow-black/20 dark:shadow-white/10",
              !noBackground && "bg-primary-inv",
              !noPadding && "p-3"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {!noArrow && (
              <div
                className={cn(
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