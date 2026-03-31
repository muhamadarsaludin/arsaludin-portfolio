import MiracleButton from "@/components/miracle/Button"
import { signInWithGoogle } from "@/features/auth/services/authService"
import { useTranslations } from "next-intl"

export default function SignInButton() {
  const t = useTranslations("components.header")
  const handleSignIn = async () => {
    await signInWithGoogle()
  }
  return (
    <MiracleButton variant="secondary" onClick={handleSignIn}>
      {t("cta.signIn")}
    </MiracleButton>
  )
}
