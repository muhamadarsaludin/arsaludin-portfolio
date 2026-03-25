'use client'

import { motion } from 'framer-motion'

export default function PmIllustration() {
  return (
    <div className="relative flex h-36 w-52 flex-col overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950">
      {/* Header Tool Bar */}
      <div className="flex h-6 w-full shrink-0 items-center justify-between border-b border-neutral-300 bg-neutral-200/90 px-2 dark:border-neutral-700 dark:bg-neutral-900/90">
        <div className="h-2 w-12 rounded-full bg-neutral-400 dark:bg-neutral-500" />
        <div className="flex gap-1">
          <div className="h-1 w-1 rounded-full bg-neutral-400 dark:bg-neutral-500" />
          <div className="h-1 w-1 rounded-full bg-neutral-400 dark:bg-neutral-500" />
          <div className="h-1 w-1 rounded-full bg-neutral-400 dark:bg-neutral-500" />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex flex-1 gap-1.5 p-1.5">
        {/* Column 1: To Do */}
        <div className="flex flex-1 flex-col gap-1.5 rounded bg-neutral-200/50 p-1 dark:bg-neutral-800/50">
          <div className="mb-0.5 h-1 w-6 rounded-full bg-neutral-400 dark:bg-neutral-500" />
          <div className="h-5 w-full rounded-sm border border-neutral-300 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-800" />
          <div className="h-6 w-full rounded-sm border border-neutral-300 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-800" />
        </div>
        
        {/* Column 2: In Progress */}
        <div className="flex flex-1 flex-col gap-1.5 rounded bg-neutral-200/50 p-1 dark:bg-neutral-800/50">
          <div className="mb-0.5 h-1 w-6 rounded-full bg-blue-400 dark:bg-blue-500" />
          <div className="h-6 w-full rounded-sm border border-neutral-300 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-800" />
        </div>

        {/* Column 3: Done */}
        <div className="flex flex-1 flex-col gap-1.5 rounded bg-neutral-200/50 p-1 dark:bg-neutral-800/50">
          <div className="mb-0.5 h-1 w-6 rounded-full bg-emerald-400 dark:bg-emerald-500" />
          <div className="h-4 w-full rounded-sm border border-neutral-300 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-800" />
          <div className="h-5 w-full rounded-sm border border-neutral-300 bg-white shadow-sm dark:border-neutral-600 dark:bg-neutral-800" />
        </div>
      </div>

      {/* Animated Ticket / Card */}
      <motion.div
        className="absolute h-5 w-[53px] rounded-sm border border-blue-400 bg-white shadow-md dark:border-blue-500 dark:bg-neutral-800"
        animate={{
          left: ['10px', '10px', '77px', '77px', '144px', '144px', '10px'],
          top: ['94px', '94px', '70px', '70px', '84px', '84px', '94px'],
          scale: [1, 1.05, 1, 1.05, 1, 1.05, 1],
          rotate: [0, -3, 0, 3, 0, -2, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="m-1 h-1 w-6 rounded-full bg-blue-400/50 dark:bg-blue-500/50" />
        <div className="mx-1 h-0.5 w-8 rounded-full bg-neutral-300 dark:bg-neutral-600" />
      </motion.div>
    </div>
  )
}