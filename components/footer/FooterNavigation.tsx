"use client"
import { useTranslations } from "next-intl"
import clsx from "clsx"
import FooterNavLink from "./FooterNavLink"

type FooterNavigationProps = {
  className?: string
}

const navigationLinks = [
  {
    label: "changelog",
    href: "/changelog",
    disabled: false,
  },
  {
    label: "techStack",
    href: "/tech-stack",
    disabled: false,
  },
  {
    label: "vault",
    href: "/vault",
    disabled: false,
  },
  {
    label: "privacy",
    href: "/privacy",
    disabled: false,
  }
]

export default function FooterNavigation({ className }: FooterNavigationProps) {
  const t = useTranslations("components.footer.navigation")

  return (
    <nav className={clsx("flex items-center justify-center gap-3 md:gap-6", className)}>
      {navigationLinks.map((link, index) => (
        <FooterNavLink
          key={index}
          label={t(link.label)}
          href={link.href}
          disabled={link.disabled}
        />
      ))}
    </nav>
  )
}
