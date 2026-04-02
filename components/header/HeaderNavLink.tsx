import { Link } from "@/i18n/navigation"
import { useLocalizedPathname } from "@/hooks/useLocalizedPathname"
import clsx from "clsx"

type HeaderNavLinkProps = {
  label: string
  href: string
  disabled?: boolean
}

export default function HeaderNavLink({ href, label, disabled = false }: HeaderNavLinkProps) {
  const pathname = useLocalizedPathname()
  const isActive = pathname === href

  if (disabled) {
    return <span>{label}</span>
  }
  return (
    <Link
      className={clsx(
        "py-2 text-sm transition-colors duration-300 ease-in-out",
        isActive
          ? "text-blue-600 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400"
          : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
      )}
      href={href}
      aria-label={label}
    >
      {label}
    </Link>
  )
}
