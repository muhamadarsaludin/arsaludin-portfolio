"use client"

import { useState } from 'react'
import CommentButton from './CommentButton'
import CommentsCount from './CommentsCount'
import MiracleDrawer from '@/components/miracle/Drawer'
import CommentList from './CommentList'
import { useMediaQuery } from '@/hooks/useMediaQuery'

type CommentGroupProps = {
  targetId: number
  targetType: string
  commentsCount: number
}

export default function CommentGroup({ targetId, targetType, commentsCount }: CommentGroupProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { breakpoint } = useMediaQuery()
  const drawerPosition = ['default'].includes(breakpoint) ? 'bottom' : 'right'

  return (
    <>
      <div className="flex items-center gap-1">
        <CommentButton onClick={() => setIsDrawerOpen(true)} />
        <CommentsCount commentsCount={commentsCount} />
      </div>
      
      <MiracleDrawer 
        position={drawerPosition}
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        title={`Comments (${commentsCount})`}
      >
        {isDrawerOpen && (
          <CommentList targetId={targetId} targetType={targetType} />
        )}
      </MiracleDrawer>
    </>
  )
}