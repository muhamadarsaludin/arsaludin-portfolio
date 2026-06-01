import { useTranslations } from "next-intl"

export default function CardEmpty() {
  const t = useTranslations("components.card.empty")
  return (
    <div className="border-primary flex h-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-10">
      <p className="text-primary font-medium">{t("title")}</p>
      <p className="text-secondary mt-1 text-center text-xs">{t("description")}</p>
    </div>
  )
}
