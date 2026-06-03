"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import CommentButton from "./CommentButton"
import CommentDrawer from "./CommentDrawer"
import type { CommentTargetType } from "../types/comments.types"
import { useCommentCount } from "../hooks/useCommentCount"
import type { TooltipDefaultPosition } from "@/components/miracle/Tooltip"

type CommentGroupProps = {
  targetId: string
  targetType: CommentTargetType
  initialCount?: number
  title?: ReactNode
  tooltipPosition?: TooltipDefaultPosition
}

export default function CommentGroup({
  targetId,
  targetType,
  initialCount,
  title,
  tooltipPosition,
}: CommentGroupProps) {
  const { data: commentCount = 0 } = useCommentCount({ targetId, targetType, initialCount })

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
        targetType={targetType}
        title={title}
        commentCount={commentCount}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}
