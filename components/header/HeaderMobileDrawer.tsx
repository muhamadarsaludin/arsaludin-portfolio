"use client"

import { cn } from "@/utils/class-name"
import HeaderNavigation from "./HeaderNavigation"
import SignInButton from "./button/SignInButton"
import DownloadResumeButton from "./button/DownloadResumeButton"

type MobileDrawerProps = {
  showMenu: boolean
  isSignedIn: boolean
  onClose: () => void
}

export default function HeaderMobileDrawer({ showMenu, isSignedIn, onClose }: MobileDrawerProps) {
  return (
    <>
      {/* Drawer aside */}
      <aside
        className={cn(
          "z-header fixed top-17.25 bottom-0 left-0 w-fit p-4 lg:hidden",
          "flex flex-col justify-between gap-6 min-w-[220px]",
          "bg-primary border-primary border-r",
          "-translate-x-full transform transition-transform duration-300 ease-in-out",
          showMenu && "translate-x-0"
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
          "invisible opacity-0 transition-opacity duration-300 ease-in-out",
          showMenu && "visible opacity-100"
        )}
        onClick={onClose}
      />
    </>
  )
}