"use client"

import { cn } from "@/utils/class-name"
import MiracleLoader from "@/components/miracle/Loader"
import React from "react"
import Link from "next/link"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
  variant?: "primary" | "secondary"
  status?: "default" | "danger"
  size?: "xs" | "sm" | "md" | "lg"
  fullWidth?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  loading?: boolean
  disabled?: boolean
  isSquare?: boolean
  href?: string
  target?: string
}

export default function MiracleButton({
  children,
  className,
  variant = "primary",
  status = "default",
  size = "md",
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  disabled = false,
  isSquare = false,
  href,
  target,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  const baseStyles =
    "flex items-center justify-center gap-1 font-medium transition-all duration-300 ease-in-out cursor-pointer rounded-md inline-flex"

  const sizeStyles = {
    xs: isSquare ? "p-1 h-6 w-6 text-[10px]" : "text-[10px] px-2 py-1 gap-1 rounded-sm",
    sm: isSquare ? "p-1.5 h-8 w-8 text-xs" : "text-xs px-2.5 py-1.5 gap-1",
    md: isSquare ? "p-2 h-10 w-10 text-sm" : "text-sm px-4 py-2 gap-1.5",
    lg: isSquare ? "p-3 h-12 w-12 text-base" : "text-base px-6 py-3 gap-2",
  }

  const variantStyles = {
    primary: {
      default: "bg-neutral-950 dark:bg-white text-neutral-50 dark:text-neutral-900",
      danger: "bg-red-600 dark:bg-red-500 text-white",
    },
    secondary: {
      default:
        "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 ring-1 ring-neutral-950/10 dark:ring-white/20 shadow-sm",
      danger:
        "bg-white dark:bg-neutral-950 text-red-600 dark:text-red-500 ring-1 ring-red-600/50 dark:ring-red-500/50",
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

  const styles = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant][status],
    !isDisabled && hoverStyles[variant][status],
    isDisabled && "opacity-50 grayscale cursor-not-allowed!",
    fullWidth && !isSquare ? "w-full" : "",
    className
  )

  const content = loading ? (
    <MiracleLoader size={18} />
  ) : (
    <>
      {startIcon && <span className="flex shrink-0 items-center">{startIcon}</span>}
      {children && <span>{children}</span>}
      {endIcon && <span className="flex shrink-0 items-center">{endIcon}</span>}
    </>
  )

  if (href) {
    const isExternal = href.startsWith("http")
    
    if (isExternal) {
      return (
        <a href={href} target={target || "_blank"} rel="noopener noreferrer" className={styles}>
          {content}
        </a>
      )
    }

    return (
      <Link href={href} className={styles}>
        {content}
      </Link>
    )
  }

  return (
    <button disabled={isDisabled} className={styles} {...props}>
      {content}
    </button>
  )
}