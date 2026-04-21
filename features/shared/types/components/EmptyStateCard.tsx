import { useTranslations } from "next-intl"
import React from "react"

export default function EmptyStateCard({ emptyMessage }: { emptyMessage?: string }) {
  const t = useTranslations("components.emptyStateCard")
  return (
    <div className="border-primary flex h-30 flex-col items-center justify-center rounded-2xl border border-dashed p-4 md:p-6">
      <p className="text-secondary text-center text-sm font-medium">
        {emptyMessage ?? t("emptyMessage")}
      </p>
    </div>
  )
}
