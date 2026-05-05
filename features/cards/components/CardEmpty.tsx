import { useTranslations } from "next-intl";
import { LuSquarePlus } from "react-icons/lu";

export default function CardEmpty() {
  const t = useTranslations("components.card.empty")
  return (
    <div className="flex flex-col items-center justify-center h-full py-10 px-4 border border-dashed border-primary rounded-xl">
      
      <p className="text-primary font-medium">{t("title")}</p>
      <p className="text-secondary text-xs text-center mt-1">
        {t("description")}
      </p>
    </div>
  )
}
