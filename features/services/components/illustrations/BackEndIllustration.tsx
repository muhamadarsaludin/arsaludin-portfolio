"use client"

import { motion } from "framer-motion"
import BrowserIllustration from "./BrowserIllustration"
import clsx from "clsx"

export default function BackEndIllustration() {
  const colors = ["bg-red", "bg-blue", "bg-green", "bg-yellow"]

  return (
    <BrowserIllustration>
      <div className="relative flex h-full w-full flex-col items-center justify-between px-1 py-2 text-primary">
        
        {/* Top layer: Terminal and Microservice */}
        <div className="relative z-10 flex w-full items-center justify-between px-2">
          
          {/* Connection Lines (U-shape) */}
          <div className="border-neutral-med absolute top-[100%] right-[28px] left-[34px] h-1.5 rounded-b-sm border-x border-b" />
          <div className="bg-neutral-med absolute top-[100%] left-1/2 mt-1.5 h-1.5 w-[1px] -translate-x-1/2" />

          {/* Floating Terminal Logs */}
          <div className="border-primary bg-secondary z-10 flex h-8 w-[52px] flex-col overflow-hidden rounded border shadow-sm">
            <div className="border-primary bg-primary flex h-[8px] w-full shrink-0 items-center gap-[2.5px] border-b px-1">
              <div className="h-[2.5px] w-[2.5px] rounded-full bg-red" />
              <div className="h-[2.5px] w-[2.5px] rounded-full bg-yellow" />
              <div className="h-[2.5px] w-[2.5px] rounded-full bg-green" />
            </div>
            <div className="flex flex-1 items-start overflow-hidden p-[3px]">
              <motion.div
                className="flex w-full flex-col gap-[2.5px]"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                <div className="bg-neutral-high h-0.5 w-3/4 rounded-full" />
                <div className="bg-blue h-0.5 w-1/2 rounded-full" />
                <div className="bg-neutral-high h-0.5 w-full rounded-full" />
                <div className="bg-green h-0.5 w-2/3 rounded-full" />
              </motion.div>
            </div>
          </div>

          {/* Microservice / Worker Node */}
          <div className="border-primary bg-secondary z-10 flex h-7 w-10 flex-col items-center justify-center gap-[3px] rounded border shadow-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="border-blue h-2 w-2 rounded-[2px] border border-dashed"
            />
            <div className="bg-neutral-high h-[2px] w-5 rounded-full" />
          </div>
        </div>

        {/* Server / API Node */}
        <div className="border-primary bg-secondary relative z-10 mt-3 flex h-6 w-24 items-center justify-between rounded border px-1.5 shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="bg-neutral-high h-[2px] w-7 rounded-full" />
            <div className="bg-neutral-med h-[2px] w-4 rounded-full" />
          </div>
          <div className="flex gap-[3px]">
            {/* Status Indicators Loop */}
            {Array.from({ length: 2 }).map((_, i) => (
              <motion.div
                key={`status-${i}`}
                className={clsx("h-1 w-1 rounded-full", i === 0 ? "bg-green" : "bg-blue")}
                animate={{ opacity: [0.3, 1, 0.3] }} // Opacity di motion tetap oke karena ini animasi visual
                transition={{ duration: 1, delay: i * 0.5, repeat: Infinity }}
              />
            ))}
          </div>
        </div>

        {/* Data Connection Lines (Vertical) */}
        <div className="relative z-0 flex h-5 w-12 shrink-0 justify-between">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`line-${i}`} className="bg-neutral-med relative h-full w-[1px]">
              <motion.div
                className={clsx(
                  "absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full shadow-sm",
                  colors[i % colors.length]
                )}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ 
                  duration: 2, 
                  ease: "easeInOut", 
                  repeat: Infinity, 
                  delay: i * 0.6 
                }}
              />
            </div>
          ))}
        </div>

        {/* Database Cylinder */}
        <div className="relative z-10 mb-0.5 h-[28px] w-[52px] shrink-0 drop-shadow-sm">
          {/* Bottom Disk */}
          <div className="border-primary bg-secondary absolute bottom-0 z-0 h-[10px] w-full rounded-[50%] border" />

          {/* Cylinder Body */}
          <div className="border-primary bg-secondary absolute top-[5px] z-10 h-[18px] w-full border-x" />

          {/* Middle Ring */}
          <div className="border-neutral-med absolute top-[10px] z-20 h-[10px] w-full rounded-[50%] border-b" />

          {/* Top Disk */}
          <div className="border-primary bg-secondary absolute top-0 z-30 flex h-[10px] w-full items-center justify-center rounded-[50%] border">
            <motion.div
              className="border-blue absolute h-full w-full rounded-[50%] border"
              animate={{ scale: [0.4, 0.85], opacity: [1, 0] }}
              transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    </BrowserIllustration>
  )
}