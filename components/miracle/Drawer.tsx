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

  // Gabungkan transform dan opacity untuk transisi
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
    <>
      {/* Scrim Overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-all duration-300 ease-in-out",
          isOpen 
            ? "visible opacity-100" 
            : "invisible opacity-0 delay-300" // Delay visibility pas nutup
        )}
        onClick={closeOnScrimClick ? onClose : undefined}
      />

      {/* Drawer Panel */}
      <div
        className={clsx(
          "fixed z-[9999] flex flex-col bg-white dark:bg-neutral-900 shadow-2xl transition-all duration-300 ease-in-out",
          borderStyles[position],
          positionStyles[position],
          // TRIK: Gunakan delay pada visibility saat drawer ditutup
          isOpen 
            ? `visible ${translateOpen}` 
            : `invisible ${translateClosed[position]} delay-[0ms,300ms,300ms,300ms]`, // visibility jangan didelay pas buka, tapi delay pas tutup
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
    </>
  )

  return createPortal(drawerContent, document.body)
}