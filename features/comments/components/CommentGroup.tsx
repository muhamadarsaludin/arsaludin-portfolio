"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import CommentButton from "./CommentButton"
import CommentDrawer from "./CommentDrawer"
import type { CommentTargetType } from "../types/comments.types"
import type { TooltipDefaultPosition } from "@/components/miracle/Tooltip"

type CommentGroupProps = {
  targetId: string
  targetIds: string[]
  targetType: CommentTargetType
  commentCount: number
  title?: ReactNode
  tooltipPosition?: TooltipDefaultPosition
}

export default function CommentGroup({
  targetId,
  targetIds,
  targetType,
  commentCount,
  title,
  tooltipPosition,
}: CommentGroupProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-1">
        <CommentButton
          tooltipPosition={tooltipPosition}
          commentCount={commentCount}
          onClick={() => setIsDrawerOpen(true)}
        />
      </div>

      <CommentDrawer
        isOpen={isDrawerOpen}
        targetId={targetId}
        targetIds={targetIds}
        targetType={targetType}
        title={title}
        commentCount={commentCount}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}
