"use client"

import { cn } from "@/utils/class-name"
import type { InputHTMLAttributes, ReactNode } from "react"

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
  disabled,
  onChange,
  invers = false,
  ...props
}: RadioProps) {
  // Kita tidak wajib pakai useId() lagi jika input berada di dalam label
  return (
    <label
      className={cn(
        "grid cursor-pointer grid-cols-[auto_auto_1fr] items-center gap-x-2 gap-y-1",
        disabled ? "pointer-events-none opacity-50" : "",
        className
      )}
    >
      <input
        type="radio"
        className={cn(
          "h-4 w-4 cursor-pointer",
          invers ? "accent-blue-400 dark:accent-blue-600" : "accent-blue-600 dark:accent-blue-400"
        )}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />

      {iconStart && <span className="flex shrink-0">{iconStart}</span>}

      {/* Ubah div di bawah menjadi span atau fragment agar valid secara HTML */}
      <span className="text-sm select-none">
        {children}
      </span>

      {description && (
        <span className="text-secondary col-span-2 col-start-2 text-sm">
          {description}
        </span>
      )}
    </label>
  )
}