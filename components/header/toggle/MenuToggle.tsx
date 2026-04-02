"use client"

import clsx from "clsx"
import { LuMenu, LuX } from "react-icons/lu"

type MenuToggleProps = {
  className?: string
  showMenu: boolean
  handleToggle: () => void
}

export default function MenuToggle({ className, showMenu, handleToggle }: MenuToggleProps) {
  return (
    <button
      className={clsx(
        "cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 dark:hover:bg-neutral-800",
        className
      )}
      onClick={handleToggle}
      aria-label="Menu Toggle"
    >
      {showMenu ? <LuX size={20} /> : <LuMenu size={20} />}
    </button>
  )
}
