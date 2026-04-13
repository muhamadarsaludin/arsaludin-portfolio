import clsx from "clsx"
import React from "react"

export type BadgeColor = "default" | "red" | "green" | "blue" | "yellow" | "purple"
export type BadgeVariant = "primary" | "secondary"

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  color?: BadgeColor
  variant?: BadgeVariant
}

export default function MiracleBadge({
  children,
  className,
  startIcon,
  endIcon,
  color = "default",
  variant = "primary",
  ...props
}: BadgeProps) {
  
  const baseStyles = "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"

  const colorStyles: Record<BadgeColor, Record<BadgeVariant, string>> = {
    default: {
      primary: "bg-neutral-700 text-white dark:bg-neutral-200 dark:text-neutral-900",
      secondary: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    },
    red: {
      primary: "bg-red-600 text-white dark:bg-red-500",
      secondary: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    green: {
      primary: "bg-green-600 text-white dark:bg-green-500",
      secondary: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    blue: {
      primary: "bg-blue-600 text-white dark:bg-blue-500",
      secondary: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    yellow: {
      primary: "bg-yellow-500 text-white dark:bg-yellow-400 dark:text-yellow-950",
      secondary: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    purple: {
      primary: "bg-purple-600 text-white dark:bg-purple-500",
      secondary: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
  }

  const selectedStyles = colorStyles[color][variant]

  return (
    <span 
      className={clsx(baseStyles, selectedStyles, className)} 
      {...props}
    >
      {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
      {children && <span>{children}</span>}
      {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
    </span>
  )
}