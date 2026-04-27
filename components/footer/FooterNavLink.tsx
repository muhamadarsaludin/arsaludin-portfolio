import { Link } from "@/i18n/navigation"
import { useLocalizedPathname } from "@/hooks/useLocalizedPathname"
import clsx from "clsx"

type FooterNavLinkProps = {
  label: string
  href: string
  disabled?: boolean
}

export default function FooterNavLink({ href, label, disabled = false }: FooterNavLinkProps) {
  const pathname = useLocalizedPathname()
  const isActive = pathname === href

  if (disabled) {
    return <span className="py-2 text-sm text-neutral-med cursor-not-allowed">{label}</span>
  }
  return (
    <Link
      className={clsx(
        "py-2 text-sm transition-colors duration-300 ease-in-out",
        isActive
          ? "text-blue"
          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      )}
      href={href}
      aria-label={label}
    >
      {label}
    </Link>
  )
}
