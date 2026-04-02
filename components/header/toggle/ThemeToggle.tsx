"use client"

import { useTheme } from "@wrksz/themes/client"
import { LuMoon, LuSun, LuMonitorCog, LuPalette } from "react-icons/lu"
import clsx from "clsx"
import MiracleTooltip from "@/components/miracle/Tooltip"
import MiracleRadio from "@/components/miracle/Radio"

export type ThemeToggleProps = {
  className?: string
}

type ThemeData = {
  value: "system" | "light" | "dark"
  label: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setTheme(theme)
  }

  const themes: ThemeData[] = [
    {
      value: "system",
      label: "System",
    },
    {
      value: "light",
      label: "Light",
    },
    {
      value: "dark",
      label: "Dark",
    },
  ]

  const getThemeIcon = (theme: string, size: number = 18) => {
    switch (theme) {
      case "system":
        return <LuMonitorCog size={size} />
      case "dark":
        return <LuMoon size={size} />
      case "light":
        return <LuSun size={size} />
      default:
        return null
    }
  }

  return (
    <MiracleTooltip
      defaultPosition="bottom-center"
      hoverContent
      trigger={
        <button
          className={clsx(
            "cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out group-hover/tooltip:bg-neutral-100 dark:group-hover/tooltip:bg-neutral-800",
            className
          )}
          aria-label="Theme Toggle"
        >
          <LuPalette size={20} />
        </button>
      }
    >
      <div className="flex flex-col gap-2">
        {themes.map((themeData) => (
          <MiracleRadio
            key={themeData.value}
            className="rounded-sm"
            name="theme"
            value={themeData.value}
            checked={themeData.value === theme}
            iconStart={getThemeIcon(themeData.value, 16)}
            invers
            onChange={() => handleThemeChange(themeData.value)}
          >
            {themeData.label}
          </MiracleRadio>
        ))}
      </div>
    </MiracleTooltip>
  )
}
