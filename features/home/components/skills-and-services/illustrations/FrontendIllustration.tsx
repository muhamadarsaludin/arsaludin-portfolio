"use client"

import { motion } from "framer-motion"
import BrowserIllustration from "./BrowserIllustration"
import clsx from "clsx"

export default function FrontEndIllustration() {
  const colors = ["bg-red", "bg-blue", "bg-green", "bg-yellow"]

  return (
    <BrowserIllustration>
      <div className="relative flex h-full items-start text-primary">
        
        {/* Sidebar */}
        <div className="border-primary bg-secondary relative z-10 flex h-full w-fit flex-col justify-between gap-1 border-r p-1">
          <div className="flex flex-col gap-2">
            <div className="border-primary relative h-6 w-6 overflow-hidden rounded-md border-[0.5px]">
              <div className="bg-neutral-high absolute -bottom-3 -left-1.5 h-6 w-6 rotate-45 rounded-xs" />
              <div className="bg-neutral-med absolute -bottom-2 left-2.5 h-4 w-4 rotate-45 rounded-xs" />
            </div>
            {/* Loop Sidebar Lines (4) */}
            <div className="flex flex-col gap-1">
              <div className="bg-neutral-high h-0.5 w-3/4 shrink-0 rounded-sm" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`sb-${i}`} className="bg-neutral-med h-0.5 w-full shrink-0 rounded-sm" />
              ))}
            </div>
          </div>
          <div className="bg-neutral-high h-2 w-2 rounded-full mx-auto" />
        </div>

        {/* Main Content */}
        <div className="relative flex flex-1 flex-col gap-2 overflow-hidden">
          
          {/* Top Navbar */}
          <div className="border-primary bg-secondary absolute top-0 right-0 left-0 z-10 flex w-full items-center justify-between border-b p-1">
            <div className="bg-neutral-high h-2 w-2 rounded-xs" />
            <div className="flex gap-1">
              {/* Loop Navbar Dots (5) */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`nb-${i}`}
                  className={clsx(
                    "h-0.5 w-3 rounded-full",
                    i === 0 ? "bg-blue" : "bg-neutral-med"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Animated Content */}
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

            {/* Card Grid (3) */}
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`gr-${i}`} className="bg-secondary relative h-6 overflow-hidden rounded">
                  <div className={clsx("absolute inset-x-0 bottom-0 h-1", colors[(i + 1) % colors.length])} />
                </div>
              ))}
            </div>

            {/* Chart Section */}
            <div className="flex h-fit gap-1.5">
              <div className="bg-secondary flex min-h-full w-fit items-end gap-[2px] rounded p-1">
                {[4, 7, 3, 6, 5].map((h, i) => (
                  <motion.div
                    key={`ch-${i}`}
                    className={clsx("w-1 rounded-sm", colors[i % colors.length])}
                    initial={{ height: 0 }}
                    animate={{ height: `${h * 4}px` }}
                    transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
                  />
                ))}
              </div>
              
              <div className="flex flex-1 flex-col gap-1">
                {/* Loop Small List (2) */}
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={`li-sm-${i}`} className="bg-secondary flex items-center gap-2 rounded px-1 py-1">
                    <div className="bg-neutral-high h-3 w-3 rounded" />
                    <div className="flex flex-1 flex-col gap-0.5">
                      <div className="bg-neutral-high h-0.5 w-3/4 rounded" />
                      <div className="bg-neutral-med h-0.5 w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Card List (2) */}
            <div className="flex flex-1 flex-col gap-1">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`li-lg-${i}`} className="bg-secondary flex items-center gap-2 rounded px-1 py-1">
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="bg-neutral-high h-0.5 w-3/4 rounded" />
                    <div className="bg-neutral-med h-0.5 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Cursor */}
        <motion.div
          className="absolute z-20 pointer-events-none"
          animate={{
            left: ["80%", "64%", "80%"],
            top: ["40%", "55%", "40%"],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-secondary">
            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="currentColor" />
          </svg>
        </motion.div>
      </div>
    </BrowserIllustration>
  )
}