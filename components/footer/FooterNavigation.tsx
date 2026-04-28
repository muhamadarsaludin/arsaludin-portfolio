"use client"
import { useTranslations } from "next-intl"
import clsx from "clsx"
import FooterNavLink from "./FooterNavLink"

type FooterNavigationProps = {
  className?: string
}

const navigationLinks = [
  {
    label: "roadmap",
    href: "/roadmap",
    disabled: true,
  },
  {
    label: "changelog",
    href: "/changelog",
    disabled: false,
  },
  {
    label: "gear-and-setup",
    href: "/gear-and-setup",
    disabled: false,
  },
  {
    label: "inspiration-website",
    href: "/inspiration-website",
    disabled: false,
  },
  {
    label: "privacy-policy",
    href: "/privacy-policy",
    disabled: false,
  }
]

export default function FooterNavigation({ className }: FooterNavigationProps) {
  const t = useTranslations("components.footer.navigation")

  return (
    <nav className={clsx("flex items-center justify-center gap-y-1 gap-x-3 md:gap-x-6 flex-wrap", className)}>
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
