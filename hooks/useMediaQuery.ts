import { useState, useEffect } from 'react'

// Sesuaikan dengan standar breakpoint Tailwind CSS
const breakpoints = [
  { name: '2xl', query: '(min-width: 1536px)' },
  { name: 'xl', query: '(min-width: 1280px)' },
  { name: 'lg', query: '(min-width: 1024px)' },
  { name: 'md', query: '(min-width: 768px)' },
  { name: 'sm', query: '(min-width: 640px)' },
] as const

export type Breakpoint = 'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export function useMediaQuery() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('default')

  useEffect(() => {
    const mediaQueryLists = breakpoints.map(bp => ({
      name: bp.name,
      mql: window.matchMedia(bp.query)
    }))

    const updateBreakpoint = () => {
      // Cari breakpoint terbesar yang cocok (karena array diurutkan dari 2xl ke sm)
      const active = mediaQueryLists.find(bp => bp.mql.matches)
      setBreakpoint(active ? active.name : 'default')
    }

    // Set initial values di sisi client untuk menghindari hydration mismatch error Next.js
    updateBreakpoint()

    // Menggunakan event listener yang spesifik pada media query (sangat ringan)
    const listener = () => updateBreakpoint()
    mediaQueryLists.forEach(bp => bp.mql.addEventListener('change', listener))
    
    return () => {
      mediaQueryLists.forEach(bp => bp.mql.removeEventListener('change', listener))
    }
  }, [])

  return { breakpoint }
}