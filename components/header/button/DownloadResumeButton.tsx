import MiracleButton from "@/components/miracle/Button"
import { useTranslations } from "next-intl"
import { LuDownload } from "react-icons/lu"

export default function DownloadResumeButton() {
  const t = useTranslations("components.header")
  const handleDownloadResume = () => {
    window.open(
      "https://docs.google.com/document/d/1wSyxo_glIf4QNtu4wONAvS0khf7Nls6m9-u3a_zNE4/edit?usp=sharing",
      "_blank"
    )
  }
  return (
    <MiracleButton
      variant="primary"
      endIcon={<LuDownload size={16} />}
      onClick={handleDownloadResume}
    >
      {t("cta.resume")}
    </MiracleButton>
  )
}
