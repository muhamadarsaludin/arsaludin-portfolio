import MiracleRadio from "@/components/miracle/Radio"
import MiracleTooltip from "@/components/miracle/Tooltip"
import clsx from "clsx"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { useRouter, usePathname } from "@/i18n/navigation"
import { LuLanguages } from "react-icons/lu"

export type LangToggleProps = {
  className?: string
}

export default function LangToggle({ className }: LangToggleProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("components.header.toggle")

  const handleLocaleChange = (nextLocale: string) => {
    if (nextLocale === locale) return
    router.replace(pathname, { locale: nextLocale, scroll: false })
  }

  const locales = [
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

  return (
    <MiracleTooltip
      defaultPosition="bottom-center"
      hoverContent
      trigger={
        <button
          className={clsx(
            "cursor-pointer rounded-md p-2 transition-colors duration-300 ease-in-out group-hover/tooltip:bg-neutral-200 dark:group-hover/tooltip:bg-neutral-800",
            className
          )}
          aria-label={t("ariaLabel.language")}
        >
          <LuLanguages size={20} />
        </button>
      }
    >
      <div className="flex flex-col gap-2">
        {locales.map((localeData) => (
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
