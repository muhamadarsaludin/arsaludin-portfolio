"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export const useUrlParams = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getParam = useCallback((key: string) => searchParams.get(key) || undefined, [searchParams])
  
  const getArrayParam = useCallback((key: string) => {
    const val = searchParams.get(key)
    return val ? val.split(",") : undefined
  }, [searchParams])

  const setParams = useCallback((updates: Record<string, string | string[] | undefined | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else {
        params.set(key, Array.isArray(value) ? value.join(",") : value)
      }
    })

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  return { setParams, getParam, getArrayParam, searchParams }
}