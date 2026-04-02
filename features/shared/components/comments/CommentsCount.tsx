type CommentsCountProps = {
  commentsCount: number
}

export default function CommentsCount({ commentsCount }: CommentsCountProps) {
  if (commentsCount <= 0) return
  return <span className="text-secondary text-sm font-medium">{commentsCount}</span>
}
