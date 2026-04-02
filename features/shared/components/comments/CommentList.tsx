"use client"

import React, { useEffect, useState } from "react"
import MiracleLoader from "@/components/miracle/Loader"
import { getComments } from "../../services/comments"

type CommentListProps = {
  targetId: number
  targetType: string
}

// Sesuaikan dengan kolom/kolom relasi yang ada di tabel Supabase kamu
export type Comment = {
  id: number
  comment: string
  created_at: string
  user_id: string
  profiles?: {
    full_name?: string
    avatar_url?: string
    email?: string
    role?: string
  }
}

export default function CommentList({ targetId, targetType }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true)
      try {
        const data = await getComments(targetId, targetType)
        setComments(data || [])
      } catch (error) {
        console.error("Failed to load comments", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [targetId, targetType])

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <MiracleLoader size={30} />
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-secondary p-8 text-center text-sm">
        No comments yet. Be the first to comment!
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          {comment.profiles?.avatar_url ? (
            <img
              src={comment.profiles.avatar_url}
              alt={comment.profiles.full_name || "Avatar"}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {comment.profiles?.full_name || `User ${comment.user_id.slice(0, 4)}`}
            </span>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {comment.comment}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
