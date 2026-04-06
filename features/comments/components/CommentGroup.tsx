"use client"

import { useState } from "react"
import CommentButton from "./CommentButton"
import CommentDrawer from "./CommentDrawer"
import type { CommentTargetType } from "../types/comments"

type CommentGroupProps = {
  targetId: string
  targetType: CommentTargetType
  commentCount: number
}

export default function CommentGroup({ targetId, targetType, commentCount }: CommentGroupProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-1">
        <CommentButton commentCount={commentCount} onClick={() => setIsDrawerOpen(true)} />
      </div>

      <CommentDrawer
        isOpen={isDrawerOpen}
        targetId={targetId}
        targetType={targetType}
        commentCount={commentCount}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}
