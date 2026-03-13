"use client";
import { useTheme } from "next-themes";
import { LuMoon, LuSun, LuMonitorCog, LuPalette } from 'react-icons/lu'
import clsx from 'clsx'
import MiracleTooltip from "@/components/miracle/Tooltip";
import MiracleRadio from "@/components/miracle/Radio";
import { useEffect, useState } from "react";

export type ThemeToggleProps = {
  className?: string
}

export default function ThemeToggle({className}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleThemeChange = (theme: string) => {
    setTheme(theme)
  };

  const themes = [
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
    }
  ]
  
  const getThemeIcon = (theme: string, size: number = 18) => {
    switch (theme) {
      case "system":
        return <LuMonitorCog size={size} />;
      case "dark":
        return <LuMoon size={size} />;
      case "light":
        return <LuSun size={size} />;
      default:
        return null;
    }
  }
  
  return (
    <MiracleTooltip position="bottom-end" trigger={
      <button
        className={clsx(
          "p-2 rounded-md cursor-pointer group-hover/tooltip:bg-neutral-100 dark:group-hover/tooltip:bg-neutral-800 transition-colors duration-300 ease",
          className
        )}
        aria-label="Theme Toggle">
        <LuPalette size={20}/>
      </button>
    }>
      <div className="flex flex-col gap-2">
        {themes.map((themeData) => (
          <MiracleRadio
            key={themeData.value}
            className="rounded-sm"
            name="theme"
            value={themeData.value}
            checked={themeData.value === theme}
            iconStart={getThemeIcon(themeData.value, 16)}
            onChange={() => handleThemeChange(themeData.value)}>
            {themeData.label}
          </MiracleRadio>
        ))}
      </div>
    </MiracleTooltip>
  )
}
