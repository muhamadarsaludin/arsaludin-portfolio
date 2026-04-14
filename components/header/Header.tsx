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
    setShowMenu((prev) => !prev)
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
    <header
      className={clsx(
        "bg-primary border-primary border-b",
        "z-header fixed inset-x-0 top-0",
        className
      )}
    >
      <div
        className={clsx(
          "mx-auto max-w-(--m-page-width) px-4 md:px-6 py-4",
          "flex items-center justify-between"
        )}
      >
        <div className="flex items-center gap-6">
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
          <HeaderNavigation className="hidden px-6 lg:flex" />
        </div>
        <div className="flex gap-3 items-center">
          <div className="hidden gap-3 lg:flex">
            {!isSignedIn && <SignInButton />}
            <DownloadResumeButton />
          </div>
          <div className="flex gap-1">
            <LangToggle />
            <ThemeToggle />
          </div>
          {isSignedIn && <HeaderAvatar />}
        </div>
      </div>

      {/* Drawer aside*/}
      <aside
        className={clsx(
          "z-header fixed top-17.25 bottom-0 left-0 w-fit p-4 lg:hidden",
          "flex flex-col justify-between gap-6 min-w-[220px]",
          "bg-primary border-primary border-r",
          "-translate-x-full transform transition-transform duration-300 ease-in-out",
          showMenu ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <HeaderNavigation className="flex flex-col items-start" isSidebar />
        <div className="flex flex-col gap-3">
          {!isSignedIn && <SignInButton />}
          <DownloadResumeButton />
        </div>
      </aside>

      {/* Overlay */}
      <div
        className={clsx(
          "bg-overlay z-header-overlay fixed top-17.25 right-0 bottom-0 left-0",
          "invisible opacity-0 transition-opacity duration-300 ease-in-out",
          showMenu && "visible opacity-100"
        )}
        onClick={() => setShowMenu(false)}
      />
    </header>
  )
}
