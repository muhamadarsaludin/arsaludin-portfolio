import { cn } from "@/utils/class-name"

export type SectionProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  className?: string
}

export default function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={cn("w-full", className)} {...props}>{children}</section>
  )
}
