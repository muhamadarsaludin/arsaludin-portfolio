"use client"

import clsx from "clsx"
import MiracleLoader from "@/components/miracle/Loader"
import React from "react"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
  variant?: "primary" | "secondary"
  status?: "default" | "danger"
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
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  const baseStyles =
    "text-sm flex items-center justify-center gap-2 rounded-md px-3 py-2 font-medium transition-colors duration-300 ease-in-out cursor-pointer"

  const variantStyles = {
    primary: {
      default: "bg-neutral-950 dark:bg-white text-neutral-50 dark:text-neutral-900",
      danger: "bg-red-600 dark:bg-red-500 text-white",
    },
    secondary: {
      default: "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 ring ring-neutral-950/10 dark:ring-white/50",
      danger: "bg-white dark:bg-neutral-950 text-red-600 dark:text-red-500 ring ring-red-600/50 dark:ring-red-500/50",
    },
  }

  const hoverStyles = {
    primary: {
      default: "hover:bg-neutral-700 dark:hover:bg-neutral-300",
      danger: "hover:bg-red-700 dark:hover:bg-red-600",
    },
    secondary: {
      default: "hover:bg-neutral-300 dark:hover:bg-neutral-700",
      danger: "hover:bg-red-50 dark:hover:bg-red-950/30",
    },
  }

  const disabledStyles =
    "opacity-50 cursor-not-allowed pointer-events-none"

  const widthClass = fullWidth ? "w-full" : "w-auto"

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        baseStyles,
        variantStyles[variant][status],
        !isDisabled && hoverStyles[variant][status],
        isDisabled && disabledStyles,
        widthClass,
        className
      )}
      {...props}
    >
      {loading ? (
        <MiracleLoader size={20} />
      ) : (
        <>
          {startIcon && <span className="flex">{startIcon}</span>}
          {children && <span>{children}</span>}
          {endIcon && <span className="flex">{endIcon}</span>}
        </>
      )}
    </button>
  )
}