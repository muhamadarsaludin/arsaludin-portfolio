"use client"

import React, { useEffect, useState, useRef } from "react"
import { Link } from "@/i18n/navigation"
import clsx from "clsx"
import { useLocale } from "next-intl"
import { MiracleReveal } from "./miracle/Reveal"

type TOCItem = {
  id: string
  text: string
  level: number
}

type TOCProps = {
  title?: string
  className?: string
}

export default function TableOfContents({ title, className }: TOCProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const navRef = useRef<HTMLUListElement>(null)
  const locale = useLocale()

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h1[id], h2[id], h3[id]"))
      .map((elem) => ({
        id: elem.id,
        text: (elem as HTMLElement).innerText || "",
        level: Number(elem.tagName.substring(1)),
      }))

    setHeadings(elements)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { 
        rootMargin: "0% 0% -65% 0%", 
        threshold: 1.0 
      }
    )

    elements.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Fungsi untuk Smooth Scroll saat klik
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Sesuaikan dengan tinggi header/navbar-mu jika ada
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
      
      // Update URL hash manual tanpa lompat (optional)
      window.history.pushState(null, "", `#${id}`)
    }
  }

  if (headings.length === 0) return null

  return (
    <nav className={clsx("flex flex-col max-h-[calc(100%-120px)] w-50 sticky top-20", className)}>
      <MiracleReveal animation="fade-left">
        <p className="mb-2 text-sm font-semibold uppercase text-primary">
          {title || locale === "id" ? "Daftar isi" : "On this page"}
        </p>
        <ul 
          ref={navRef}
          className="overflow-y-auto no-scrollbar"
        >
          {headings.map((heading) => {
            const isActive = activeId === heading.id
            const indentation = (heading.level - 1) * 1
            
            return (
              <li
                key={heading.id}
                data-active={isActive}
                className={clsx("group list-none")}
                style={{ paddingLeft: `${indentation}rem` }}
              >
                <Link
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className={clsx(
                    "block border-l-2 py-1.5 pl-3 text-sm transition-all duration-300",
                    isActive
                      ? "border-blue font-medium text-blue"
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 hover:dark:text-neutral-50 hover:font-medium"
                  )}
                >
                  {heading.text}
                </Link>
              </li>
            )
          })}
        </ul>
      </MiracleReveal>
    </nav>
  )
}