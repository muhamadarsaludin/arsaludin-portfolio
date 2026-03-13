"use client"

import MiracleButton from "@/components/miracle/Button"
import { FaGithub, FaLinkedinIn, FaInstagram, FaXTwitter, FaCode } from "react-icons/fa6"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import clsx from "clsx"

export default function Footer() {
  const t = useTranslations("components.footer")

  const socmeds = [
    { name: "Linkedin", icon: FaLinkedinIn, href: "https://www.linkedin.com/in/muhamad-arsaludin/" },
    { name: "Github", icon: FaGithub, href: "https://github.com/muhamadarsaludin" },
    { name: "Google Developer", icon: FaCode, href: "https://developers.google.com/profile/u/arsaludin" },
    { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/muhamadarsaludin/" },
    { name: "X", icon: FaXTwitter, href: "https://x.com/Arsaludin71" },
  ]

  const year = new Date().getFullYear()

  const [localTime, setLocalTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setLocalTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="bg-surface-primary border-t border-primary">
      <div className="max-w-(--m-page-width) mx-auto px-6">
        {/* Top */}
        <div className="flex flex-col items-center py-10 text-center gap-4 md:gap-6">
          <p className="text-secondary font-medium text-lg md:text-xl lg:text-2xl">
            {t("subtitle")}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            {t("title")}
          </h2>
          <a
            href="mailto:muhamadarsaludin71@gmail.com?subject=Let's%20Work%20Together"
            aria-label="Contact via email">
            <MiracleButton>{t("cta")}</MiracleButton>
          </a>
          <p className="text-sm text-secondary">
            {t("timeLabel")}{" "}
            <time className="font-medium text-primary">
              {localTime}
            </time>
          </p>
          <div className="flex gap-3 md:gap-4">
            {socmeds.map((socmed) => {
              const Icon = socmed.icon
              return (
                <a
                  key={socmed.name}
                  href={socmed.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socmed.name}
                  className={clsx(
                    "flex items-center justify-center rounded-md p-2",
                    "transition-all duration-300 ease hover:-translate-y-1",
                    "border border-primary",
                    "bg-white dark:bg-neutral-950 hover:bg-neutral-950 dark:hover:bg-white",
                    "text-neutral-900 dark:text-neutral-50 hover:text-neutral-50 dark:hover:text-neutral-900"
                  )}
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-primary py-6 text-center">
          <p className="text-sm text-secondary">
            © <time>{year}</time> {t("copyright")}
          </p>
        </div>

      </div>
    </footer>
  )
}