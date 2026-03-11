import clsx from "clsx"
import { ReactNode } from "react"

export type TooltipProps = {
  className?: string
  trigger: ReactNode
  children: ReactNode
  position?: 
    | "top-start" | "top-center" | "top-end"
    | "bottom-start" | "bottom-center" | "bottom-end"
    | "left-start" | "left-center" | "left-end"
    | "right-start" | "right-center" | "right-end"
}
export default function MiracleTooltip({
  className,
  trigger, 
  children,
  position = "top-center"
}: TooltipProps) {
  const tooltipPositionClass: Record<string, string> = {
    "top-start": "bottom-full left-0 pb-2",
    "top-center": "bottom-full left-1/2 -translate-x-1/2 pb-2",
    "top-end": "bottom-full right-0 pb-2",
    "bottom-start": "top-full left-0 pt-2",
    "bottom-center": "top-full left-1/2 -translate-x-1/2 pt-2",
    "bottom-end": "top-full right-0 pt-2",
    "left-start": "right-full top-0 pr-2",
    "left-center": "right-full top-1/2 -translate-y-1/2 pr-2",
    "left-end": "right-full bottom-0 pr-2",
    "right-start": "left-full top-0 pl-2",
    "right-center": "left-full top-1/2 -translate-y-1/2 pl-2",
    "right-end": "left-full bottom-0 pl-2",
  }
  return (
    <div className={clsx("relative flex group/tooltip cursor-pointer", className)}>
      {trigger}
      <div className={clsx(
        "absolute invisible opacity-0 transition-opacity duration-300 ease z-1000 group-hover/tooltip:opacity-100 group-hover/tooltip:visible",
        tooltipPositionClass[position]
        )}>
        <div className="p-2 bg-white dark:bg-neutral-950 rounded-md shadow-md shadow-neutral-500/50 border border-gray-950/10 dark:border-white/10">
          {children}
        </div>
      </div>
    </div>
  )
}
