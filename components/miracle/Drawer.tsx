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
  footer,
  showCloseIcon = true,
  closeOnScrimClick = true,
  className,
  scrimClassName,
}: MiracleDrawerProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  const [isRendered, setIsRendered] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      const frameId = requestAnimationFrame(() => {
        setAnimate(true)
      })
      return () => cancelAnimationFrame(frameId)
    } else {
      setAnimate(false)
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

  if (!isMounted || !isRendered) return null

  // --- Styles Logic (100% Asli Kode Lu) ---
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
        "fixed inset-0 z-[9998] transition-all duration-300 ease-in-out",
        animate ? "visible" : "pointer-events-none invisible"
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
          "fixed z-[9999] flex flex-col bg-white dark:bg-neutral-900 shadow-2xl transition-all duration-300 ease-in-out",
          borderStyles[position],
          positionStyles[position],
          animate ? translateOpen : translateClosed[position],
          className
        )}
        style={customStyle}
      >
        {/* Header */}
        {(title || showCloseIcon) && (
          <div className="border-neutral-200 dark:border-neutral-800 flex shrink-0 items-center justify-between border-b px-5 md:px-6 py-4 gap-6">
            <div className="text-neutral-900 dark:text-white text-base font-semibold">
              {title}
            </div>
            {showCloseIcon && (
              <button
                onClick={onClose}
                className="ml-auto cursor-pointer rounded-md p-1.5 transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Close drawer"
              >
                <LuX size={20} className="text-neutral-500" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 text-neutral-700 dark:text-neutral-300">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-neutral-200 dark:border-neutral-800 shrink-0 border-t px-5 md:px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(drawerContent, document.body)
}