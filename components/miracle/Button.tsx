"use client"

import clsx from "clsx"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
  fullWidth?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export default function MiracleButton({
  children,
  className,
  variant = "primary",
  fullWidth = false,
  startIcon,
  endIcon,
  ...props
}: ButtonProps) {
  const baseStyles = "text-sm flex items-center justify-center gap-2 rounded-md transition-colors px-3 py-2 font-medium"

  const variantStyles = clsx({
    primary: "bg-neutral-950 dark:bg-white text-neutral-50 dark:text-neutral-900",
    secondary: "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 ring ring-neutral-900 dark:ring-neutral-50",
  }[variant])

  const widthClass = fullWidth ? "w-auto" : "w-auto"

  return (
    <button
      className={clsx(baseStyles, variantStyles, widthClass, className)}
      {...props}
    >
      {startIcon && <span className="flex">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="flex">{endIcon}</span>}
    </button>
  )
}