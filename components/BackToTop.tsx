"use client"

import { useEffect, useState } from "react"
import { LuArrowUp } from "react-icons/lu"
import clsx from "clsx"

export default function BackToTop() {
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
        "fixed right-6 bottom-6 z-50",
        "flex h-12 w-12 items-center justify-center rounded-md",
        "bg-primary-inv text-primary-inv shadow-lg",
        "transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "hover:-translate-y-1 hover:transform active:translate-y-0",
        "cursor-pointer",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <LuArrowUp className="h-5 w-5" />
    </button>
  )
}
