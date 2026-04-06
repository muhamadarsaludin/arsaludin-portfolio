import clsx from "clsx"
import React from "react"

export function MiracleSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("bg-neutral-low animate-pulse rounded-md", className)} {...props} />
}
