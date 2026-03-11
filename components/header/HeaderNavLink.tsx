import { Link } from '@/i18n/navigation'
import { useLocalizedPathname } from '@/hooks/useLocalizedPathname'
import clsx from 'clsx'

type HeaderNavLinkProps = {
  label: string
  href: string
  disabled?: boolean,
}

export default function HeaderNavLink({
  href,
  label,
  disabled = false,
}: HeaderNavLinkProps) {
  const pathname = useLocalizedPathname()
  const isActive = pathname === href
  
  if (disabled) {
    return (
      <span>{label}</span>
    )
  }
  return (
    <Link 
      className={clsx(
       "transition-colors duration-300 ease text-sm py-2",
        isActive
          ? "text-blue-600 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
          : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
      )}
      href={href} 
      aria-label={label}>
      {label}
    </Link>
  )
}
