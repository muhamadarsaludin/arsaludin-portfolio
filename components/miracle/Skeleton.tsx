import { cn } from "@/utils/class-name"

type MiracleSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "low" | "med" | "high"
}

export function MiracleSkeleton({ className, variant = "low", ...props }: MiracleSkeletonProps) {
  const variantClasses = {
    low: "bg-neutral-low",
    med: "bg-neutral-med",
    high: "bg-neutral-high",
  }

  return (
    <div
      className={cn("animate-pulse rounded-md", variantClasses[variant], className)}
      {...props}
    />
  )
}