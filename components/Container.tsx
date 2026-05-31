import { cn } from "@/utils/class-name"

export type ContainerProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn("mx-auto max-w-(--m-page-width) px-4 md:px-6", className)} {...props}>
      {children}
    </div>
  )
}
