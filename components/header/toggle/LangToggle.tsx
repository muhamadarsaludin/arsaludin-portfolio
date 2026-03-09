import MiracleRadio from '@/components/miracle/Radio'
import MiracleTooltip from '@/components/miracle/Tooltip'
import clsx from 'clsx'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { useRouter, usePathname } from "@/i18n/navigation";
import { LuLanguages } from 'react-icons/lu'

export type LangToggleProps = {
  className?: string
}

export default function LangToggle({className}: LangToggleProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (nextLocale: string) => {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  };

  const locales = [
    {
      value: "en",
      label: "English",
      iconStart: "/flag/en.svg"
    },
    {
      value: "id",
      label: "Indonesia",
      iconStart: "/flag/id.svg"
    },
  ]
  
  return (
    <MiracleTooltip trigger={
      <button
        className={clsx(
          "p-2 rounded-md cursor-pointer group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800 transition-colors duration-300 ease",
          className
        )}
        aria-label="Lang Toggle">
        <LuLanguages size={20}/>
      </button>
    }>
      <div className="flex flex-col gap-2">
        {locales.map((localeData) => (
          <MiracleRadio
            key={localeData.value}
            className="rounded-sm"
            name="language"
            value={localeData.value}
            checked={localeData.value === locale}
            iconStart={
              <Image
                className="shrink-0"
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
