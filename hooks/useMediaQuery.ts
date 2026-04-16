import { useState, useEffect } from "react"

const breakpoints = [
  { name: "2xl", query: "(min-width: 1536px)" },
  { name: "xl", query: "(min-width: 1280px)" },
  { name: "lg", query: "(min-width: 1024px)" },
  { name: "md", query: "(min-width: 768px)" },
  { name: "sm", query: "(min-width: 640px)" },
] as const

export type Breakpoint = "default" | "sm" | "md" | "lg" | "xl" | "2xl"

export function useMediaQuery() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("default")

  useEffect(() => {
    const mediaQueryList = breakpoints.map((bp) => ({
      name: bp.name,
      mql: window.matchMedia(bp.query),
    }))

    const updateBreakpoint = () => {
      const active = mediaQueryList.find((item) => item.mql.matches)
      setBreakpoint(active ? active.name : "default")
    }

    updateBreakpoint()
    mediaQueryList.forEach((item) => {
      item.mql.addEventListener("change", updateBreakpoint)
    })

    return () => {
      mediaQueryList.forEach((item) => {
        item.mql.removeEventListener("change", updateBreakpoint)
      })
    }
  }, [])

  return {
    breakpoint,
    // Mobile: Di bawah 640px (default Tailwind)
    isMobile: breakpoint === "default",
    
    // Tablet: 640px (sm) sampai 1023px (md)
    isTablet: breakpoint === "sm" || breakpoint === "md",
    
    // Desktop: 1024px (lg) ke atas
    isDesktop: ["lg", "xl", "2xl"].includes(breakpoint),
    
    // Helper tambahan untuk fleksibilitas UI
    isMobileOrTablet: ["default", "sm", "md"].includes(breakpoint),
  }
}