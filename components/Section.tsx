import clsx from "clsx"

export type SectionProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  className?: string
}

export default function Section({ children, className, ...props }: SectionProps) {
  return (
    <section {...props}>
      <div className={clsx("w-full", className)}>{children}</div>
    </section>
  )
}
