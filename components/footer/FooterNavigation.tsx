"use client"
import { useTranslations } from "next-intl"
import { cn } from "@/utils/class-name"
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
  },
]

export default function FooterNavigation({ className }: FooterNavigationProps) {
  const t = useTranslations("components.footer.navigation")

  return (
    <nav
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 md:gap-x-6",
        className
      )}
    >
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
