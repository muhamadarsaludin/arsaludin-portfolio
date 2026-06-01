declare module "*.mdx" {
  import type { ReactNode } from "react"
  export default function MDXContent(props: Record<string, unknown>): ReactNode
}