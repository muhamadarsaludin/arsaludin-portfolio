"use client"

import clsx from "clsx"
import { InputHTMLAttributes, ReactNode, useId } from "react"

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  description?: ReactNode
  iconStart?: ReactNode
  children?: ReactNode
  invers?: boolean
}

export default function MiracleRadio({
  children,
  description,
  iconStart,
  className,
  id,
  disabled,
  onChange,
  invers = false,
  ...props
}: RadioProps) {
  const generatedId = useId()
  const radioId = id || generatedId

  return (
    <div
      className={clsx(
        "grid cursor-pointer grid-cols-[auto_auto_1fr] items-center gap-x-2 gap-y-1",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      <input
        type="radio"
        id={radioId}
        className={clsx(
          "h-4 w-4 cursor-pointer",
          invers ? "accent-blue-400 dark:accent-blue-600" : "accent-blue-600 dark:accent-blue-400"
        )}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />

      {iconStart && <span className="flex shrink-0">{iconStart}</span>}

      <label htmlFor={radioId} className="cursor-pointer text-sm select-none">
        {children}
      </label>

      {description && (
        <span className="text-secondary col-span-2 col-start-2 cursor-pointer text-sm">
          {description}
        </span>
      )}
    </div>
  )
}
