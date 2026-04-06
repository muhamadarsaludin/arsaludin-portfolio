"use client"

import { useScrollLock } from "@/hooks/useScrollLock"
import clsx from "clsx"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { LuX } from "react-icons/lu"

export type MiracleModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: ReactNode
  description?: ReactNode
  status?: "default" | "success" | "error" | "warning" | "info"
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showCloseIcon?: boolean
  closeOnOutsideClick?: boolean
  className?: string
  overlayClassName?: string
}

const statusColors = {
  default: "text-primary",
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
  info: "text-blue-600 dark:text-blue-400",
}

export default function MiracleModal({
  isOpen,
  onClose,
  children,
  title,
  description,
  status = "default",
  size = "md",
  showCloseIcon = true,
  closeOnOutsideClick = true,
  className,
  overlayClassName,
}: MiracleModalProps) {
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
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  useScrollLock(isOpen)

  if (!isMounted) return null

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-[95vw] md:max-w-screen-xl",
  }

  const modalElement = (
    <div
      className={clsx(
        "fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ease-in-out",
        isOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
      )}
    >
      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0",
          overlayClassName
        )}
        onClick={closeOnOutsideClick ? onClose : undefined}
      />

      {/* Box Modal */}
      <div
        className={clsx(
          "bg-primary border-primary relative z-10 flex w-full flex-col rounded-3xl border shadow-2xl transition-all duration-300 ease-in-out dark:shadow-black",
          sizeStyles[size],
          isOpen ? "translate-y-0 scale-100" : "translate-y-12 scale-95 sm:translate-y-0",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {(title || showCloseIcon) && (
          <div className="border-primary flex shrink-0 items-center justify-between border-b px-6 py-5">
            <div className="flex flex-col gap-1">
              {title && (
                <div className={clsx("text-lg leading-tight font-bold", statusColors[status])}>
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
                className="text-secondary hover:text-primary ml-auto flex shrink-0 cursor-pointer items-center justify-center rounded-xl p-2 transition-all duration-200 hover:bg-neutral-100 active:scale-90 dark:hover:bg-neutral-800"
              >
                <LuX size={22} />
              </button>
            )}
          </div>
        )}

        <div className="scrollbar-hide flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  )

  return createPortal(modalElement, document.body)
}
