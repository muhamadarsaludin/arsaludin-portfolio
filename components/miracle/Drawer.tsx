"use client"

import { createPortal } from "react-dom"
import { useScrollLock } from "@/hooks/useScrollLock"
import clsx from "clsx"
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

  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  if (!isMounted) return null

  // --- Styles Logic ---
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

  const translateOpen = "translate-x-0 translate-y-0"
  const translateClosed = {
    top: "-translate-y-full",
    bottom: "translate-y-full",
    left: "-translate-x-full",
    right: "translate-x-full",
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

  // --- Drawer Content ---
  const drawerContent = (
    <>
      {/* Scrim Overlay */}
      <div
        className={clsx(
          "z-drawer-overlay bg-overlay fixed inset-0 transition-all duration-300 ease-in-out",
          isOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
          scrimClassName
        )}
        onClick={closeOnScrimClick ? onClose : undefined}
      />

      {/* Drawer Panel */}
      <div
        className={clsx(
          "z-drawer bg-primary fixed flex flex-col shadow-2xl transition-transform duration-300 ease-in-out dark:shadow-black",
          borderStyles[position],
          positionStyles[position],
          isOpen ? translateOpen : translateClosed[position],
          className
        )}
        style={customStyle}
      >
        {/* Header */}
        {(title || showCloseIcon) && (
          <div className="border-primary flex shrink-0 items-center justify-between border-b px-4 py-3">
            <div className="text-primary text-base font-semibold">{title}</div>
            {showCloseIcon && (
              <button
                onClick={onClose}
                className="ml-auto cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 dark:hover:bg-neutral-800"
                aria-label="Close drawer"
              >
                <LuX size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-primary shrink-0 border-t p-4 py-3">
            {footer}
          </div>
        )}
      </div>
    </>
  )

  return createPortal(drawerContent, document.body)
}