"use client"

import { motion } from "framer-motion"
import BrowserIllustration from "./BrowserIllustration"

export default function UxIllustration() {
  return (
    <BrowserIllustration>
      <div className="text-primary relative flex h-full w-full">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 grid grid-cols-4 gap-1 p-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`grid-${i}`} className="border-neutral-low border border-dashed" />
          ))}
        </div>

        {/* Main Workspace */}
        <div className="relative z-10 flex flex-1 overflow-hidden">
          {/* Left Panel: Layers */}
          <div className="border-primary bg-secondary flex w-15 border-r">
            <div className="border-primary flex h-full w-fit flex-col items-center gap-1 border-r p-1">
              <div className="bg-neutral-high h-2 w-2 rounded-xs" />
              <hr className="border-primary w-2 border-[0.5px]" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`layer-dot-${i}`} className="bg-neutral-med h-1.5 w-1.5 rounded-full" />
              ))}
            </div>
            <div className="flex flex-1 flex-col gap-1 p-1">
              <div className="border-primary flex flex-col gap-0.5 border-b pb-1">
                <div className="bg-neutral-high h-1 w-full rounded" />
                <div className="bg-neutral-med h-0.5 w-3/4 rounded" />
              </div>
              <div className="flex flex-col gap-1 pb-1">
                <div className="bg-neutral-high h-0.5 w-3/4 rounded" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={`layer-line-${i}`} className="bg-neutral-med h-0.5 w-full rounded" />
                ))}
              </div>
            </div>
          </div>

          {/* Center: Canvas / Artboard */}
          <div className="flex flex-1 items-center justify-center">
            <motion.div
              className="border-blue bg-primary relative flex h-16 flex-col gap-1 border p-1 shadow-sm"
              animate={{ width: ["64px", "64px", "64px", "84px", "64px", "64px"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Selection Handles */}
              <div className="border-blue bg-primary absolute -top-1 -left-1 h-1.5 w-1.5 border" />
              <div className="border-blue bg-primary absolute -top-1 -right-1 h-1.5 w-1.5 border" />
              <div className="border-blue bg-primary absolute -bottom-1 -left-1 h-1.5 w-1.5 border" />
              <div className="border-blue bg-primary absolute -right-1 -bottom-1 h-1.5 w-1.5 border" />

              {/* Internal Artboard Content */}
              <div className="bg-neutral-med h-2 w-full rounded-sm" />
              <motion.div
                className="h-6 w-full rounded-sm"
                animate={{
                  backgroundColor: [
                    "#171717",
                    "#3b82f6",
                    "#171717",
                    "#171717",
                    "#171717",
                    "#171717",
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {/* Right Panel: Properties */}
          <div className="border-primary bg-secondary flex w-16 shrink-0 flex-col gap-1 border-l p-1">
            <div className="border-primary flex justify-between gap-1 border-b pb-1">
              <div className="bg-neutral-high h-2 w-2 shrink-0 rounded" />
              <div className="bg-blue h-2 w-4 rounded-xs" />
            </div>

            <div className="bg-neutral-high h-1 w-3/4 rounded" />
            <div className="border-neutral-low bg-primary flex items-center gap-1 rounded border p-0.5 shadow-sm">
              <div className="border-primary h-2.5 w-2.5 shrink-0 rounded-xs border bg-[#171717]" />
              <span className="text-secondary font-mono text-[6px] tracking-tighter">#171717</span>
            </div>
            <motion.div
              className="border-neutral-low bg-primary flex items-center gap-1 rounded border p-0.5 shadow-sm"
              animate={{
                borderColor: ["#d4d4d8", "#3b82f6", "#d4d4d8", "#d4d4d8", "#d4d4d8", "#d4d4d8"],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="bg-blue border-primary h-2.5 w-2.5 shrink-0 rounded-xs border" />
              <span className="text-primary font-mono text-[6px] tracking-tighter">#3b82f6</span>
            </motion.div>
          </div>
        </div>

        {/* Cursor */}
        <motion.div
          className="absolute z-20 drop-shadow-md"
          animate={{
            left: ["80%", "80%", "80%", "64%", "64%", "73%", "64%", "80%"],
            top: ["40%", "40%", "40%", "70%", "70%", "70%", "70%", "40%"],
            scale: [1, 0.8, 1, 1, 0.9, 0.9, 1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-secondary">
            <path
              d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </BrowserIllustration>
  )
}
