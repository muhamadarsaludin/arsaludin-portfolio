import clsx from "clsx"

export type ArticleProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  className?: string
}

export default function Article({children, className, ...props}: ArticleProps) {
  return (
    <article className={clsx("mx-6", className)}
      {...props}>
      <div className="max-w-(--m-page-width) mx-auto">
        {children}
      </div>
    </article>
  )
}
