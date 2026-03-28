'use client'

import { motion } from 'framer-motion'
import MobileIllustration from './MobileIllustration'
import clsx from 'clsx'

export default function AndroidIllustration() {
  const colors = [
    "bg-red-400 dark:bg-red-500",
    "bg-blue-400 dark:bg-blue-500",
    "bg-green-400 dark:bg-green-500",
    "bg-yellow-400 dark:bg-yellow-500",
  ]
  return (
    <MobileIllustration>
      {/* Top Navbar */}
      <div className="relative h-full w-full overflow-hidden">
        <div className="flex w-full items-center justify-between border-b border-primary p-1 absolute top-0 left-0 right-0 z-1 bg-surface-secondary">
          <div className="h-2 w-2 rounded-xs bg-neutral-400 dark:bg-neutral-600" />
          <div className="flex flex-col gap-px">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-px w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            ))}
          </div>
        </div>
        
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
          <div className="flex flex-col gap-1.5 h-fit">
            <div className="flex items-end gap-[2px] w-full h-12 rounded p-1 bg-surface-secondary">
              {[4, 7, 3, 6, 5].map((h, i) => (
                <motion.div
                  key={i}
                  className={clsx("w-full rounded-sm", colors[i % colors.length])}
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
        </motion.div>
      </div>
    </MobileIllustration>
    // <div className="relative flex h-36 w-52 items-center justify-center overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950">
    //   {/* Mobile Phone Frame */}
    //   <div className="relative h-32 w-20 overflow-hidden rounded-xl border-2 border-neutral-400 bg-neutral-100 shadow-sm dark:border-neutral-600 dark:bg-neutral-900">
        
    //     {/* Camera Notch */}
    //     <div className="absolute left-1/2 top-0 z-20 h-2 w-6 -translate-x-1/2 rounded-b-md bg-neutral-400 dark:bg-neutral-600" />
        
    //     {/* App Bar (Header) */}
    //     <div className="absolute top-0 z-10 flex w-full items-center justify-between bg-neutral-200/90 px-1.5 pb-1 pt-2.5 backdrop-blur-md dark:bg-neutral-800/90">
    //       {/* Android Icon */}
    //       <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-emerald-500">
    //         <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.81.24L16.5 8.9A9.9 9.9 0 0012 8c-1.6 0-3.11.38-4.5 1.05L5.63 5.69c-.16-.3-.52-.39-.81-.24-.3.16-.42.54-.26.85l1.84 3.18C3.82 11.23 2 13.9 2 17h20c0-3.1-1.82-5.77-4.4-7.52zM7 14.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
    //       </svg>
    //       {/* Context Menu Dots */}
    //       <div className="flex gap-0.5">
    //         <div className="h-0.5 w-0.5 rounded-full bg-neutral-500 dark:bg-neutral-400" />
    //         <div className="h-0.5 w-0.5 rounded-full bg-neutral-500 dark:bg-neutral-400" />
    //         <div className="h-0.5 w-0.5 rounded-full bg-neutral-500 dark:bg-neutral-400" />
    //       </div>
    //     </div>

    //     {/* App Content Scrolling */}
    //     <motion.div 
    //       className="mt-6 flex flex-col gap-1.5 px-1.5 pb-8"
    //       animate={{ y: [0, -55, 0] }} 
    //       transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    //     >
    //       {/* Hero Banner */}
    //       <div className="h-10 w-full shrink-0 rounded bg-neutral-200 dark:bg-neutral-800" />
          
    //       {/* Grid Section */}
    //       <div className="flex shrink-0 gap-1.5">
    //         <div className="h-10 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
    //         <div className="h-10 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
    //       </div>

    //       {/* List Section */}
    //       {[1, 2, 3].map(i => (
    //         <div key={i} className="flex shrink-0 items-center gap-1.5 rounded bg-neutral-200 p-1 dark:bg-neutral-800">
    //           <div className="h-4 w-4 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
    //           <div className="flex w-full flex-col gap-0.5">
    //             <div className="h-1 w-full rounded-full bg-neutral-300 dark:bg-neutral-700" />
    //             <div className="h-1 w-2/3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
    //           </div>
    //         </div>
    //       ))}
    //     </motion.div>

    //     {/* Floating Action Button (FAB) */}
    //     <motion.div 
    //       className="absolute bottom-6 right-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow"
    //       animate={{ scale: [1, 1.15, 1] }}
    //       transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    //     >
    //       <svg viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5">
    //         <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    //       </svg>
    //     </motion.div>

    //     {/* Bottom Navigation */}
    //     <div className="absolute bottom-0 z-10 flex h-4 w-full items-center justify-around border-t border-neutral-300 bg-neutral-100/90 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/90">
    //       <div className="h-1 w-3 rounded-full bg-neutral-400 dark:bg-neutral-500" />
    //       <div className="h-1 w-3 rounded-full bg-emerald-500" />
    //       <div className="h-1 w-3 rounded-full bg-neutral-400 dark:bg-neutral-500" />
    //     </div>
    //   </div>
    // </div>
  )
}