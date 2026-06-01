"use client"

import MiracleRadio from "@/components/miracle/Radio"
import MiracleTooltip from "@/components/miracle/Tooltip"
import { cn } from "@/utils/class-name"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { useRouter, usePathname } from "@/i18n/navigation"
import { LuLanguages } from "react-icons/lu"
import { useTransition } from "react"
import MiracleLoader from "@/components/miracle/Loader"

export type LangToggleProps = {
  className?: string
}

const LOCALES_DATA = [
  {
    value: "en",
    label: "English",
    iconStart: "/flag/en.svg",
  },
  {
    value: "id",
    label: "Indonesia",
    iconStart: "/flag/id.svg",
  },
]

export default function LangToggle({ className }: LangToggleProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("components.header.toggle")
  
  const [isPending, startTransition] = useTransition()

  const handleLocaleChange = (nextLocale: string) => {
    if (nextLocale === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale, scroll: false })
    })
  }

  return (
    <MiracleTooltip
      defaultPosition="bottom-center"
      hoverContent
      trigger={
        <button
          className={cn(
            "cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out group-hover/tooltip:bg-neutral-200 dark:group-hover/tooltip:bg-neutral-800",
            isPending && "opacity-70",
            className
          )}
          aria-label={t("ariaLabel.language")}
          disabled={isPending}
        >
          {isPending 
            ? (<MiracleLoader size={20}/>) 
            : (<LuLanguages size={20} />)
          }
        </button>
      }
    >
      <div className={cn("flex flex-col gap-2", isPending && "pointer-events-none opacity-60")}>
        {LOCALES_DATA.map((localeData) => (
          <MiracleRadio
            key={localeData.value}
            className="rounded-sm"
            name="language"
            value={localeData.value}
            checked={localeData.value === locale}
            invers
            iconStart={
              <Image
                className="shrink-0 rounded-sm border border-gray-950/10 dark:border-white/10"
                src={localeData.iconStart}
                alt={`${localeData.label} Flag`}
                width={20}
                height={15}
                priority
              />
            }
            onChange={() => handleLocaleChange(localeData.value)}
          >
            {localeData.label}
          </MiracleRadio>
        ))}
      </div>
    </MiracleTooltip>
  )
}