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
    disabled: false
  },
  {
    label: "projects",
    href: "/projects",
    disabled: false
  },
  {
    label: "certifications",
    href: "/certifications",
    disabled: false
  },
  {
    label: "blog",
    href: "/blog",
    disabled: false
  },
  {
    label: "dashboard",
    href: "/dashboard",
    disabled: false
  }
]

export default function HeaderNavigation({className}: HeaderNavigationProps) {
  const t = useTranslations("components.header.navigation")

  return (
    <nav className={clsx("flex gap-6 items-center", className)}>
      {navigationLinks.map((link, index) => (
        <HeaderNavLink key={index} label={t(link.label)} href={link.href} disabled={link.disabled} />
      ))}
    </nav>
  )
}
