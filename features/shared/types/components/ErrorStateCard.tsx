import MiracleButton from "@/components/miracle/Button"
import Section from "@/components/Section"
import { useTranslations } from "next-intl"

type ErrorStateCardProps = {
  errorMessage?: string
  onRetry?: () => void
}

export default function ErrorStateCard({ errorMessage, onRetry }: ErrorStateCardProps) {
  const t = useTranslations("components.errorStateCard")
  return (
    <Section className="flex h-30 flex-col items-center justify-center gap-4 rounded-2xl bg-red-100 p-4 md:p-6 dark:bg-red-950">
      <p className="text-red text-center text-sm font-medium">
        {errorMessage ?? t("errorMessage")}
      </p>
      {onRetry && (
        <MiracleButton onClick={onRetry}>
          {t("cta")}
        </MiracleButton>
      )}
    </Section>
  )
}
