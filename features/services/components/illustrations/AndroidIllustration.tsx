"use client"

import { motion } from "framer-motion"
import MobileIllustration from "./MobileIllustration"
import { cn } from "@/utils/class-name"

export default function AndroidIllustration() {
  const colors = ["bg-red", "bg-blue", "bg-green", "bg-yellow"]

  return (
    <MobileIllustration>
      <div className="text-primary relative h-full w-full overflow-hidden">
        {/* Top Navbar */}
        <div className="border-primary bg-secondary absolute top-0 right-0 left-0 z-10 flex w-full items-center justify-between border-b p-1">
          <div className="bg-neutral-high h-2 w-2 rounded-xs" />
          <div className="flex flex-col gap-px">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`dot-${i}`} className="bg-neutral-high h-px w-1.5 rounded-full" />
            ))}
          </div>
        </div>

        <motion.div
          className="mt-6 flex flex-col gap-1.5 px-2"
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Banner */}
          <div className="bg-secondary relative h-10 w-full shrink-0 overflow-hidden rounded">
            <div className="bg-neutral-high absolute -bottom-5 left-2 h-10 w-10 rotate-45 rounded-sm" />
            <div className="bg-neutral-med absolute -bottom-4 left-8 h-8 w-8 rotate-45 rounded-sm" />
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`gr-${i}`} className="bg-secondary relative h-6 overflow-hidden rounded">
                <div
                  className={cn(
                    "absolute right-0 bottom-0 left-0 h-1",
                    colors[(i + 1) % colors.length]
                  )}
                />
              </div>
            ))}
          </div>

          {/* Chart & List Section */}
          <div className="flex h-fit flex-col gap-1.5">
            <div className="bg-secondary flex h-12 w-full items-end gap-0.5 rounded p-1">
              {[4, 7, 3, 6, 5].map((h, i) => (
                <motion.div
                  key={`bar-${i}`}
                  className={cn("w-full rounded-sm", colors[i % colors.length])}
                  initial={{ height: 0 }}
                  animate={{ height: `${h * 4}px` }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </div>

            <div className="flex flex-1 flex-col gap-1">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={`li-${i}`}
                  className="bg-secondary flex items-center gap-2 rounded px-1 py-1"
                >
                  <div className="bg-neutral-high h-3 w-3 rounded" />
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="bg-neutral-high h-0.5 w-3/4 rounded" />
                    <div className="bg-neutral-med h-0.5 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </MobileIllustration>
  )
}
