"use client"

import { useEffect, useState } from "react"
import { LuArrowUp } from "react-icons/lu"
import clsx from "clsx"

export default function MiracleBackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={clsx(
        "fixed bottom-6 right-6 z-50",
        "flex h-12 w-12 items-center justify-center rounded-md",
        "bg-surface-primary-inv text-primary-inv shadow-lg",
        "transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "hover:transform hover:-translate-y-1 active:translate-y-0",
        "cursor-pointer",
        visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 translate-y-4"
      )}
    >
      <LuArrowUp className="h-5 w-5" />
    </button>
  )
}