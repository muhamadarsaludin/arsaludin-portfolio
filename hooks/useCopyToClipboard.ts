import { useState, useRef, useCallback } from "react"

type CopyOptions = {
  defaultMessage?: string
  successMessage?: string
  errorMessage?: string
  duration?: number
}

export function useCopyToClipboard({
  defaultMessage = "Copy",
  successMessage = "Copied!",
  errorMessage = "Failed",
  duration = 1500,
}: CopyOptions = {}) {
  const [message, setMessage] = useState(defaultMessage)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setMessage(successMessage)
      } catch {
        setMessage(errorMessage)
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setMessage(defaultMessage)
      }, duration)
    },
    [defaultMessage, successMessage, errorMessage, duration]
  )

  return { message, copy }
}