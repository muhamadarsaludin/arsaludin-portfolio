import type { RefObject } from "react"
import { useEffect, useRef } from "react"

type UseIntersectionObserverProps = {
  targetRef: RefObject<HTMLElement | null>
  onIntersect: () => void
  enabled?: boolean
  threshold?: number
  rootMargin?: string
}

export const useIntersectionObserver = ({
  targetRef,
  onIntersect,
  enabled = true,
  threshold = 0.1,
  rootMargin = "100px",
}: UseIntersectionObserverProps) => {
  const isTriggeredRef = useRef(false)

  useEffect(() => {
    if (!enabled || !targetRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (entry.isIntersecting && !isTriggeredRef.current) {
          isTriggeredRef.current = true
          onIntersect()
        }

        if (!entry.isIntersecting) {
          isTriggeredRef.current = false
        }
      },
      { threshold, rootMargin }
    )

    const currentElement = targetRef.current
    observer.observe(currentElement)

    return () => {
      observer.unobserve(currentElement)
      observer.disconnect()
    }
  }, [targetRef, enabled, threshold, rootMargin, onIntersect])
}