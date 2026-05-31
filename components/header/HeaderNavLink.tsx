import { Link } from "@/i18n/navigation"
import { useLocalizedPathname } from "@/hooks/useLocalizedPathname"
import { cn } from "@/utils/class-name"

type HeaderNavLinkProps = {
  label: string
  href: string
  isSidebar?: boolean
  disabled?: boolean
}

export default function HeaderNavLink({ href, label, isSidebar, disabled = false }: HeaderNavLinkProps) {
  const pathname = useLocalizedPathname()
  const isActive = pathname === href

  if (disabled) {
    return <span>{label}</span>
  }
  return (
    <Link
      className={cn(
        "py-2 text-sm transition-colors duration-300 ease-in-out w-full",
        isSidebar && "hover:bg-neutral-100 dark:hover:bg-neutral-900 p-2 rounded-md",
        isSidebar && isActive && "bg-blue-100 dark:bg-blue-950 hover:bg-blue-100! dark:hover:bg-blue-950! text-primary-inv",
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
