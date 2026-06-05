"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/utils/class-name"

type FooterNavLinkProps = {
  label: string
  href: string
  disabled?: boolean
}

export default function FooterNavLink({ href, label, disabled = false }: FooterNavLinkProps) {
  const pathname = usePathname()
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href)

  if (disabled) {
    return <span className="text-neutral-med cursor-not-allowed py-2 text-sm">{label}</span>
  }

  return (
    <Link
      className={cn(
        "py-2 text-sm transition-colors duration-300 ease-in-out",
        isActive
          ? "text-blue font-medium"
          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      )}
      href={href}
      aria-label={label}
    >
      {label}
    </Link>
  )
}
