"use client"

import clsx from "clsx"
import type { InputHTMLAttributes, ReactNode } from "react"
import { useId } from "react"

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode
  helperText?: ReactNode
  error?: boolean | string
  startIcon?: ReactNode
  endIcon?: ReactNode
  fullWidth?: boolean
}

export default function MiracleTextField({
  label,
  helperText,
  error,
  startIcon,
  endIcon,
  fullWidth = false,
  className,
  id,
  disabled,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id || generatedId
  const isError = !!error

  return (
    <div className={clsx("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            "text-sm font-medium select-none",
            disabled ? "text-secondary" : "text-primary"
          )}
        >
          {label}
          {props.required && <span className="text-red ml-1">*</span>}
        </label>
      )}

      <div
        className={clsx(
          "relative flex items-center rounded-md border transition-colors duration-200 ease-in-out",
          disabled ? "bg-neutral-100 opacity-50 dark:bg-neutral-900" : "bg-transparent",
          isError
            ? "border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500"
            : "border-neutral-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-neutral-700"
        )}
      >
        {startIcon && <span className="text-secondary flex items-center pl-3">{startIcon}</span>}

        <input
          id={inputId}
          disabled={disabled}
          className={clsx(
            "placeholder:text-secondary w-full bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-not-allowed",
            startIcon && "pl-2",
            endIcon && "pr-2"
          )}
          {...props}
        />

        {endIcon && <span className="text-secondary flex items-center pr-3">{endIcon}</span>}
      </div>

      {(helperText || typeof error === "string") && (
        <span className={clsx("text-xs", isError ? "text-red" : "text-secondary")}>
          {typeof error === "string" ? error : helperText}
        </span>
      )}
    </div>
  )
}
