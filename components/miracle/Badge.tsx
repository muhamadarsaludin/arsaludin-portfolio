import clsx from "clsx"
import React from "react"

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export default function MiracleBadge({
  children,
  className,
  startIcon,
  endIcon,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 rounded-md bg-neutral-200/60 px-2.5 py-1 text-xs font-medium bg-surface-secondary text-secondary"

  return (
    <span className={clsx(baseStyles, className)} {...props}>
      {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
      {children && <span>{children}</span>}
      {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
    </span>
  )
}
