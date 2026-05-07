import MiracleButton from "@/components/miracle/Button"
import { signInWithGoogle } from "@/features/auth/services/auth"
import { useTranslations } from "next-intl"
import { SiGoogle } from "react-icons/si"

export default function SignInButton() {
  const t = useTranslations("components.header")
  const handleSignIn = async () => {
    await signInWithGoogle()
    return
  }
  return (
    <MiracleButton 
      variant="secondary"
      onClick={handleSignIn}
      startIcon={<SiGoogle />}>
      {t("cta.signIn")}
    </MiracleButton>
  )
}
