import { cn } from "@/utils/class-name"
import React from "react"

export type BadgeColor = "default" | "red" | "green" | "blue" | "yellow"
export type BadgeVariant = "primary" | "secondary"
export type BadgeSize = "sm" | "md"

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  color?: BadgeColor
  variant?: BadgeVariant
  size?: BadgeSize
  pill?: boolean
}

export default function MiracleBadge({
  children,
  className,
  startIcon,
  endIcon,
  color = "default",
  variant = "primary",
  size = "md",
  pill = false,
  ...props
}: BadgeProps) {
  
  const baseStyles = cn("inline-flex items-center gap-1.5 font-medium transition-colors", pill ? "rounded-full" : "rounded-md")

  const sizeStyles: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  }

  const colorStyles: Record<BadgeColor, Record<BadgeVariant, string>> = {
    default: {
      primary: "bg-secondary-inv text-primary-inv",
      secondary: "bg-neutral-low text-secondary",
    },
    red: {
      primary: "bg-red text-primary-inv",
      secondary: "bg-red-low text-red",
    },
    green: {
      primary: "bg-green text-primary-inv",
      secondary: "bg-green-low text-green",
    },
    blue: {
      primary: "bg-blue text-primary-inv",
      secondary: "bg-blue-low text-blue",
    },
    yellow: {
      primary: "bg-yellow text-primary-inv",
      secondary: "bg-yellow-low text-yellow",
    }
  }

  const selectedStyles = colorStyles[color][variant]
  const selectedSize = sizeStyles[size]

  return (
    <span 
      className={cn(baseStyles, selectedSize, selectedStyles, className)} 
      {...props}
    >
      {startIcon && <span className="shrink-0 flex items-center justify-center">{startIcon}</span>}
      {children && <span>{children}</span>}
      {endIcon && <span className="shrink-0 flex items-center justify-center">{endIcon}</span>}
    </span>
  )
}