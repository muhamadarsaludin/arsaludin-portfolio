"use client"

import clsx from "clsx"
import MiracleLoader from "@/components/miracle/Loader"
import React from "react"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
  variant?: "primary" | "secondary"
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
    primary:
      "bg-neutral-950 dark:bg-white text-neutral-50 dark:text-neutral-900",
    secondary:
      "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 ring ring-neutral-950/10 dark:ring-white/50",
  }

  const hoverStyles = {
    primary: "hover:bg-neutral-700 dark:hover:bg-neutral-300",
    secondary: "hover:bg-neutral-300 dark:hover:bg-neutral-700",
  }

  const disabledStyles =
    "opacity-50 cursor-not-allowed pointer-events-none"

  const widthClass = fullWidth ? "w-full" : "w-auto"

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        !isDisabled && hoverStyles[variant],
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