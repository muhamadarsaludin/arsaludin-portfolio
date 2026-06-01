"use client"

import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { cn } from "@/utils/class-name"

interface MarkdownProps {
  content: string
  className?: string
}

export const MiracleMarkdown = ({ content, className }: MarkdownProps) => {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <ReactMarkdown
        components={{
          // Paragraph
          p: ({ ...props }) => <p className="text-secondary text-sm leading-relaxed" {...props} />,

          // Strong
          strong: ({ children, ...props }) => {
            if (!children) return null
            const stringContent = children.toString()

            if (stringContent.startsWith("!")) {
              return (
                <strong className="text-primary font-semibold" {...props}>
                  {stringContent.slice(1)}
                </strong>
              )
            }

            return (
              <strong className="text-secondary font-semibold" {...props}>
                {children}
              </strong>
            )
          },

          code: ({ ...props }) => {
            return (
              <code
                className={cn(
                  "rounded bg-blue-100 px-1.5 py-0.5 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                  "font-mono text-[0.85rem]"
                )}
                {...props}
              />
            )
          },

          a: ({ href, ...props }) => {
            const isExternal = href?.startsWith("http")
            const linkStyles =
              "text-blue-600 dark:text-blue-400 font-semibold no-underline hover:underline"

            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkStyles}
                  {...props}
                />
              )
            }
            return <Link href={href || "#"} className={linkStyles} {...props} />
          },

          ul: ({ ...props }) => <ul className="flex list-none flex-col gap-2" {...props} />,
          li: ({ ...props }) => (
            <li className="text-sm text-neutral-600 dark:text-neutral-400" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
