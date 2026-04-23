import MiracleTooltip, { TooltipDefaultPosition } from "@/components/miracle/Tooltip"
import { useTranslations } from "next-intl"
import React from "react"
import { LuMessageCircleMore } from "react-icons/lu"

type CommentButtonProps = {
  tooltipPosition?: TooltipDefaultPosition
  commentCount?: number
  onClick: () => void
}

export default function CommentButton({ 
  tooltipPosition,
  commentCount = 0, 
  onClick 
}: CommentButtonProps) {
  const t = useTranslations("components.comment.tooltip")

  const handleOnClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <MiracleTooltip
      noPadding
      defaultPosition={tooltipPosition}
      trigger={
        <button
          onClick={handleOnClick}
          type="button"
          className="group/reaction-picker flex cursor-pointer items-center outline-none"
          aria-label={t("default")}
        >
          <div className="relative p-1.5">
            <LuMessageCircleMore
              size={20}
              className="text-secondary transition-all duration-300 ease-in-out group-hover/reaction-picker:scale-110"
            />
          </div>
          {commentCount > 0 && (
            <span className="text-secondary text-sm font-medium">{commentCount}</span>
          )}
        </button>
      }
    >
      <span className="flex p-2 text-xs font-medium text-nowrap">{t("default")}</span>
    </MiracleTooltip>
  )
}
