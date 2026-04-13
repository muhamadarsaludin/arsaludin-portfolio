"use client"
import { useTranslations } from "next-intl"
import HeaderNavLink from "./HeaderNavLink"
import clsx from "clsx"

type HeaderNavigationProps = {
  className?: string
}

const navigationLinks = [
  {
    label: "home",
    href: "/",
    disabled: false,
  },
  {
    label: "projects",
    href: "/projects",
    disabled: false,
  },
  {
    label: "achievements",
    href: "/achievements",
    disabled: false,
  },
  {
    label: "blogs",
    href: "/blogs",
    disabled: false,
  },
  {
    label: "forum",
    href: "/forum",
    disabled: false,
  },
]

export default function HeaderNavigation({ className }: HeaderNavigationProps) {
  const t = useTranslations("components.header.navigation")

  return (
    <nav className={clsx("flex items-center gap-6", className)}>
      {navigationLinks.map((link, index) => (
        <HeaderNavLink
          key={index}
          label={t(link.label)}
          href={link.href}
          disabled={link.disabled}
        />
      ))}
    </nav>
  )
}
