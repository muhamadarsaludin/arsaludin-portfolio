'use client'

import { motion } from 'framer-motion'

export default function FrontendIllustration() {
  return (
    <div className="relative h-36 w-52 overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950">
      {/* Browser header */}
      <div className="flex items-center gap-1 border-b border-neutral-300 bg-neutral-200 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-2 w-2 rounded-full border border-neutral-400 dark:border-neutral-600" />
        ))}
        {/* URL Bar */}
        <div className="ml-1 h-2 flex-1 rounded-sm bg-neutral-300/50 dark:bg-neutral-700/50" />
      </div>
      {/* Content Area */}
      <div className="flex h-full gap-2 p-2">
        {/* Sidebar Animating Width */}
        <motion.div 
          className="flex h-full flex-col gap-1.5 overflow-hidden rounded border border-neutral-300 bg-neutral-200 p-1 dark:border-neutral-700 dark:bg-neutral-800"
          animate={{ width: ['48px', '16px', '48px'] }} 
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} 
        >
          {/* Sidebar Items */}
          <div className="h-1.5 w-full shrink-0 rounded-sm bg-neutral-300 dark:bg-neutral-600" />
          <div className="h-1.5 w-3/4 shrink-0 rounded-sm bg-neutral-300 dark:bg-neutral-600" />
          <div className="h-1.5 w-5/6 shrink-0 rounded-sm bg-neutral-300 dark:bg-neutral-600" />
          {/* Profile Icon at bottom */}
          <div className="mt-auto h-3 w-3 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        </motion.div>
        {/* Main Content Layout */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden">
          {/* Top Navbar */}
          <div className="flex w-full items-center justify-between border-b border-neutral-300 pb-1 dark:border-neutral-700">
            <div className="h-1.5 w-8 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <div className="h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-600" />
          </div>

          {/* Image Placeholder with Mountains */}
          <motion.div 
            className="relative h-10 w-full shrink-0 overflow-hidden rounded border border-neutral-300 bg-neutral-200/50 dark:border-neutral-700 dark:bg-neutral-800/50"
            animate={{ opacity: [0.6, 1, 0.6] }} 
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} 
          >
            {/* Sun */}
            <motion.div 
              className="absolute right-3 top-2 h-3 w-3 rounded-full bg-neutral-400 dark:bg-neutral-500"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Mountains */}
            <div className="absolute -bottom-4 left-2 h-8 w-8 rotate-45 rounded-sm bg-neutral-400 dark:bg-neutral-600" />
            <div className="absolute -bottom-5 left-7 h-10 w-10 rotate-45 rounded-sm bg-neutral-300 dark:bg-neutral-500" />
          </motion.div>
          
          {/* Dashboard / Grid Data */}
          <div className="flex flex-1 gap-1.5">
            {/* Bar Chart Block */}
            <div className="flex flex-1 items-end justify-between gap-1 rounded border border-neutral-300 bg-neutral-200/50 p-1 dark:border-neutral-700 dark:bg-neutral-800/50">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i} 
                  className="w-full rounded-t-sm bg-neutral-400 dark:bg-neutral-500"
                  animate={{ height: ['40%', '80%', '50%', '40%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }} 
                />
              ))}
            </div>
            {/* List Block */}
            <div className="flex flex-1 flex-col justify-between rounded border border-neutral-300 bg-neutral-200/50 p-1 dark:border-neutral-700 dark:bg-neutral-800/50">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-1"><div className="h-1.5 w-1.5 shrink-0 rounded-sm bg-neutral-400 dark:bg-neutral-600" /><div className="h-1 w-full rounded-full bg-neutral-300 dark:bg-neutral-700" /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}