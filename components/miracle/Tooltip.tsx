import clsx from 'clsx'
import { ReactNode } from 'react'

export type TooltipProps = {
  className?: string
  trigger: ReactNode
  children: ReactNode
}
// TODO: add position tooltip
export default function MiracleTooltip({className, trigger, children}: TooltipProps) {
  return (
    <div className={clsx("relative group cursor-pointer", className)}>
      {trigger}
      <div className="absolute invisible opacity-0 top-full right-0 transition-opacity duration-300 ease z-50 group-hover:opacity-100 group-hover:visible">
        <div className="p-4 mt-3 bg-white dark:bg-neutral-950 rounded-md shadow-md shadow-neutral-500/50 border border-gray-950/10 dark:border-white/10">
          {children}
        </div>
      </div>
    </div>
  )
}
