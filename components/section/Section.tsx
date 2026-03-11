import React from 'react'

export type SectionProps = {
  className?: string
  id: string
  depth?: number
  children?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  customHeader?: React.ReactNode
}

export default function Section({
  className,
  id,
  depth,
  children,
  title,
  description,
  customHeader
}: SectionProps) {
  return (
    <section>

    </section>
  )
}
