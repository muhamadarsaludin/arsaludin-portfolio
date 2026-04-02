"use client"

import { useState } from "react"
import CommentButton from "./CommentButton"
import CommentsCount from "./CommentsCount"
import CommentDrawer from "./CommentDrawer"

type CommentGroupProps = {
  targetId: number
  targetType: string
  commentsCount: number
}

export default function CommentGroup({ targetId, targetType, commentsCount }: CommentGroupProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-1">
        <CommentButton onClick={() => setIsDrawerOpen(true)} />
        <CommentsCount commentsCount={commentsCount} />
      </div>
      <CommentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        targetId={targetId}
        targetType={targetType}
      />
    </>
  )
}
