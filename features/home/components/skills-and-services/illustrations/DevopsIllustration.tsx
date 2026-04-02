"use client"

import { motion } from "framer-motion"
import BrowserIllustration from "./BrowserIllustration"

export default function DevOpsIllustration() {
  return (
    <BrowserIllustration>
      <div className="relative flex h-full w-full items-center justify-center text-primary">
        {/* Circular Path / CI/CD Pipeline */}
        <div className="border-neutral-med absolute h-24 w-24 rounded-full border-[1.5px] border-dashed" />

        {/* Orbiting Automation Dot */}
        <motion.div
          className="absolute flex h-24 w-24 items-start justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <div className="bg-blue -mt-[5px] h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        </motion.div>

        {/* Nodes Container */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {/* Top: Code */}
          <div className="border-primary bg-primary absolute flex h-7 w-7 -translate-y-[48px] items-center justify-center rounded border shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red h-3.5 w-3.5"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>

          {/* Right: Build/Test (Gear) */}
          <div className="border-primary bg-primary absolute flex h-7 w-7 translate-x-[48px] items-center justify-center rounded border shadow-sm">
            <motion.div
              className="border-yellow h-3.5 w-3.5 rounded-full border-2 border-dashed"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Bottom: Deploy (Servers) */}
          <div className="border-primary bg-primary absolute flex h-7 w-7 translate-y-[48px] flex-col items-center justify-center gap-[3px] rounded border shadow-sm">
            <div className="border-blue h-1.5 w-4 rounded-[1px] border" />
            <div className="border-blue h-1.5 w-4 rounded-[1px] border" />
          </div>

          {/* Left: Monitor (Chart) */}
          <div className="border-primary bg-primary absolute flex h-7 w-7 -translate-x-[48px] items-end justify-center gap-[2px] rounded border p-[5px] shadow-sm">
            {[0, 0.5, 1].map((delay, i) => (
              <motion.div
                key={`mon-${i}`}
                className="bg-green w-[3px] rounded-t-sm"
                animate={{ height: i === 1 ? ["80%", "30%", "80%"] : ["40%", "90%", "40%"] }}
                transition={{ duration: 2, delay, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>

        {/* Center: Cloud/Hub Node */}
        <motion.div
          className="border-primary bg-secondary relative z-20 flex h-10 w-10 items-center justify-center rounded-xl border shadow-md"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary h-5 w-5"
          >
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
          </svg>
        </motion.div>
      </div>
    </BrowserIllustration>
  )
}