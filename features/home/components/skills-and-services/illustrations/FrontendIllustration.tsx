'use client'

import { motion } from 'framer-motion'
import BrowserIllustration from './BrowserIllustration'
import clsx from 'clsx'

export default function FrontEndIllustration() {
  const colors = [
    "bg-red-400 dark:bg-red-500",
    "bg-blue-400 dark:bg-blue-500",
    "bg-green-400 dark:bg-green-500",
    "bg-yellow-400 dark:bg-yellow-500",
  ]
  return (
    <BrowserIllustration>
      <div className="flex h-full items-start relative">
        {/* Sidebar */}
        <div className="w-fit h-full bottom-0 flex flex-col justify-between gap-1 p-1 border-r border-primary overflow-hidden relative bg-surface-secondary">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-6 border-[0.5px] border-primary relative overflow-hidden rounded-md">
              <div className="absolute -bottom-3 -left-1.5 h-6 w-6 rotate-45 rounded-xs bg-neutral-400 dark:bg-neutral-600" />
              <div className="absolute -bottom-2 left-2.5 h-4 w-4 rotate-45 rounded-xs bg-neutral-300 dark:bg-neutral-700" />
            </div>
            <div className='flex flex-col gap-0.5'>
              <div className="h-0.5 w-full shrink-0 rounded-sm bg-neutral-400 dark:bg-neutral-600" />
              <div className="h-0.5 w-full shrink-0 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
              <div className="h-0.5 w-full shrink-0 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
              <div className="h-0.5 w-3/4 shrink-0 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-600"></div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden relative">
          {/* Top Navbar */}
          <div className="flex w-full items-center justify-between border-b border-primary p-1 absolute top-0 left-0 right-0 z-1 bg-surface-secondary">
            <div className="h-2 w-2 rounded-xs bg-neutral-400 dark:bg-neutral-600" />
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={clsx(
                  "h-1 w-4 rounded-full",
                  i === 1 ? "bg-blue-400 dark:bg-blue-500" : "bg-neutral-300 dark:bg-neutral-700"
                )} />
              ))}
            </div>
          </div>

          {/* Animated Content */}
          <motion.div 
            className="mt-6 flex flex-col gap-1.5 px-2"
            animate={{ y: [0, -50, 0] }} 
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
            <div 
              className="relative h-10 w-full shrink-0 overflow-hidden rounded bg-surface-secondary">
              <div className="absolute -bottom-5 left-2 h-10 w-10 rotate-45 rounded-sm bg-neutral-400 dark:bg-neutral-600" />
              <div className="absolute -bottom-4 left-8 h-8 w-8 rotate-45 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-6 rounded overflow-hidden relative bg-surface-secondary"
                >
                  <div
                    className={clsx(
                      "absolute bottom-0 left-0 right-0 h-1",
                      colors[i % colors.length]
                    )}
                  />
                </div>
              ))}
            </div>
            
            {/*Chart */}
            <div className="flex gap-1.5 h-fit">
              <div className="flex items-end gap-[2px] w-fit min-h-full rounded p-1 bg-surface-secondary">
                {[4, 7, 3, 6, 5].map((h, i) => (
                  <motion.div
                    key={i}
                    className={clsx("w-1 rounded-sm", colors[i % colors.length])}
                    initial={{ height: 0 }}
                    animate={{ height: `${h * 4}px` }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded px-1 py-1 bg-surface-secondary"
                  >
                    <div className="h-3 w-3 rounded bg-neutral-400 dark:bg-neutral-600" />
                    <div className="flex flex-col gap-0.5 flex-1">
                      <div className="h-0.5 w-3/4 bg-neutral-400 dark:bg-neutral-600 rounded" />
                      <div className="h-0.5 w-1/2 bg-neutral-300 dark:bg-neutral-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card List */}
            <div className="flex flex-col gap-1 flex-1">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded px-1 py-1 bg-surface-secondary"
                >
                  <div className="flex flex-col gap-0.5 flex-1">
                    <div className="h-0.5 w-3/4 bg-neutral-400 dark:bg-neutral-600 rounded" />
                    <div className="h-0.5 w-1/2 bg-neutral-300 dark:bg-neutral-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Simulated Cursor */}
        <motion.div 
          className="absolute z-20 drop-shadow-md"
          animate={{
            left: ['80%', '80%', '80%', '64%', '64%', '73%', '64%', '80%'],
            top: ['45%', '45%', '45%', '55%', '55%', '55%', '55%', '45%'],
            scale: [1, 0.8, 1, 1, 0.9, 0.9, 1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-neutral-600 dark:text-neutral-400">
            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </BrowserIllustration>
  )
}