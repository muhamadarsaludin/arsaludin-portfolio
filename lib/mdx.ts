import { compile, run } from "@mdx-js/mdx"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import type { ComponentType } from "react"
import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code"
import { mdxComponents } from "@/mdx-components"

export async function compileMDX(source: string) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrettyCode],
  })

  const { default: MDXContent } = await run(compiled, {
    Fragment,
    jsx,
    jsxs,
  })

  return function MDXWrapper(props: any) {
    return MDXContent({ ...props, components: { ...mdxComponents, ...props.components } })
  } as ComponentType<any>
}