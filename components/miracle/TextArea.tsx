"use client"

import { cn } from "@/utils/class-name"
import type { TextareaHTMLAttributes, ReactNode } from "react"
import { useId, useRef, useState, useEffect } from "react"
import { LuX } from "react-icons/lu"

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode
  helperText?: ReactNode
  error?: boolean | string
  fullWidth?: boolean
  clearable?: boolean
  onClear?: () => void
  autoResize?: boolean
  maxRows?: number
}

export default function MiracleTextArea({
  label,
  helperText,
  error,
  fullWidth = false,
  className,
  id,
  disabled,
  clearable = true,
  onClear,
  onChange,
  autoResize = true,
  maxRows = 5,
  rows = 3,
  ...props
}: TextAreaProps) {
  const generatedId = useId()
  const inputId = id || generatedId
  const isError = !!error

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [hasValue, setHasValue] = useState(
    () => String(props.value ?? props.defaultValue ?? "").length > 0
  )

  // Logic Auto Resize dengan batasan Rows
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = "auto" // Reset height untuk kalkulasi scrollHeight yang akurat

      const lineHeight = 20 // Perkiraan line-height teks (text-sm biasanya ~20px)
      const padding = 16 // Total padding atas-bawah (py-2 = 8px + 8px)

      const minHeight = rows * lineHeight + padding
      const maxHeight = maxRows * lineHeight + padding
      const scrollHeight = textarea.scrollHeight

      // Gunakan nilai terbesar antara minHeight dan scrollHeight, tapi jangan melebihi maxHeight
      const finalHeight = Math.min(Math.max(minHeight, scrollHeight), maxHeight)

      textarea.style.height = `${finalHeight}px`
    }
  }, [props.value, hasValue, autoResize, maxRows, rows])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0)
    onChange?.(e)
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (textareaRef.current) {
      // Trigger native value setter agar sinkron dengan state luar jika menggunakan library form
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set
      nativeInputValueSetter?.call(textareaRef.current, "")

      const event = new Event("input", { bubbles: true })
      textareaRef.current.dispatchEvent(event)
    }

    setHasValue(false)
    onClear?.()
  }

  const showClear =
    clearable && (props.value !== undefined ? String(props.value).length > 0 : hasValue)

  return (
    <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium select-none",
            disabled ? "text-neutral-500" : "text-neutral-900 dark:text-neutral-100"
          )}
        >
          {label}
          {props.required && <span className="text-red ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
          "relative flex rounded-md border transition-colors duration-200 ease-in-out",
          disabled ? "bg-neutral-100 opacity-50 dark:bg-neutral-900" : "bg-transparent",
          isError
            ? "border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500"
            : "border-neutral-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-neutral-700"
        )}
      >
        <textarea
          id={inputId}
          ref={textareaRef}
          disabled={disabled}
          className={cn(
            "w-full resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed",
            showClear && "pr-10"
          )}
          onChange={handleChange}
          rows={rows}
          {...props}
        />

        {showClear && (
          <div className="absolute top-2 right-2">
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              disabled={disabled}
              className="flex cursor-pointer items-center justify-center rounded-full p-1 text-neutral-600 transition-all outline-none hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed dark:text-neutral-400 hover:dark:bg-neutral-900 hover:dark:text-neutral-50"
              aria-label="Clear input"
            >
              <LuX size={16} />
            </button>
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
