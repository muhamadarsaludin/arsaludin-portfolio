'use client'

import { motion } from 'framer-motion'

export default function DevopsIllustration() {
  return (
    <div className="relative flex h-36 w-52 items-center justify-center overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950">
      
      {/* Circular Path / CI/CD Pipeline */}
      <div className="absolute h-24 w-24 rounded-full border-[1.5px] border-dashed border-neutral-400 dark:border-neutral-600" />
      
      {/* Orbiting Automation Dot */}
      <motion.div
        className="absolute flex h-24 w-24 items-start justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <div className="h-2.5 w-2.5 -mt-[5px] rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] dark:bg-blue-400" />
      </motion.div>

      {/* Nodes Container */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        
        {/* Top: Code/Git */}
        <div className="absolute -translate-y-[48px] flex h-7 w-7 items-center justify-center rounded border border-neutral-400 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-900">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-400">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>

        {/* Right: Build/Test (Gear) */}
        <div className="absolute translate-x-[48px] flex h-7 w-7 items-center justify-center rounded border border-neutral-400 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-900">
          <motion.div
            className="h-3.5 w-3.5 rounded-full border-2 border-dashed border-neutral-600 dark:border-neutral-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Bottom: Deploy (Servers) */}
        <div className="absolute translate-y-[48px] flex h-7 w-7 flex-col items-center justify-center gap-[3px] rounded border border-neutral-400 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-900">
          <div className="h-1.5 w-4 rounded-[1px] border border-neutral-500 bg-neutral-200 dark:border-neutral-400 dark:bg-neutral-700" />
          <div className="h-1.5 w-4 rounded-[1px] border border-neutral-500 bg-neutral-200 dark:border-neutral-400 dark:bg-neutral-700" />
        </div>

        {/* Left: Monitor (Chart) */}
        <div className="absolute -translate-x-[48px] flex h-7 w-7 items-end justify-center gap-[2px] rounded border border-neutral-400 bg-white p-[5px] shadow-sm dark:border-neutral-600 dark:bg-neutral-900">
          <motion.div className="w-[3px] rounded-t-sm bg-emerald-500" animate={{ height: ['40%', '90%', '40%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="w-[3px] rounded-t-sm bg-emerald-500" animate={{ height: ['80%', '30%', '80%'] }} transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="w-[3px] rounded-t-sm bg-emerald-500" animate={{ height: ['50%', '100%', '50%'] }} transition={{ duration: 2, delay: 1, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
      </div>

      {/* Center: Cloud/Hub Node */}
      <motion.div 
        className="relative z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-400 bg-neutral-200 shadow-md dark:border-neutral-500 dark:bg-neutral-800"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-700 dark:text-neutral-300">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </svg>
      </motion.div>

    </div>
  )
}