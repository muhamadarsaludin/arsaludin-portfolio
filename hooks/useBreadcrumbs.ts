"use client"

import { useMemo } from "react"

export type Breadcrumb = {
  label: string
  href?: string
}

type Options = {
  pathname: string
  locales?: string[] | readonly string[] // Optional: pass this to strip language codes (e.g., /id, /en)
  overrides?: Record<string, string>
}

function formatLabel(str: string) {
  return str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function useBreadcrumbs({
  pathname,
  locales = [],
  overrides = {}
}: Options): Breadcrumb[] {
  return useMemo(() => {
    if (!pathname) return []

    // 1. Split and clean segments
    const allSegments = pathname.split("/").filter(Boolean)
    
    // 2. Handle Locales: if the first segment is a locale, strip it
    const hasLocale = locales.includes(allSegments[0])
    const segments = hasLocale ? allSegments.slice(1) : allSegments
    const localePrefix = hasLocale ? `/${allSegments[0]}` : ""

    const results: Breadcrumb[] = []

    // 3. Add Home Base (always aware of locale prefix)
    results.push({
      label: overrides["home"] ?? "Home",
      href: localePrefix || "/"
    })

    // 4. Build Segments
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const path = segments.slice(0, i + 1).join("/")
      const href = `${localePrefix}/${path}`

      const label = overrides[segment] ?? formatLabel(segment)

      results.push({
        label,
        href: href
      })
    }

    return results
  }, [pathname, locales, JSON.stringify(overrides)])
}