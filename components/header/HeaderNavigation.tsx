"use client"
import { useTranslations } from "next-intl"
import HeaderNavLink from "./HeaderNavLink"
import clsx from "clsx"

type HeaderNavigationProps = {
  className?: string
  isSidebar?: boolean
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
    label: "articles",
    href: "/articles",
    disabled: false,
  },
  {
    label: "roadmap",
    href: "/roadmap",
    disabled: false,
  },
  {
    label: "lounge",
    href: "/lounge",
    disabled: false,
  }
]

export default function HeaderNavigation({ className, isSidebar }: HeaderNavigationProps) {
  const t = useTranslations("components.header.navigation")

  return (
    <nav className={clsx(
      "flex items-center", 
      isSidebar ? "gap-4" : "gap-6",
      className)}>
      {navigationLinks.map((link, index) => (
        <HeaderNavLink
          key={index}
          label={t(link.label)}
          href={link.href}
          isSidebar={isSidebar}
          disabled={link.disabled}
        />
      ))}
    </nav>
  )
}
