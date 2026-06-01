import { cn } from "@/utils/class-name"

export type ArticleProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  className?: string
}

export default function Article({ children, className, ...props }: ArticleProps) {
  return (
    <article className={cn("w-full", className)} {...props}>
      {children}
    </article>
  )
}
