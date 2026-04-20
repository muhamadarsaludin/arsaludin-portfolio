"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"
import { LuChevronRight, LuHouse } from "react-icons/lu"
import { useBreadcrumbs, type Breadcrumb } from "@/hooks/useBreadcrumbs"

interface MiracleBreadcrumbsProps {
  items?: Breadcrumb[]
  overrides?: Record<string, string>
  locales?: string[] | readonly string[] // Pass this for i18n projects (e.g., ['id', 'en'])
  className?: string
}

export default function MiracleBreadcrumbs({
  items,
  overrides,
  locales = [],
  className,
}: MiracleBreadcrumbsProps) {
  const pathname = usePathname()
  
  // Logic: Automatically generate breadcrumbs based on URL
  const autoItems = useBreadcrumbs({ pathname, locales, overrides })
  const finalItems = items ?? autoItems

  return (
    <nav 
      aria-label="Breadcrumb"
      className={clsx(
        "bg-primary border-primary flex w-fit items-center rounded-2xl border px-4 py-2.5",
        className
      )}
    >
      <ol className="flex items-center gap-2">
        {finalItems.map((item, index) => {
          const isHome = index === 0
          const isLast = index === finalItems.length - 1

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className="flex items-center">
                 <Link
                  href={item.href!}
                  aria-current={isLast ? "page" : undefined}
                  className={clsx(
                    "flex items-center gap-2 text-sm font-medium transition-all duration-200",
                    isLast
                      ? "text-blue"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  )}
                >
                  {isHome ? <LuHouse size={18} /> : item.label}
                </Link>

                {!isLast && (
                  <span className="text-secondary ml-2 flex opacity-40">
                    <LuChevronRight size={16} />
                  </span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}