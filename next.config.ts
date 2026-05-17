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
  // async headers() {
  //   return [
  //     {
  //       source: "/:path*\\.(png|jpg|jpeg|svg|gif|webp|ico|woff2)",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //       ],
  //     },
  //   ];
  // },
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