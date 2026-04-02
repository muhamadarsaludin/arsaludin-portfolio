import MiracleTooltip from '@/components/miracle/Tooltip'
import { signInWithGoogle } from '@/features/auth/services/authService'
import { useAuth } from '@/providers/AuthProvider'
import { useTranslations } from 'next-intl'
import React from 'react'
import { LuMessageCircleMore } from 'react-icons/lu'

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
        <button
          className="cursor-pointer p-1 group/reaction-picker"
          onClick={handleOnClick}
        >
          <LuMessageCircleMore
            size={20}
            className="text-secondary transition-transform group-hover/reaction-picker:scale-110 duration-300"
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
