'use client'

import { motion } from 'framer-motion'
import BrowserIllustration from './BrowserIllustration'

export default function UxIllustration() {
  return (
    <BrowserIllustration>
      <div className="flex h-full w-full relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-0 grid grid-cols-4 gap-1 p-2 opacity-20 dark:opacity-30">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border border-dashed border-neutral-500 dark:border-neutral-400" />
          ))}
        </div>

        {/* Main Workspace */}
        <div className="relative z-1 flex flex-1 overflow-hidden">
          {/* Left Panel: Layers */}
          <div className="w-15 border-r border-primary bg-surface-secondary flex">
            <div className="h-full w-fit flex flex-col gap-1 border-r border-primary p-1 items-center">
              <div className="w-2 h-2 rounded-xs bg-neutral-400 dark:bg-neutral-600"/>
              <hr className="w-2 border-[0.5px] border-primary"/>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700"/>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-1 p-1">
              <div className="flex flex-col gap-0.5 pb-1 border-b border-primary">
                <div className="h-1 w-full rounded bg-neutral-400 dark:bg-neutral-600" />
                <div className="h-0.5 w-3/4 rounded bg-neutral-300 dark:bg-neutral-700" />
              </div>
              <div className="flex flex-col gap-1 pb-1">
                <div className="h-0.5 w-3/4 rounded bg-neutral-400 dark:bg-neutral-600"/>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-0.5 w-full rounded bg-neutral-300 dark:bg-neutral-700"/>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Canvas / Artboard */}
          <div className="flex flex-1 items-center justify-center">
            <motion.div 
              className="relative flex h-16 flex-col gap-1 border border-blue-400 dark:border-blue-500 bg-white p-1 shadow-sm dark:bg-neutral-800"
              animate={{ width: ['64px', '64px', '64px', '84px', '64px', '64px'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Selection Handles */}
              <div className="absolute -left-1 -top-1 h-1.5 w-1.5 border border-blue-400 dark:border-blue-500 bg-white" />
              <div className="absolute -right-1 -top-1 h-1.5 w-1.5 border border-blue-400 dark:border-blue-500 bg-white" />
              <div className="absolute -bottom-1 -left-1 h-1.5 w-1.5 border border-blue-400 dark:border-blue-500 bg-white" />
              <div className="absolute -bottom-1 -right-1 h-1.5 w-1.5 border border-blue-400 dark:border-blue-500 bg-white" />
              
              {/* Internal Artboard Content */}
              <div className="h-2 w-full rounded-sm bg-neutral-300 dark:bg-neutral-700" />
              <motion.div 
                className="h-6 w-full rounded-sm"
                animate={{ backgroundColor: ['#171717', '#3b82f6', '#171717', '#171717', '#171717', '#171717'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>

          {/* Right Panel: Properties & Color Code */}
          <div className="w-16 shrink-0 border-l border-primary p-1 bg-surface-secondary flex flex-col gap-1">
            <div className="flex gap-1 justify-between pb-1 border-b border-primary">
              <div className="h-2 w-2 rounded bg-neutral-400 dark:bg-neutral-600 shrink-0"/>
              <div className="h-2 w-4 rounded-xs bg-blue-400 dark:bg-blue-500"/>
            </div>
            
            {/* Fill property with Hex */}
            <div className="h-1 w-3/4 rounded bg-neutral-400 dark:bg-neutral-600"/>
            <div className="flex items-center gap-1 rounded border border-neutral-300 bg-white p-0.5 shadow-sm dark:border-neutral-600 dark:bg-neutral-800">
              <div className="h-2.5 w-2.5 shrink-0 rounded-sm border-[1.5px] border-neutral-400 bg-transparent" />
              <span className="text-[6px] font-mono tracking-tighter text-neutral-700 dark:text-neutral-300">#171717</span>
            </div>
            <motion.div 
              className="flex items-center gap-1 rounded border border-neutral-300 bg-white p-0.5 shadow-sm dark:border-neutral-600 dark:bg-neutral-800"
              animate={{ borderColor: ['#d4d4d8', '#3b82f6', '#d4d4d8', '#d4d4d8', '#d4d4d8', '#d4d4d8'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-sm bg-[#3b82f6] dark:border dark:border-neutral-600" />
              <span className="text-[6px] font-mono tracking-tighter text-primary">#3b82f6</span>
            </motion.div>
          </div>
        </div>


        {/* Simulated Cursor */}
        <motion.div 
          className="absolute z-20 drop-shadow-md"
          animate={{
            // Alur: Diam di Properties (10%) -> Klik (20%) -> Pindah ke Handle Canvas (30-40%) -> Drag (50-60%) -> Kembali (80-100%)
            left: ['80%', '80%', '80%', '64%', '64%', '73%', '64%', '80%'],
            top: ['40%', '40%', '40%', '70%', '70%', '70%', '70%', '40%'],
            scale: [1, 0.8, 1, 1, 0.9, 0.9, 1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-neutral-600 dark:text-neutral-400">
            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </BrowserIllustration>
  )
}