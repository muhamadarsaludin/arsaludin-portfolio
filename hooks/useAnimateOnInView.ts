"use client"

import { useState, useEffect, useRef } from 'react';

interface UseAnimateOnInViewOptions {
  /**
   * The threshold for the IntersectionObserver.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#threshold
   * @default 0.2
   */
  threshold?: number;
  /**
   * The delay in milliseconds before the animation is triggered.
   * @default 500
   */
  delay?: number;
  /**
   * Whether the animation should only trigger once.
   * @default true
   */
  triggerOnce?: boolean;
}

/**
 * A React hook to trigger an animation when an element is in view.
 * It uses the IntersectionObserver API to detect when an element is visible in the viewport.
 *
 * @param options - Configuration options for the hook.
 * @returns An object containing a `ref` to attach to the element and a boolean `showAnimation` state.
 *
 * @example
 * ```tsx
 * const { ref, showAnimation } = useAnimateOnInView({ delay: 1000, triggerOnce: true });
 *
 * return (
 *   <div ref={ref}>
 *     {showAnimation && <MyAnimatedComponent />}
 *   </div>
 * );
 * ```
 */
export function useAnimateOnInView<T extends HTMLElement>({
  threshold = 0.2,
  delay = 0,
  triggerOnce = true,
}: UseAnimateOnInViewOptions = {}) {
  const [showAnimation, setShowAnimation] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (timeoutId) return; // Don't set a new timeout if one is already pending
          timeoutId = setTimeout(() => setShowAnimation(true), delay);
          if (triggerOnce) observer.disconnect();
        } else {
          if (timeoutId) clearTimeout(timeoutId);
          if (!triggerOnce) setShowAnimation(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delay, threshold, triggerOnce]);

  return { ref, showAnimation };
}
