"use client"

import clsx from "clsx"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Link, usePathname } from "@/i18n/navigation"
import MenuToggle from "./toggle/MenuToggle"
import Image from "next/image"
import HeaderNavigation from "./HeaderNavigation"
import LangToggle from "./toggle/LangToggle"
import ThemeToggle from "./toggle/ThemeToggle"
import { useScrollLock } from "@/hooks/useScrollLock"
import DownloadResumeButton from "./button/DownloadResumeButton"
import SignInButton from "./button/SignInButton"
import HeaderAvatar from "./HeaderAvatar"
import { useAuth } from "@/providers/AuthProvider"

type HeaderProps = {
  className?: string
}

export default function Header({ className }: HeaderProps) {
  const t = useTranslations("components.header")
  const [showMenu, setShowMenu] = useState(false)
  const { isSignedIn } = useAuth()
  const pathname = usePathname()
  const handleToggle = () => {
    setShowMenu(prev => !prev)
  }
  useScrollLock(showMenu)
  useEffect(() => {
    setShowMenu(false)
  }, [pathname])
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)") // lg breakpoint
    const handleChange = () => {
      if (media.matches) {
        setShowMenu(false)
      }
    }
    handleChange()
    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [])
  
  return (
    <header className={clsx(
      "bg-surface-primary border-b border-primary",
      "fixed top-0 inset-x-0 z-100",
      className
      )}>
      <div className={clsx(
        "max-w-(--m-page-width) mx-auto py-4 px-6",
        "flex items-center justify-between"
        )}>
        <div className="flex gap-6 items-center">
          <MenuToggle className="lg:hidden" showMenu={showMenu} handleToggle={handleToggle} />
          <Link href="/" className="shrink-0" aria-label="Arsaludin Logo">
            <Image
              src="/logo/logo-light.svg"
              alt="logo"
              height={24}
              width={38}
              className="dark:hidden"
              priority
            />
            <Image
              src="/logo/logo-dark.svg"
              alt="logo"
              height={24}
              width={38}
              className="hidden dark:block"
              priority
            />
          </Link>
          <HeaderNavigation className="hidden lg:flex px-6"/>
        </div>
        <div className="flex gap-3">
          <div className="hidden lg:flex gap-3">
            {!isSignedIn && <SignInButton/>}
            <DownloadResumeButton/>
          </div>
          <div className="flex gap-1">
            <LangToggle/>
            <ThemeToggle/>
          </div>
          <HeaderAvatar />
        </div>
      </div>
      
      {/* Drawer aside*/}
      <aside className={clsx(
        "fixed z-100 top-17.25 bottom-0 left-0 w-fit p-6 lg:hidden",
        "flex flex-col gap-6 justify-between",
        "bg-surface-primary border-r border-primary",
        "-translate-x-full transform transition-transform duration-300 ease",
        showMenu ? "translate-x-0" : "-translate-x-full"
      )}>
        <HeaderNavigation className="flex flex-col items-start"/>
        <div className="flex flex-col gap-3">
          {!isSignedIn && <SignInButton/>}
          <DownloadResumeButton/>
        </div>
      </aside>

      {/* Overlay */}
      <div 
        className={clsx(
          "fixed z-99 top-17.25 left-0 right-0 bottom-0 bg-overlay",
          "invisible opacity-0 transition-opacity duration-300 ease",
          showMenu && "visible opacity-100"
        )} 
        onClick={() => setShowMenu(false)}>
      </div>
    </header>
  )
}
