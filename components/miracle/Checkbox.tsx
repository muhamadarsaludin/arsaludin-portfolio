"use client"

import clsx from "clsx"
import type { InputHTMLAttributes, ReactNode } from "react"
import { useEffect, useId, useRef } from "react"

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  description?: ReactNode
  iconStart?: ReactNode
  children?: ReactNode
  invers?: boolean
  indeterminate?: boolean
}

export default function MiracleCheckbox({
  children,
  className,
  id,
  disabled,
  onChange,
  invers = false,
  indeterminate = false,
  ...props
}: CheckboxProps) {
  const generatedId = useId()
  const checkboxId = id || generatedId
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <div
      className={clsx(
        "flex cursor-pointer items-center gap-2",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={checkboxId}
        className={clsx(
          "h-4 w-4 cursor-pointer rounded-sm",
          invers ? "accent-blue-400 dark:accent-blue-600" : "accent-blue-600 dark:accent-blue-400"
        )}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />

      {children && (
        <label htmlFor={checkboxId} className="cursor-pointer text-sm select-none">
          {children}
        </label>
      )}
    </div>
  )
}