"use client"

import clsx from "clsx"
import { InputHTMLAttributes, ReactNode, useId } from "react"

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  description?: ReactNode
  iconStart?: ReactNode
  children?: ReactNode
}

export default function MiracleRadio({
  children,
  description,
  iconStart,
  className,
  id,
  disabled,
  onChange,
  ...props
}: RadioProps) {
  const generatedId = useId()
  const radioId = id || generatedId

  return (
    <div
      className={clsx(
        "grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-1 items-center",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <input
        type="radio"
        id={radioId}
        className="h-4 w-4 accent-blue-600 dark:accent-blue-400"
        disabled={disabled}
        onChange={onChange}
        {...props}
      />

      {iconStart && <span className="flex shrink-0">{iconStart}</span>}

      <label htmlFor={radioId} className="cursor-pointer select-none text-sm">
        {children}
      </label>

      {description && (
        <span className="col-start-2 col-span-2 text-sm text-secondary">
          {description}
        </span>
      )}
    </div>
  )
}