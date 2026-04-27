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
    label: "roadmap",
    href: "/roadmap",
    disabled: true,
  },
  {
    label: "techStack",
    href: "/tech-stack",
    disabled: false,
  },
  {
    label: "inspirationWebsite",
    href: "/inpiration-website",
    disabled: false,
  },
  {
    label: "privacyPolicy",
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
