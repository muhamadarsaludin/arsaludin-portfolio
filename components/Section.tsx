import clsx from "clsx"

export type SectionProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  className?: string
}

export default function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={clsx("w-full", className)} {...props}>{children}</section>
  )
}
