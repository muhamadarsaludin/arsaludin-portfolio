"use client"

import { useEffect, RefObject } from "react"

export function useScrollLock(
  lock: boolean,
  ref?: RefObject<HTMLElement>
) {
  useEffect(() => {
    const element = ref?.current ?? document.body
    const originalOverflow = element.style.overflow

    if (lock) {
      element.style.overflow = "hidden"
    } else {
      element.style.overflow = originalOverflow
    }

    return () => {
      element.style.overflow = originalOverflow
    }
  }, [lock, ref])
}