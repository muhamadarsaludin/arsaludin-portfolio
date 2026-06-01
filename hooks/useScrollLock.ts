"use client"

import type { RefObject } from "react"
import { useEffect } from "react"

const applyScrollLock = (el: HTMLElement, isLocked: boolean, originalValue: string) => {
  el.style.overflow = isLocked ? "hidden" : originalValue
}

export function useScrollLock(lock: boolean, ref?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const targetElement = ref ? ref.current : document.body
    if (!targetElement) return

    const originalOverflow = targetElement.style.overflow

    applyScrollLock(targetElement, lock, originalOverflow)

    return () => {
      applyScrollLock(targetElement, false, originalOverflow)
    }
  }, [lock, ref])
}