"use client"

import { motion } from "framer-motion"
import BrowserIllustration from "./BrowserIllustration"

export default function PmIllustration() {
  return (
    <div className="flex flex-col gap-2">
      <BrowserIllustration>
        <div className="relative flex h-full w-full text-primary">
          {/* Kanban Board */}
          <div className="flex flex-1 gap-1.5 p-1.5">
            {/* Column 1: To Do */}
            <div className="bg-secondary flex flex-1 flex-col gap-1.5 rounded p-1">
              <div className="bg-neutral-high mb-0.5 h-1 w-6 rounded-full" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`todo-${i}`} className="border-primary bg-primary h-5 w-full rounded-sm border shadow-sm" />
              ))}
            </div>

            {/* Column 2: In Progress */}
            <div className="bg-secondary flex flex-1 flex-col gap-1.5 rounded p-1">
              <div className="bg-blue mb-0.5 h-1 w-6 rounded-full" />
              <div className="border-primary bg-primary h-5 w-full rounded-sm border shadow-sm" />
            </div>

            {/* Column 3: Done */}
            <div className="bg-secondary flex flex-1 flex-col gap-1.5 rounded p-1">
              <div className="bg-green mb-0.5 h-1 w-6 rounded-full" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`done-${i}`} className="border-primary bg-primary h-5 w-full rounded-sm border shadow-sm" />
              ))}
            </div>
          </div>

          {/* Animated Task Card (Dragging) */}
          <motion.div
            className="border-blue bg-primary absolute h-5 w-15 rounded-sm border shadow-md"
            animate={{
              left: ["8px", "8px", "79px", "79px", "150px", "150px", "8px"],
              top: ["68px", "68px", "42px", "42px", "68px", "68px", "68px"],
              scale: [1, 1.05, 1, 1.05, 1, 1.05, 1],
              rotate: [0, -3, 0, 3, 0, -2, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-blue m-1 h-1 w-6 rounded-full" />
            <div className="bg-neutral-med mx-1 h-0.5 w-8 rounded-full" />
          </motion.div>
        </div>
      </BrowserIllustration>
    </div>
  )
}