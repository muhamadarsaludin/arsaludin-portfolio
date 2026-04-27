import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import { clsx } from 'clsx'
import Heading from './components/Heading'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import MiracleBadge from './components/miracle/Badge'

export const mdxComponents = {
  MiracleBadge,
  // 1. Headings
  Heading,
  h1: (props: any) => <Heading level={1} className="font-semibold" {...props} />,
  h2: (props: any) => <Heading level={2} className="font-semibold" {...props} />,
  h3: (props: any) => <Heading level={3} className="font-semibold" {...props} />,
  h4: (props: any) => <Heading level={4} className="font-semibold" {...props} />,

  // 2. Text & Paragraphs
  p: (props: any) => (
    <p className="text-secondary mt-4" {...props} />
  ),
  small: (props: any) => (
    <p className="text-secondary text-sm mt-3" {...props} />
  ),
  strong: ({ children, ...props }: any) => {
    const text = children?.toString() || ""
    if (text.startsWith("!")) {
      return <strong className="text-primary font-semibold" {...props}>{text.slice(1)}</strong>
    }
    return <strong className="text-secondary font-semibold" {...props}>{children}</strong>
  },

  // 3. Lists
  ul: (props: any) => (
    <ul className="mt-4 flex flex-col gap-2 list-none" {...props} />
  ),
  li: (props: any) => (
    <li 
      className={clsx(
        "text-secondary relative pl-4",
        "before:content-['•'] before:absolute before:left-0 before:text-primary before:font-bold"
      )} 
      {...props} 
    />
  ),
  ol: (props: any) => (
    <ol className="mt-4 flex flex-col gap-3 list-decimal list-inside text-secondary text-base" {...props} />
  ),

  // 4. Tables (Remark-GFM)
  table: (props: any) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: any) => <th className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-3 font-semibold text-left" {...props} />,
  td: (props: any) => <td className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3" {...props} />,

  // 5. Code Handling
  pre: (props: any) => (
    <pre 
      className="mb-4 mt-6 overflow-x-auto rounded-xl p-4 font-mono text-sm leading-relaxed bg-[#1a1b26] border border-neutral-800" 
      {...props} 
    />
  ),
  code: (props: any) => (
    <code
      className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      {...props}
    />
  ),
  
  // 6. Links (Internal vs External)
  a: ({ href, ...props }: any) => {
    const isExternal = href?.startsWith("http")
    const styles = "text-blue-600 dark:text-blue-400 font-semibold no-underline hover:underline transition-all"
    
    if (isExternal) {
      return <a href={href} target="_blank" rel="noopener noreferrer" className={styles} {...props} />
    }
    return <Link href={href || "#"} className={styles} {...props} />
  },
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
        theme: 'tokyo-night',
        keepBackground: true,
      },
    ],
  ],
}