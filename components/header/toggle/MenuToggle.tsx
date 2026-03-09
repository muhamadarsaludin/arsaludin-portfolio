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
        "p-2 rounded-md cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300 ease",
        className
      )}
      onClick={handleToggle}
      aria-label="Menu Toggle">
      {showMenu ? <LuX size={20}/> : <LuMenu size={20}/>}
    </button>
  )
}
