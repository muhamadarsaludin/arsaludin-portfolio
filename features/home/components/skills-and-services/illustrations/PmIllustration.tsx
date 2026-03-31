"use client"

import { motion } from "framer-motion"
import BrowserIllustration from "./BrowserIllustration"

export default function PmIllustration() {
  return (
    <div className="flex flex-col gap-2">
      <BrowserIllustration>
        <div className="relative flex h-full w-full">
          {/* Kanban Board */}
          <div className="flex flex-1 gap-1.5 p-1.5">
            {/* Column 1: To Do */}
            <div className="bg-surface-secondary flex flex-1 flex-col gap-1.5 rounded">
              <div className="mb-0.5 h-1 w-6 rounded-full bg-neutral-400 dark:bg-neutral-500" />
              <div className="border-primary h-5 w-full rounded-sm border bg-white shadow-sm dark:bg-neutral-800" />
              <div className="border-primary h-5 w-full rounded-sm border bg-white shadow-sm dark:bg-neutral-800" />
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-surface-secondary flex flex-1 flex-col gap-1.5 rounded">
              <div className="mb-0.5 h-1 w-6 rounded-full bg-blue-400 dark:bg-blue-500" />
              <div className="border-primary h-5 w-full rounded-sm border bg-white shadow-sm dark:bg-neutral-800" />
            </div>

            {/* Column 3: Done */}
            <div className="bg-surface-secondary flex flex-1 flex-col gap-1.5 rounded">
              <div className="mb-0.5 h-1 w-6 rounded-full bg-emerald-400 dark:bg-emerald-500" />
              <div className="border-primary h-5 w-full rounded-sm border bg-white shadow-sm dark:bg-neutral-800" />
              <div className="border-primary h-5 w-full rounded-sm border bg-white shadow-sm dark:bg-neutral-800" />
            </div>
          </div>
          <motion.div
            className="absolute h-5 w-15 rounded-sm border border-blue-400 bg-white shadow-md dark:border-blue-500 dark:bg-neutral-800"
            animate={{
              left: ["8px", "8px", "79px", "79px", "150px", "150px", "8px"],
              top: ["68px", "68px", "42px", "42px", "68px", "68px", "68px"],
              scale: [1, 1.05, 1, 1.05, 1, 1.05, 1],
              rotate: [0, -3, 0, 3, 0, -2, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="m-1 h-1 w-6 rounded-full bg-blue-400 dark:bg-blue-500" />
            <div className="mx-1 h-0.5 w-8 rounded-full bg-neutral-300 dark:bg-neutral-600" />
          </motion.div>
        </div>
      </BrowserIllustration>
    </div>
  )
}
