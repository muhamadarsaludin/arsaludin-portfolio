import clsx from "clsx"

export type SectionProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  className?: string
}

export default function Section({children, className, ...props}: SectionProps) {
  return (
    <section className={clsx("mx-6", className)}
      {...props}>
      <div className="max-w-(--m-page-width) mx-auto">
        {children}
      </div>
    </section>
  )
}
