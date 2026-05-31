"use client"

import { cn } from "@/utils/class-name"
import type { InputHTMLAttributes, ReactNode } from "react"
import { useId, useRef, useState } from "react"
import { LuX } from "react-icons/lu"

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode
  helperText?: ReactNode
  error?: boolean | string
  startIcon?: ReactNode
  endIcon?: ReactNode
  fullWidth?: boolean
  clearable?: boolean
  onClear?: () => void
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
  clearable = true,
  onClear,
  onChange,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id || generatedId
  const isError = !!error

  const inputRef = useRef<HTMLInputElement>(null)
  const [hasValue, setHasValue] = useState(() => String(props.value ?? props.defaultValue ?? "").length > 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    onChange?.(e)
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (inputRef.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
      nativeInputValueSetter?.call(inputRef.current, "")
      
      const event = new Event("input", { bubbles: true })
      inputRef.current.dispatchEvent(event)
    }

    setHasValue(false)
    onClear?.()
  }

  const hasClearFeature = clearable
  const showClear = hasClearFeature && (props.value !== undefined ? String(props.value).length > 0 : hasValue)

  return (
    <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium select-none",
            disabled ? "text-secondary" : "text-primary"
          )}
        >
          {label}
          {props.required && <span className="text-red ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
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
          ref={inputRef}
          disabled={disabled}
          className={cn(
            "placeholder:text-secondary w-full bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-not-allowed",
            startIcon && "pl-2",
            (endIcon || hasClearFeature) && "pr-2"
          )}
          onChange={handleChange}
          {...props}
        />

        {(endIcon || hasClearFeature) && (
          <div className="flex shrink-0 items-center gap-1.5 pr-3">
            {hasClearFeature && (
              <button
                type="button"
                tabIndex={-1}
              onClick={handleClear}
                disabled={disabled}
                className={cn(
                  "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 hover:dark:text-neutral-50 hover:bg-neutral-100 hover:dark:bg-neutral-900 flex items-center justify-center outline-none transition-all disabled:cursor-not-allowed cursor-pointer p-1 rounded-full",
                  showClear ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
                )}
                aria-label="Clear input"
              >
                <LuX size={16} />
              </button>
            )}
            {endIcon && <span className="text-secondary flex items-center">{endIcon}</span>}
          </div>
        )}
      </div>

      {(helperText || typeof error === "string") && (
        <span className={cn("text-xs", isError ? "text-red" : "text-secondary")}>
          {typeof error === "string" ? error : helperText}
        </span>
      )}
    </div>
  )
}
