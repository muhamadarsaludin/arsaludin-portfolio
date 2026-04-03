"use client"

import { useScrollLock } from "@/hooks/useScrollLock"
import clsx from "clsx"
import { ReactNode, useEffect, useState } from "react"
import { LuX } from "react-icons/lu"

export type MiracleModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: ReactNode
  description?: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  showCloseIcon?: boolean
  closeOnOutsideClick?: boolean
  className?: string
  overlayClassName?: string
}

export default function MiracleModal({
  isOpen,
  onClose,
  children,
  title,
  description,
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
    full: "max-w-[90vw] md:max-w-screen-xl",
  }

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-in-out",
        isOpen ? "visible" : "pointer-events-none invisible"
      )}
    >
      {/* Overlay Backdrop */}
      <div
        className={clsx(
          "bg-overlay absolute inset-0 transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0",
          overlayClassName
        )}
        onClick={closeOnOutsideClick ? onClose : undefined}
      />

      {/* Modal Content */}
      <div
        className={clsx(
          "bg-primary border-primary relative flex w-full flex-col rounded-2xl border shadow-2xl transition-all duration-300 ease-in-out dark:shadow-black",
          sizeStyles[size],
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4 sm:translate-y-0",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {(title || showCloseIcon) && (
          <div className="flex shrink-0 items-center justify-between border-b border-primary px-6 py-4">
            <div className="flex flex-col gap-1">
              {title && <div className="text-lg font-semibold text-primary">{title}</div>}
              {description && <div className="text-sm text-secondary">{description}</div>}
            </div>
            {showCloseIcon && (
              <button
                onClick={onClose}
                className="ml-auto flex shrink-0 cursor-pointer items-center justify-center rounded-md p-2 text-secondary transition-colors duration-200 hover:bg-neutral-200 hover:text-primary dark:hover:bg-neutral-800"
                aria-label="Close modal"
              >
                <LuX size={20} />
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}