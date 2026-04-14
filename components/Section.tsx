import clsx from "clsx"

export type SectionProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  className?: string
}

export default function Section({ children, className, ...props }: SectionProps) {
  return (
    <section {...props}>
      <div className={clsx("mx-auto max-w-(--m-page-width) px-4 md:px-6", className)}>{children}</div>
    </section>
  )
}
