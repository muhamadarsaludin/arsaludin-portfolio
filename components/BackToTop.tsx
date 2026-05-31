"use client"

import { useEffect, useState } from "react"
import { LuArrowUp } from "react-icons/lu"
import { cn } from "@/utils/class-name"

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
      className={cn(
        "fixed right-6 bottom-25 z-50",
        "flex h-12 w-12 items-center justify-center rounded-md",
        "bg-primary-inv text-primary-inv shadow-lg",
        "transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "hover:-translate-y-1 hover:transform active:translate-y-0",
        "cursor-pointer",
        visible 
          ? "translate-y-0 opacity-100 scale-100" 
          : "translate-y-30 opacity-0 scale-50 pointer-events-none"
      )}
    >
      <LuArrowUp className="h-5 w-5" />
    </button>
  )
}
