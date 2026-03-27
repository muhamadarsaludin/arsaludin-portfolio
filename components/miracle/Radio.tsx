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
        "grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-1 items-center cursor-pointer",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <input
        type="radio"
        id={radioId}
        className={clsx(
          "h-4 w-4 cursor-pointer",
          invers ? "accent-blue-400 dark:accent-blue-600 " : "accent-blue-600 dark:accent-blue-400 "
        )}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />

      {iconStart && <span className="flex shrink-0">{iconStart}</span>}

      <label htmlFor={radioId} className="select-none text-sm cursor-pointer">
        {children}
      </label>

      {description && (
        <span className="col-start-2 col-span-2 text-sm text-secondary cursor-pointer">
          {description}
        </span>
      )}
    </div>
  )
}