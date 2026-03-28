'use client'

import { motion } from 'framer-motion'
import BrowserIllustration from './BrowserIllustration'
import clsx from 'clsx'

export default function BackEndIllustration() {
  const colors = [
    "bg-red-400 dark:bg-red-500",
    "bg-blue-400 dark:bg-blue-500",
    "bg-green-400 dark:bg-green-500",
    "bg-yellow-400 dark:bg-yellow-500",
  ]

  return (
    <BrowserIllustration>
      <div className="flex h-full w-full flex-col items-center justify-between py-2 px-1 relative">
        
        {/* Top layer: Terminal and Microservice */}
        <div className="flex w-full items-center justify-between px-2 z-10 relative">
          
          {/* Connection Lines (U-shape connecting Logs and Worker to Server) */}
          <div className="absolute top-[100%] left-[34px] right-[28px] h-1.5 border-b-[1px] border-x-[1px] border-neutral-300 dark:border-neutral-700 rounded-b-sm" />
          <div className="absolute top-[100%] mt-1.5 left-1/2 h-1.5 w-[1px] -translate-x-1/2 bg-neutral-300 dark:bg-neutral-700" />

          {/* Floating Terminal Logs */}
          <div className="flex h-8 w-[52px] flex-col overflow-hidden rounded border border-primary bg-surface-secondary shadow-sm z-10">
            <div className="flex h-[8px] w-full items-center gap-[2.5px] border-b border-primary bg-surface-primary px-1 shrink-0">
              <div className="h-[2.5px] w-[2.5px] rounded-full bg-red-400 dark:bg-red-500" />
              <div className="h-[2.5px] w-[2.5px] rounded-full bg-yellow-400 dark:bg-yellow-500" />
              <div className="h-[2.5px] w-[2.5px] rounded-full bg-green-400 dark:bg-green-500" />
            </div>
            <div className="flex-1 overflow-hidden p-[3px] bg-surface-secondary flex items-start">
              <motion.div
                className="flex flex-col gap-[2.5px] w-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              >
                <div className="h-0.5 w-3/4 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                <div className="h-0.5 w-1/2 rounded-full bg-blue-400 dark:bg-blue-500" />
                <div className="h-0.5 w-full rounded-full bg-neutral-400 dark:bg-neutral-500" />
                <div className="h-0.5 w-2/3 rounded-full bg-emerald-400 dark:bg-emerald-500" />
              </motion.div>
            </div>
          </div>

          {/* Microservice / Worker Node */}
          <div className="flex h-7 w-10 flex-col items-center justify-center gap-[3px] rounded border border-primary bg-surface-secondary shadow-sm z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="h-2 w-2 rounded-[2px] border border-dashed border-blue-400 dark:border-blue-500"
            />
            <div className="h-[2px] w-5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
          </div>
        </div>

        {/* Server / API Node */}
        <div className="relative z-10 mt-3 flex h-6 w-24 items-center justify-between rounded border border-primary bg-surface-secondary px-1.5 shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="h-[2px] w-7 rounded-full bg-neutral-400 dark:bg-neutral-600" />
            <div className="h-[2px] w-4 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          </div>
          <div className="flex gap-[3px]">
            <motion.div 
              className="h-1 w-1 rounded-full bg-green-400 dark:bg-green-500"
              animate={{ opacity: [0.3, 1, 0.3] }} 
              transition={{ duration: 1, repeat: Infinity }} 
            />
            <motion.div 
              className="h-1 w-1 rounded-full bg-blue-400 dark:bg-blue-500"
              animate={{ opacity: [0.3, 1, 0.3] }} 
              transition={{ duration: 1, delay: 0.5, repeat: Infinity }} 
            />
          </div>
        </div>

        {/* Data Connection Lines (Vertical) */}
        <div className="relative z-0 flex h-5 w-12 justify-between shrink-0">
          {[0, 0.6, 1.2].map((delay, i) => (
            <div key={i} className="relative h-full w-[1px] bg-neutral-300 dark:bg-neutral-700">
              <motion.div
                className={clsx(
                  "absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full shadow-sm",
                  colors[i % colors.length]
                )}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, delay }}
              />
            </div>
          ))}
        </div>

        {/* Database Cylinder / Disk Stack */}
        <div className="relative z-10 h-[28px] w-[52px] drop-shadow-sm shrink-0 mb-0.5">
          {/* Bottom Disk */}
          <div className="absolute bottom-0 z-0 h-[10px] w-full rounded-[50%] border border-primary bg-surface-secondary" />
          
          {/* Cylinder Body */}
          <div className="absolute top-[5px] z-10 h-[18px] w-full border-x border-primary bg-surface-secondary" />
          
          {/* Middle Ring */}
          <div className="absolute top-[10px] z-20 h-[10px] w-full rounded-[50%] border-b border-primary" />
          
          {/* Top Disk */}
          <div className="absolute top-0 z-30 h-[10px] w-full rounded-[50%] border border-primary bg-surface-secondary flex items-center justify-center">
            <motion.div 
              className="absolute h-full w-full rounded-[50%] border border-blue-400 dark:border-blue-500"
              animate={{ scale: [0.4, 0.85], opacity: [1, 0] }}
              transition={{ duration: 2, ease: 'easeOut', repeat: Infinity }}
            />
          </div>
        </div>

      </div>
    </BrowserIllustration>
  )
}