import clsx from "clsx"
import React from "react"

export function MiracleSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-neutral-low", className)}
      {...props}
    />
  )
}
