import { compile, run } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import type { ComponentType } from "react"

export async function compileMDX(source: string) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
  })

  const { default: MDXContent } = await run(compiled, {
    ...runtime,
  })

  return MDXContent as ComponentType<any>
}