"use client"

import clsx from "clsx"
import MiracleLoader from "@/components/miracle/Loader"
import React from "react"

// Added size to the type definition
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
  variant?: "primary" | "secondary"
  status?: "default" | "danger"
  size?: "xs" | "sm" | "md" | "lg" // New size prop
  fullWidth?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  loading?: boolean
  disabled?: boolean
}

export default function MiracleButton({
  children,
  className,
  variant = "primary",
  status = "default",
  size = "md", // Default size is medium
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  const baseStyles =
    "flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-in-out cursor-pointer rounded-md"

  // Dynamic padding, text size, and icon container based on size prop
  const sizeStyles = {
    xs: "text-[10px] px-2 py-1 gap-1 rounded-sm",
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  }

  // Loader size mapping to keep it proportional
  const loaderSizes = {
    xs: 12,
    sm: 14,
    md: 18,
    lg: 22,
  }

  const variantStyles = {
    primary: {
      default: "bg-neutral-950 dark:bg-white text-neutral-50 dark:text-neutral-900",
      danger: "bg-red-600 dark:bg-red-500 text-white",
    },
    secondary: {
      default: "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 ring-1 ring-neutral-950/10 dark:ring-white/20 shadow-sm",
      danger: "bg-white dark:bg-neutral-950 text-red-600 dark:text-red-500 ring-1 ring-red-600/50 dark:ring-red-500/50",
    },
  }

  const hoverStyles = {
    primary: {
      default: "hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95",
      danger: "hover:bg-red-700 dark:hover:bg-red-600 active:scale-95",
    },
    secondary: {
      default: "hover:bg-neutral-50 dark:hover:bg-neutral-900 active:scale-95",
      danger: "hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95",
    },
  }

  const disabledStyles =
    "opacity-50 cursor-not-allowed pointer-events-none grayscale"

  const widthClass = fullWidth ? "w-full" : "w-auto"

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        baseStyles,
        sizeStyles[size], // Apply the selected size
        variantStyles[variant][status],
        !isDisabled && hoverStyles[variant][status],
        isDisabled && disabledStyles,
        widthClass,
        className
      )}
      {...props}
    >
      {loading ? (
        <MiracleLoader size={loaderSizes[size]} />
      ) : (
        <>
          {startIcon && <span className="flex items-center">{startIcon}</span>}
          {children && <span>{children}</span>}
          {endIcon && <span className="flex items-center">{endIcon}</span>}
        </>
      )}
    </button>
  )
}