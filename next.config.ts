import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import nextMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

const withNextIntl = createNextIntlPlugin();
const withMDX = nextMDX({
  // options: {
  //   remarkPlugins: [remarkGfm],
  //   rehypePlugins: [rehypePrettyCode],
  // },
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["three", "emoji-picker-react", "react-countup"],
  experimental: {
    optimizePackageImports: ["react-icons", "three"],
  },
  images: {
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "**",
      },
    ],
  },
};

export default withNextIntl(withMDX(nextConfig));