"use client"

import { cn } from "@/utils/class-name"
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
import HeaderMobileDrawer from "./HeaderMobileDrawer"

type HeaderProps = {
  className?: string
}

export default function Header({ className }: HeaderProps) {
  const { isSignedIn } = useAuth()
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  const [prevPathname, setPrevPathname] = useState(pathname)

  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    if (showMenu) {
      setShowMenu(false)
    }
  }

  const handleToggle = () => {
    setShowMenu((prev) => !prev)
  }

  useScrollLock(showMenu)

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)")

    const handleChange = () => {
      if (media.matches) {
        setShowMenu((prev) => (prev ? false : prev))
      }
    }

    handleChange()
    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [])

  return (
    <header
      className={cn("bg-primary border-primary z-header fixed inset-x-0 top-0 border-b", className)}
    >
      <div
        className={cn(
          "mx-auto flex max-w-(--m-page-width) items-center justify-between px-4 py-4 md:px-6"
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
        <div className="flex items-center gap-3">
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

      <HeaderMobileDrawer
        showMenu={showMenu}
        isSignedIn={isSignedIn}
        onClose={() => setShowMenu(false)}
      />
    </header>
  )
}
