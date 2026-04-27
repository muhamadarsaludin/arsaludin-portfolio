import clsx from "clsx"

export type ArticleProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  className?: string
}

export default function Article({ children, className, ...props }: ArticleProps) {
  return (
    <article className={clsx("w-full", className)} {...props}>{children}</article>
  )
}
