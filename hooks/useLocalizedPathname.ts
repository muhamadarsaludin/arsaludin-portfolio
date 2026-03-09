"use client"


import { usePathname } from "@/i18n/navigation"
import { useLocale } from "next-intl"

export function useLocalizedPathname() {
  const pathname = usePathname()
  const locale = useLocale()

  if (!pathname) return "/"

  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/'
  return pathWithoutLocale
}
