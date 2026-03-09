"use client"

import clsx from "clsx"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Link } from "@/i18n/navigation"
import MenuToggle from "./toggle/MenuToggle"
import Image from "next/image"
import HeaderNavigation from "./HeaderNavigation"
import MiracleButton from "../miracle/Button"
import { LuDownload } from "react-icons/lu"
import LangToggle from "./toggle/LangToggle"
import ThemeToggle from "./toggle/ThemeToggle"

type HeaderProps = {
  className?: string
}

export default function Header({ className }: HeaderProps) {
  const t = useTranslations("components.header")
  const [showMenu, setShowMenu] = useState(false)
  const handleToggle = () => {
    setShowMenu(prev => !prev)
  }

  return (
    <header className={clsx(className, "z-1000 px-6 bg-white dark:bg-neutral-950 border-b border-gray-950/10 dark:border-white/10")}>
      <div className="max-w-(--m-page-width) mx-auto py-4 flex items-center justify-between">
        <div className="flex gap-6 items-center">
          <MenuToggle className="lg:hidden" showMenu={showMenu} handleToggle={handleToggle} />
          <Link href="/" className="shrink-0" aria-label="Arsaludin Logo">
            <Image
              src="/logo/logo-light.svg"
              alt="logo"
              height={24}
              width={38}
              className="dark:hidden"
            />
            <Image
              src="/logo/logo-dark.svg"
              alt="logo"
              height={24}
              width={38}
              className="hidden dark:block"
            />
          </Link>
          <HeaderNavigation className="hidden lg:flex px-6"/>
        </div>
        <div className="flex gap-3">
          <div className="hidden lg:flex gap-3">
            <MiracleButton variant="secondary">
              {t("cta.contact")}
            </MiracleButton>
            <MiracleButton variant="primary" endIcon={ <LuDownload size={16}/> }>
              {t("cta.resume")}
            </MiracleButton>
          </div>
          <div className="flex gap-1">
            <LangToggle/>
            <ThemeToggle/>
          </div>
        </div>
      </div>
      {/* Drawer aside*/}
      <aside className={clsx(
        "fixed z-1000 top-[69px] bottom-0 inset-x-0 flex flex-col gap-6 justify-between w-fit bg-white dark:bg-neutral-950 p-6 border-r border-gray-950/10 dark:border-white/10 lg:hidden -translate-x-full",
        "transform transition-transform duration-300 ease-in-out",
        showMenu ? "translate-x-0" : "-translate-x-full"
      )}>
        <HeaderNavigation className="flex flex-col items-start"/>
        <div className="flex flex-col gap-3">
          <MiracleButton variant="secondary">
            {t("cta.contact")}
          </MiracleButton>
          <MiracleButton variant="primary" endIcon={ <LuDownload size={16}/> }>
            {t("cta.resume")}
          </MiracleButton>
        </div>
      </aside>
    </header>
  )
}
