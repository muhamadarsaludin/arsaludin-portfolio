import { useTranslations } from "next-intl"

export default function ErrorStateCard({ errorMessage }: { errorMessage?: string }) {
  const t = useTranslations("components.errorStateCard")
  return (
    <div className="flex h-30 flex-col items-center justify-center rounded-2xl bg-red-100 p-4 dark:bg-red-950">
      <p className="text-red text-center text-sm font-medium">
        {errorMessage ?? t("errorMessage")}
      </p>
    </div>
  )
}
