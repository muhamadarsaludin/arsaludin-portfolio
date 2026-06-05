import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/utils/class-name"

type HeaderNavLinkProps = {
  label: string
  href: string
  isSidebar?: boolean
  disabled?: boolean
}

export default function HeaderNavLink({
  href,
  label,
  isSidebar,
  disabled = false,
}: HeaderNavLinkProps) {
  const pathname = usePathname()
  const isActive = href === "/" ? pathname === href : pathname.startsWith(href)

  if (disabled) {
    return <span>{label}</span>
  }
  return (
    <Link
      className={cn(
        "w-full py-2 text-sm transition-colors duration-300 ease-in-out",
        isSidebar && "rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900",
        isSidebar &&
          isActive &&
          "text-primary-inv bg-blue-100 hover:bg-blue-100! dark:bg-blue-950 dark:hover:bg-blue-950!",
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
