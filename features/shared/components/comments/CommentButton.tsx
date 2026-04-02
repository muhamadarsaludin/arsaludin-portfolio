import MiracleTooltip from "@/components/miracle/Tooltip"
import { signInWithGoogle } from "@/features/auth/services/authService"
import { useAuth } from "@/providers/AuthProvider"
import { useTranslations } from "next-intl"
import React from "react"
import { LuMessageCircleMore } from "react-icons/lu"

type CommentButtonProps = {
  onClick?: () => void
}

export default function CommentButton({ onClick }: CommentButtonProps) {
  const t = useTranslations("components.comment")
  const { isSignedIn } = useAuth()

  const handleOnClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isSignedIn) return await signInWithGoogle()
    if (onClick) onClick()
  }

  return (
    <MiracleTooltip
      trigger={
        <button className="group/reaction-picker cursor-pointer p-1" onClick={handleOnClick}>
          <LuMessageCircleMore
            size={20}
            className="text-secondary transition-transform duration-300 group-hover/reaction-picker:scale-110"
          />
        </button>
      }
      noPadding
    >
      <span className="flex p-2 text-xs font-medium text-nowrap">
        {isSignedIn ? t("tooltip.default") : t("tooltip.auth")}
      </span>
    </MiracleTooltip>
  )
}
