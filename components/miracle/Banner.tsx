import { cn } from "@/utils/class-name"
import React from "react"
import { LuX } from "react-icons/lu"

export type BannerColor = "default" | "red" | "green" | "blue" | "yellow"
export type BannerVariant = "primary" | "secondary"

export type MiracleBannerProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  startIcon?: React.ReactNode
  color?: BannerColor
  variant?: BannerVariant
  onClear?: () => void
  isClearable?: boolean
  children?: React.ReactNode
  className?: string
}

export default function MiracleBanner({
  title,
  children,
  startIcon,
  className,
  color = "default",
  variant = "primary",
  onClear,
  isClearable = false,
  ...props
}: MiracleBannerProps) {
  const baseStyles = "relative flex w-full gap-2 p-2 rounded-lg border transition-all"

  const colorStyles: Record<BannerColor, Record<BannerVariant, string>> = {
    default: {
      primary: "bg-neutral-med text-primary-inv",
      secondary: "bg-neutral-low text-primary border-primary",
    },
    red: {
      primary: "bg-red text-primary-inv",
      secondary: "bg-red-low text-primary border-red",
    },
    green: {
      primary: "bg-green text-primary-inv",
      secondary: "bg-green-low text-primary border-green",
    },
    blue: {
      primary: "bg-blue text-primary-inv",
      secondary: "bg-blue-low text-primary border-blue",
    },
    yellow: {
      primary: "bg-yellow text-primary-inv",
      secondary: "bg-yellow-low text-primary border-yellow",
    },
  }

  const iconStyles: Record<BannerColor, Record<BannerVariant, string>> = {
    default: {
      primary: "text-primary-inv",
      secondary: "text-primary",
    },
    red: {
      primary: "text-primary-inv",
      secondary: "text-red",
    },
    green: {
      primary: "text-primary-inv",
      secondary: "text-green",
    },
    blue: {
      primary: "text-primary-inv",
      secondary: "text-blue",
    },
    yellow: {
      primary: "text-primary-inv",
      secondary: "text-yellow",
    },
  }

  const selectedStyles = colorStyles[color][variant]
  const selectedIconStyles = iconStyles[color][variant]

  return (
    <div className={cn(baseStyles, selectedStyles, className)} role="alert" {...props}>
      {/* Start Icon Slot */}
      {startIcon && <div className={cn("shrink-0 text-lg", selectedIconStyles)}>{startIcon}</div>}

      {/* Main Content Slot */}
      <div className="flex flex-1 flex-col gap-2">
        {title && <h4 className="leading-none font-semibold">{title}</h4>}
        {children && (
          <div
            className={cn("text-sm", variant === "primary" ? "text-primary-inv" : "text-secondary")}
          >
            {children}
          </div>
        )}
      </div>

      {/* Clearable/Close Action */}
      {isClearable && (
        <button
          onClick={onClear}
          type="button"
          className={cn(
            "text-primary -mt-1 -mr-1 h-fit shrink-0 cursor-pointer rounded-md p-1 transition-all hover:bg-black/5 active:scale-95 dark:hover:bg-white/10"
          )}
          aria-label="Dismiss"
        >
          <LuX size={18} />
        </button>
      )}
    </div>
  )
}
