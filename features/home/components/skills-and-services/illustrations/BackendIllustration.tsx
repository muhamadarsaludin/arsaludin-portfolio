'use client'

import { motion } from 'framer-motion'

export default function BackEndIllustration() {
  return (
    <div className="relative flex h-36 w-52 flex-col items-center justify-center overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950">
      
      {/* Floating Terminal Logs */}
      <div className="absolute left-1 top-1.5 z-20 flex h-12 w-[68px] flex-col overflow-hidden rounded border border-neutral-400 bg-neutral-800 shadow-sm dark:border-neutral-600 dark:bg-neutral-900">
        <div className="flex h-2 w-full items-center gap-0.5 bg-neutral-300 px-1 dark:bg-neutral-700">
          <div className="h-0.5 w-0.5 rounded-full bg-red-400" />
          <div className="h-0.5 w-0.5 rounded-full bg-amber-400" />
          <div className="h-0.5 w-0.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 overflow-hidden p-1">
          <motion.div
            className="flex flex-col gap-1"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            <div className="h-0.5 w-10 bg-emerald-400" />
            <div className="h-0.5 w-6 bg-emerald-400" />
            <div className="h-0.5 w-12 bg-emerald-400" />
            <div className="h-0.5 w-8 bg-emerald-400" />
            <div className="h-0.5 w-4 bg-emerald-400" />
            <div className="h-0.5 w-10 bg-emerald-400" />
          </motion.div>
        </div>
      </div>

      {/* Microservice / Worker Node */}
      <div className="absolute right-1.5 top-2.5 z-20 flex h-10 w-12 flex-col items-center justify-center gap-1.5 rounded border border-neutral-400 bg-neutral-200 shadow-sm dark:border-neutral-600 dark:bg-neutral-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="h-3 w-3 rounded-sm border-[1.5px] border-dashed border-neutral-500 dark:border-neutral-400"
        />
        <div className="h-0.5 w-6 rounded-full bg-neutral-400 dark:bg-neutral-500" />
      </div>

      {/* Network Connecting Lines to Side Nodes */}
      <div className="absolute left-[4.5rem] top-7 z-0 h-px w-5 bg-neutral-300 dark:bg-neutral-700" />
      <div className="absolute right-[3.5rem] top-7 z-0 h-px w-7 bg-neutral-300 dark:bg-neutral-700" />

      {/* Server / API Node */}
      <div className="relative z-10 flex h-8 w-28 items-center justify-between rounded-md border border-neutral-400 bg-neutral-200 px-2 shadow-sm dark:border-neutral-600 dark:bg-neutral-800">
        <div className="flex flex-col gap-1">
          <div className="h-1 w-8 rounded-full bg-neutral-400 dark:bg-neutral-600" />
          <div className="h-1 w-5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
        </div>
        <div className="flex gap-1">
          <motion.div 
            className="h-1.5 w-1.5 rounded-full bg-neutral-500 dark:bg-neutral-400"
            animate={{ opacity: [0.2, 1, 0.2] }} 
            transition={{ duration: 1, repeat: Infinity }} 
          />
          <motion.div 
            className="h-1.5 w-1.5 rounded-full bg-neutral-500 dark:bg-neutral-400"
            animate={{ opacity: [0.3, 1, 0.3] }} 
            transition={{ duration: 1, delay: 0.5, repeat: Infinity }} 
          />
        </div>
      </div>

      {/* Data Connection Lines (Request & Response) */}
      <div className="relative z-0 -my-2 flex h-10 w-16 justify-between">
        {[0, 0.6, 1.2].map((delay, i) => (
          <div key={i} className="relative h-full w-px bg-neutral-300 dark:bg-neutral-700">
            <motion.div
              className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-neutral-500 dark:bg-neutral-400"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, delay }}
            />
          </div>
        ))}
      </div>

      {/* Database Cylinder / Disk Stack */}
      <div className="relative z-10 h-[60px] w-24 drop-shadow-sm">
        <div className="absolute top-9 z-10 h-6 w-full rounded-[50%] border border-neutral-400 bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-800" />
        <div className="absolute top-3 z-20 h-[36px] w-full border-x border-neutral-400 bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-800" />
        <div className="absolute top-3 z-30 h-6 w-full rounded-[50%] border-b border-neutral-400 dark:border-neutral-600" />
        <div className="absolute top-6 z-30 h-6 w-full rounded-[50%] border-b border-neutral-400 dark:border-neutral-600" />
        <div className="absolute top-0 z-40 flex h-6 w-full items-center justify-center rounded-[50%] border border-neutral-400 bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-800">
           <motion.div 
             className="absolute h-full w-full rounded-[50%] border border-neutral-400 dark:border-neutral-500"
             animate={{ scale: [0.8, 1.2], opacity: [1, 0] }}
             transition={{ duration: 2, ease: 'easeOut', repeat: Infinity }}
           />
        </div>
      </div>

    </div>
  )
}