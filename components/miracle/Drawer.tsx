"use client"

import { createPortal } from "react-dom"
import { useScrollLock } from "@/hooks/useScrollLock"
import { cn } from "@/utils/class-name"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { LuX } from "react-icons/lu"

export type MiracleDrawerProps = {
  isOpen: boolean
  onClose: () => void
  position?: "top" | "right" | "bottom" | "left"
  size?: number | string
  children: ReactNode
  title?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  showCloseIcon?: boolean
  closeOnScrimClick?: boolean
  className?: string
  scrimClassName?: string
}

export default function MiracleDrawer({
  isOpen,
  onClose,
  position = "right",
  size,
  children,
  title,
  description,
  footer,
  showCloseIcon = true,
  closeOnScrimClick = true,
  className,
  scrimClassName,
}: MiracleDrawerProps) {
  const [isRendered, setIsRendered] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(frameId)
  }, [])

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setIsRendered(true)
    } else {
      setAnimate(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      const frameId = requestAnimationFrame(() => {
        setAnimate(true)
      })
      return () => cancelAnimationFrame(frameId)
    }
  }, [isOpen])

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setIsRendered(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  useScrollLock(isOpen)

  if (!isRendered) return null

  const borderStyles = {
    top: "border-b border-primary",
    bottom: "border-t border-primary",
    left: "border-r border-primary",
    right: "border-l border-primary",
  }

  const positionStyles = {
    top: "top-0 inset-x-0 w-full h-auto max-h-[90vh] rounded-b-2xl",
    bottom: "bottom-0 inset-x-0 w-full h-auto max-h-[90vh] rounded-t-2xl",
    left: "left-0 inset-y-0 w-80 h-full max-w-[90vw]",
    right: "right-0 inset-y-0 w-80 h-full max-w-[90vw]",
  }

  const translateOpen = "translate-x-0 translate-y-0 opacity-100"
  const translateClosed = {
    top: "-translate-y-full opacity-0",
    bottom: "translate-y-full opacity-0",
    left: "-translate-x-full opacity-0",
    right: "translate-x-full opacity-0",
  }

  const customStyle: React.CSSProperties = {}
  if (size !== undefined) {
    const formattedSize = typeof size === "number" ? `${size}px` : size
    if (position === "left" || position === "right") {
      customStyle.width = formattedSize
      customStyle.maxWidth = "100vw"
    } else {
      customStyle.height = formattedSize
      customStyle.maxHeight = "100vh"
    }
  }

  const drawerContent = (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={cn(
        "z-drawer fixed inset-0 transition-all duration-300 ease-in-out",
        animate ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
      )}
    >
      {/* Scrim Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out",
          animate ? "opacity-100" : "opacity-0",
          scrimClassName
        )}
        onClick={closeOnScrimClick ? onClose : undefined}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "z-drawer fixed flex flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out dark:bg-neutral-900",
          borderStyles[position],
          positionStyles[position],
          animate ? translateOpen : translateClosed[position],
          className
        )}
        style={customStyle}
      >
        {/* Header */}
        {(title || showCloseIcon) && (
          <div className="border-primary flex shrink-0 items-center justify-between gap-6 border-b px-5 py-4 md:px-6">
            <div className="flex flex-col gap-0.5">
              {title && (
                <div className={cn("text-primary text-lg leading-tight font-semibold")}>
                  {title}
                </div>
              )}
              {description && (
                <div className="text-secondary text-xs leading-relaxed font-medium">
                  {description}
                </div>
              )}
            </div>
            {showCloseIcon && (
              <button
                onClick={onClose}
                className="text-secondary hover:text-primary flex shrink-0 cursor-pointer items-center justify-center rounded-md p-1.5 transition-all duration-200 hover:bg-neutral-200 active:scale-90 dark:hover:bg-neutral-800"
              >
                <LuX size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 text-neutral-700 md:p-6 dark:text-neutral-300">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-neutral-200 px-5 py-4 md:px-6 dark:border-neutral-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  if (!mounted) return null

  return createPortal(drawerContent, document.body)
}
