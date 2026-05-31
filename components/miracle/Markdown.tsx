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
          p: ({ node, ...props }) => (
            <p className="text-secondary text-sm leading-relaxed" {...props} />
          ),

          // Strong
          strong: ({ node, children, ...props }) => {
            if (!children) return null
            const content = children.toString()

            if (content.startsWith("!")) {
              return (
                <strong className="text-primary font-semibold" {...props}>
                  {content.slice(1)}
                </strong>
              )
            }

            return (
              <strong className="text-secondary font-semibold" {...props}>
                {children}
              </strong>
            )
          },

          code: ({ node, ...props }) => {
            const isInline =
              !node?.position?.start.line ||
              (node.position.start.line === node.position.end.line && !content.includes("\n"))
            return (
              <code
                className={cn(
                  "rounded px-1.5 py-0.5 font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                  "font-mono text-[0.85rem]"
                )}
                {...props}
              />
            )
          },

          // Link
          a: ({ node, href, ...props }) => {
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

          // Lists
          ul: ({ node, ...props }) => <ul className="flex list-none flex-col gap-2" {...props} />,
          li: ({ node, ...props }) => (
            <li className="text-sm text-neutral-600 dark:text-neutral-400" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
