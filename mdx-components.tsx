import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

import Link from "next/link"
import Image from "next/image"

import { cn } from "@/utils/class-name"

import Heading from "./components/Heading"
import MiracleBadge from "./components/miracle/Badge"
import MiracleImagePreview from "./components/miracle/ImagePreview"

import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code"

// Re-use alias tipe data bersih yang sudah lu buat
type HeadingProps = ComponentPropsWithoutRef<"h1">
type ParagraphProps = ComponentPropsWithoutRef<"p">
type SmallProps = ComponentPropsWithoutRef<"small">
type StrongElementProps = ComponentPropsWithoutRef<"strong">
type UlProps = ComponentPropsWithoutRef<"ul">
type LiProps = ComponentPropsWithoutRef<"li">
type OlProps = ComponentPropsWithoutRef<"ol">
type TableProps = ComponentPropsWithoutRef<"table">
type ThProps = ComponentPropsWithoutRef<"th">
type TdProps = ComponentPropsWithoutRef<"td">
type PreProps = ComponentPropsWithoutRef<"pre">
type CodeProps = ComponentPropsWithoutRef<"code">
type AnchorProps = ComponentPropsWithoutRef<"a">
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">

type StrongProps = StrongElementProps & {
  children?: ReactNode
}

// ⚡ LOCK TYPE CONTRACT: Kunci dengan tipe resmi MDXComponents bawaan library
export const mdxComponents: MDXComponents = {
  // ⚡ CUSTOM COMPONENTS FIXED: Pasang fungsi pembungkus murni tanpa casting 'as any'
  MiracleBadge,
  Image,
  MiracleImagePreview,
  Heading,
  // 1. Headings
  h1: (props: HeadingProps) => (
    <Heading level={1} className="text-primary font-semibold" {...props} />
  ),

  h2: (props: HeadingProps) => (
    <Heading level={2} className="text-primary font-semibold" {...props} />
  ),

  h3: (props: HeadingProps) => (
    <Heading level={3} className="text-primary font-semibold" {...props} />
  ),

  h4: (props: HeadingProps) => (
    <Heading level={4} className="text-primary font-semibold" {...props} />
  ),

  h5: (props: HeadingProps) => (
    <Heading level={5} className="text-primary font-semibold" {...props} />
  ),

  // Text
  p: (props: ParagraphProps) => <p className="text-secondary mt-4" {...props} />,

  small: (props: SmallProps) => <small className="text-secondary mt-4 text-sm" {...props} />,

  strong: ({ children, ...props }: StrongProps) => {
    const text = typeof children === "string" ? children : ""

    if (text.startsWith("!")) {
      return (
        <strong className="text-primary font-semibold" {...props}>
          {text.slice(1)}
        </strong>
      )
    }

    return (
      <strong className="text-secondary font-semibold" {...props}>
        {children}
      </strong>
    )
  },

  // Lists
  ul: (props: UlProps) => <ul className="mt-4 flex list-none flex-col gap-1.5" {...props} />,

  li: (props: LiProps) => (
    <li
      className={cn(
        "text-secondary relative pl-5.5",
        "before:absolute before:left-0 before:content-['']",
        "before:mt-2.25 before:h-1.5 before:w-1.5 before:rounded-full",
        "before:bg-neutral-600 dark:before:bg-neutral-400"
      )}
      {...props}
    />
  ),

  ol: (props: OlProps) => (
    <ol
      className="text-secondary mt-4 flex list-inside list-decimal flex-col gap-3 text-base"
      {...props}
    />
  ),

  // Tables
  table: (props: TableProps) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),

  th: (props: ThProps) => (
    <th
      className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-left font-semibold dark:border-neutral-800 dark:bg-neutral-900"
      {...props}
    />
  ),

  td: (props: TdProps) => (
    <td className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800" {...props} />
  ),

  // Code
  pre: (props: PreProps) => (
    <pre
      className="mt-6 mb-4 overflow-x-auto rounded-xl border border-neutral-800 bg-[#1a1b26] p-4 font-mono text-sm leading-relaxed"
      {...props}
    />
  ),

  code: (props: CodeProps) => (
    <code
      className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      {...props}
    />
  ),

  // Links
  a: ({ href, ...props }: AnchorProps) => {
    const isExternal = href?.startsWith("http")
    const styles =
      "text-blue-600 dark:text-blue-400 font-semibold no-underline hover:underline transition-all"

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={styles} {...props} />
      )
    }

    return <Link href={href || "#"} className={styles} {...props} />
  },

  // Quote
  MiracleQuote: (props: BlockquoteProps) => (
    <blockquote
      className={cn(
        "border-blue text-primary mt-6 border-l-2 pl-4 font-semibold italic",
        "[&_p]:text-primary [&_p]:font-semibold [&_p]:italic"
      )}
      {...props}
    />
  ),
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  }
}

export const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    [
      rehypePrettyCode,
      {
        theme: "tokyo-night",
        keepBackground: true,
      },
    ],
  ],
}
