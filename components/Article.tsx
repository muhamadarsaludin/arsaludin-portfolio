import clsx from "clsx"

export type ArticleProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  className?: string
}

export default function Article({ children, className, ...props }: ArticleProps) {
  return (
    <article {...props}>
      <div className={clsx("mx-auto max-w-(--m-page-width) px-6", className)}>{children}</div>
    </article>
  )
}
