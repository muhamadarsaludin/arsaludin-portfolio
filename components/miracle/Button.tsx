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
  const baseStyles =
    "text-sm flex items-center justify-center gap-2 rounded-md px-3 py-2 font-medium cursor-pointer transition-colors duration-300 ease"
  const variantStyles = clsx(
    {
      primary:
        "bg-neutral-950 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-300 text-neutral-50 dark:text-neutral-900",
      secondary:
        "bg-white dark:bg-neutral-950 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-50 ring ring-neutral-950/10 dark:ring-white/50",
    }[variant]
  )

  const widthClass = fullWidth ? "w-auto" : "w-auto"

  return (
    <button className={clsx(baseStyles, variantStyles, widthClass, className)} {...props}>
      {startIcon && <span className="flex">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="flex">{endIcon}</span>}
    </button>
  )
}
