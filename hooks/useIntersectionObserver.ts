import { useEffect, RefObject } from "react"

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
  useEffect(() => {
    if (!enabled || !targetRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect()
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
  }, [targetRef, enabled, threshold, rootMargin])
}
