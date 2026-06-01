"use client"

import { cn } from "@/utils/class-name"
import { useEffect, useState } from "react"
import HeaderNavigation from "./HeaderNavigation"
import SignInButton from "./button/SignInButton"
import DownloadResumeButton from "./button/DownloadResumeButton"

type MobileDrawerProps = {
  showMenu: boolean
  isSignedIn: boolean
  onClose: () => void
}

export default function HeaderMobileDrawer({ showMenu, isSignedIn, onClose }: MobileDrawerProps) {
  const [isRendered, setIsRendered] = useState(showMenu)
  const [animate, setAnimate] = useState(false)
  const [prevShowMenu, setPrevShowMenu] = useState(showMenu)

  if (showMenu !== prevShowMenu) {
    setPrevShowMenu(showMenu)
    if (showMenu) {
      setIsRendered(true)
    } else {
      setAnimate(false)
    }
  }

  useEffect(() => {
    if (showMenu) {
      const frameId = requestAnimationFrame(() => {
        setAnimate(true)
      })
      return () => cancelAnimationFrame(frameId)
    }
  }, [showMenu])

  const handleTransitionEnd = () => {
    if (!showMenu) {
      setIsRendered(false)
    }
  }

  if (!isRendered) return null

  return (
    <>
      {/* Drawer aside */}
      <aside
        onTransitionEnd={handleTransitionEnd}
        className={cn(
          "z-header fixed top-17.25 bottom-0 left-0 w-fit p-4 lg:hidden",
          "flex flex-col justify-between gap-6 min-w-[220px]",
          "bg-primary border-primary border-r",
          "transform transition-transform duration-300 ease-in-out",
          animate ? "translate-x-0" : "-translate-x-full"
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
        className={cn(
          "bg-overlay z-header-overlay fixed top-17.25 right-0 bottom-0 left-0 lg:hidden",
          "transition-opacity duration-300 ease-in-out",
          animate ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        )}
        onClick={onClose}
      />
    </>
  )
}